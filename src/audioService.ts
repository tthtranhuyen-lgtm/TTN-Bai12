import { AUDIO_SYNCS, MASTER_AUDIO_SRC, AudioWordSync } from './data';

class AudioService {
  private masterAudio: HTMLAudioElement | null = null;
  private currentWordAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private speechRate: number = 0.9;
  private listeners: Set<(state: { isPlaying: boolean; currentTime: number; activeWord: AudioWordSync | null }) => void> = new Set();
  private isSeeking: boolean = false;
  private bgmInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.masterAudio = new Audio(MASTER_AUDIO_SRC);
      this.masterAudio.preload = 'auto';

      this.masterAudio.addEventListener('timeupdate', () => {
        this.notifyListeners();
      });

      this.masterAudio.addEventListener('play', () => this.notifyListeners());
      this.masterAudio.addEventListener('pause', () => this.notifyListeners());
      this.masterAudio.addEventListener('ended', () => this.notifyListeners());
    }
  }

  public setSpeedRate(rate: number) {
    this.speechRate = rate;
    if (this.masterAudio) {
      this.masterAudio.playbackRate = rate;
    }
    if (this.currentWordAudio) {
      this.currentWordAudio.playbackRate = rate;
    }
  }

  public getSpeedRate(): number {
    return this.speechRate;
  }

  public subscribe(fn: (state: { isPlaying: boolean; currentTime: number; activeWord: AudioWordSync | null }) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notifyListeners() {
    if (!this.masterAudio) return;
    const time = this.masterAudio.currentTime;
    const active = this.getActiveWordAtTime(time);
    const state = {
      isPlaying: !this.masterAudio.paused && !this.masterAudio.ended,
      currentTime: time,
      activeWord: active
    };
    this.listeners.forEach((fn) => fn(state));
  }

  public getActiveWordAtTime(time: number): AudioWordSync | null {
    for (const sync of AUDIO_SYNCS) {
      if (time >= sync.start - 0.05 && time <= sync.end + 0.1) {
        return sync;
      }
    }
    return null;
  }

  // Find sync metadata for word or phrase
  public findSync(text: string): AudioWordSync | null {
    const clean = text.trim();
    // Direct match
    const direct = AUDIO_SYNCS.find((s) => s.word === clean || s.id === clean);
    if (direct) return direct;

    // Check alias or partial match
    if (clean.includes('点钟')) return AUDIO_SYNCS.find((s) => s.word === '点钟') || null;
    if (clean.includes('点')) return AUDIO_SYNCS.find((s) => s.word === '点') || null;
    if (clean.includes('分钟')) return AUDIO_SYNCS.find((s) => s.word === '分钟') || null;
    if (clean.includes('分')) return AUDIO_SYNCS.find((s) => s.word === '分') || null;

    // Check if word contains any sync word
    for (const s of AUDIO_SYNCS) {
      if (clean.includes(s.word)) return s;
    }

    return null;
  }

  /**
   * Play a specific word synchronized with the recorded voice audio
   */
  public async playWord(text: string, customRate?: number): Promise<void> {
    const rate = customRate || this.speechRate;
    const sync = this.findSync(text);

    // Stop current master audio or previous word audio
    this.stopAll();

    if (sync) {
      return new Promise<void>((resolve) => {
        try {
          const audio = new Audio(sync.audioFile);
          this.currentWordAudio = audio;
          audio.playbackRate = rate;
          
          audio.onended = () => {
            this.currentWordAudio = null;
            resolve();
          };
          audio.onerror = () => {
            // Fallback to playing from master audio
            this.playSliceFromMaster(sync.start, sync.dur, rate).then(resolve);
          };

          audio.play().catch(() => {
            // Fallback to master
            this.playSliceFromMaster(sync.start, sync.dur, rate).then(resolve);
          });
        } catch {
          this.fallbackSpeech(text, rate).then(resolve);
        }
      });
    } else {
      return this.fallbackSpeech(text, rate);
    }
  }

  /**
   * Play slice directly from master audio
   */
  private playSliceFromMaster(start: number, dur: number, rate: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.masterAudio) {
        resolve();
        return;
      }
      this.masterAudio.pause();
      this.masterAudio.currentTime = start;
      this.masterAudio.playbackRate = rate;

      const stopTime = start + dur / rate;
      const onTime = () => {
        if (this.masterAudio && this.masterAudio.currentTime >= stopTime) {
          this.masterAudio.pause();
          this.masterAudio.removeEventListener('timeupdate', onTime);
          resolve();
        }
      };

      this.masterAudio.addEventListener('timeupdate', onTime);
      this.masterAudio.play().catch(() => resolve());
    });
  }

  /**
   * Fallback to Web Speech API for sentences and unrecorded words
   */
  public fallbackSpeech(text: string, rate: number): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        u.rate = rate;
        u.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const zh = voices.find((v) => /zh[-_]?CN/i.test(v.lang)) || voices.find((v) => /^zh/i.test(v.lang));
        if (zh) u.voice = zh;

        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
      } catch {
        resolve();
      }
    });
  }

  // Master audio controls
  public playMaster() {
    if (this.masterAudio) {
      if (this.currentWordAudio) {
        this.currentWordAudio.pause();
        this.currentWordAudio = null;
      }
      this.masterAudio.playbackRate = this.speechRate;
      this.masterAudio.play().catch(console.warn);
    }
  }

  public pauseMaster() {
    if (this.masterAudio) {
      this.masterAudio.pause();
    }
  }

  public seekMaster(seconds: number) {
    if (this.masterAudio) {
      this.masterAudio.currentTime = Math.max(0, Math.min(seconds, this.masterAudio.duration || 25));
    }
  }

  public jumpToWord(sync: AudioWordSync) {
    if (this.masterAudio) {
      this.seekMaster(sync.start);
      this.playMaster();
    }
  }

  public stopAll() {
    if (this.masterAudio) {
      this.masterAudio.pause();
    }
    if (this.currentWordAudio) {
      this.currentWordAudio.pause();
      this.currentWordAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Web Audio Context for synthesized sound effects
  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playSound(type: 'hit' | 'correct' | 'wrong' | 'victory' | 'click') {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'victory') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.value = freq;
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.25, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
          o.start(now + idx * 0.1);
          o.stop(now + idx * 0.1 + 0.25);
        });
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }

  public startBGM() {
    this.stopBGM();
    try {
      const ctx = this.getAudioContext();
      let step = 0;
      const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 349.23, 329.63, 293.66];
      this.bgmInterval = window.setInterval(() => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = notes[step % notes.length];
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
        step++;
      }, 220);
    } catch {
      // Ignored
    }
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioService = new AudioService();
