import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  PenTool,
  Gamepad2,
  FileText,
  Clock,
  Home,
  CheckCircle2,
  Trophy,
  ChevronRight,
  ExternalLink,
  VolumeX,
  X,
  Share2,
  Download
} from 'lucide-react';
import {
  AUDIO_SYNCS,
  VOCAB,
  WRITE_CHARS,
  FILL_QUESTIONS,
  TIME_QUESTIONS,
  SORT_QUESTIONS,
  VocabItem,
  AudioWordSync
} from './data';
import { audioService } from './audioService';

declare global {
  interface Window {
    HanziWriter?: {
      create: (
        target: HTMLElement | string,
        char: string,
        options: Record<string, unknown>
      ) => {
        animateCharacter: (opts?: Record<string, unknown>) => void;
        quiz: (opts?: Record<string, unknown>) => void;
        cancelQuiz: () => void;
        showCharacter: () => void;
        hideCharacter: () => void;
      };
    };
    html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

const STORAGE_KEY = 'zh_review_bai12_v6';

interface AppState {
  learnedVocab: string[];
  fillDone: number[];
  timeDone: number[];
  sortDone: number[];
  writtenChars: string[];
  gameHighScore: number;
  studentName: string;
  signature: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'vocab' | 'grammar' | 'exercises' | 'write' | 'game' | 'report'>('home');
  const [speedRate, setSpeedRate] = useState<number>(0.9);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio State
  const [currentlyPlayingWord, setCurrentlyPlayingWord] = useState<string | null>(null);

  // Modal State
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);

  // Saved Data
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      learnedVocab: [],
      fillDone: [],
      timeDone: [],
      sortDone: [],
      writtenChars: [],
      gameHighScore: 0,
      studentName: '',
      signature: ''
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            learnedVocab: Array.isArray(parsed.learnedVocab) ? parsed.learnedVocab : [],
            fillDone: Array.isArray(parsed.fillDone) ? parsed.fillDone : [],
            timeDone: Array.isArray(parsed.timeDone) ? parsed.timeDone : [],
            sortDone: Array.isArray(parsed.sortDone) ? parsed.sortDone : [],
            writtenChars: Array.isArray(parsed.writtenChars) ? parsed.writtenChars : [],
            gameHighScore: typeof parsed.gameHighScore === 'number' ? parsed.gameHighScore : 0,
            studentName: typeof parsed.studentName === 'string' ? parsed.studentName : '',
            signature: typeof parsed.signature === 'string' ? parsed.signature : ''
          };
        }
      }
    } catch {
      // Ignore
    }
    return defaultState;
  });

  // Save state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const handleSpeedChange = (rate: number) => {
    setSpeedRate(rate);
    audioService.setSpeedRate(rate);
    showToast(`🔊 Tốc độ đọc: ${rate <= 0.7 ? 'Chậm' : rate <= 1.0 ? 'Vừa' : 'Nhanh'}`);
  };

  const playWord = async (text: string, customRate?: number) => {
    setCurrentlyPlayingWord(text);
    audioService.playSound('click');
    await audioService.playWord(text, customRate || speedRate);
    setCurrentlyPlayingWord(null);
  };

  // Mark vocab as learned
  const markVocabLearned = (hanzi: string) => {
    if (!state.learnedVocab.includes(hanzi)) {
      setState((prev) => ({
        ...prev,
        learnedVocab: [...prev.learnedVocab, hanzi]
      }));
    }
  };

  // Floating bubbles background
  const bubbles = [
    { emoji: '⭐', left: '8%', size: '26px', dur: '22s', delay: '-3s' },
    { emoji: '🌸', left: '18%', size: '32px', dur: '26s', delay: '-12s' },
    { emoji: '🎈', left: '28%', size: '36px', dur: '20s', delay: '-7s' },
    { emoji: '🐼', left: '42%', size: '30px', dur: '28s', delay: '-18s' },
    { emoji: '🌈', left: '55%', size: '34px', dur: '24s', delay: '-9s' },
    { emoji: '✨', left: '68%', size: '24px', dur: '19s', delay: '-14s' },
    { emoji: '🍀', left: '78%', size: '28px', dur: '25s', delay: '-5s' },
    { emoji: '🎨', left: '88%', size: '30px', dur: '23s', delay: '-16s' },
    { emoji: '📚', left: '94%', size: '26px', dur: '27s', delay: '-21s' }
  ];

  return (
    <div className="relative min-h-screen text-slate-800 bg-gradient-to-br from-sky-100 via-purple-50 to-amber-50 pb-24 overflow-x-hidden">
      {/* Background Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {bubbles.map((b, idx) => (
          <div
            key={idx}
            className="bubble"
            style={{
              left: b.left,
              fontSize: b.size,
              animationDuration: b.dur,
              animationDelay: b.delay
            }}
          >
            {b.emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 pt-6 pb-2 px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-600 tracking-tight drop-shadow-[0_2px_4px_rgba(255,182,193,0.6)]">
          🎒 中文乐园 · Bài 12
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1 max-w-xl mx-auto">
          Lớp Thanh Thiếu Niên · Ôn tập từ vựng – Ngữ pháp – Luyện viết chữ Hán – Trò chơi
        </p>

        {/* Speed Bar */}
        <div className="mt-3 inline-flex items-center gap-2 bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-slate-200/60 text-xs sm:text-sm font-extrabold text-slate-600">
          <Volume2 className="w-4 h-4 text-sky-500" />
          <span>Tốc độ đọc:</span>
          <div className="flex gap-1.5 ml-1">
            {[
              { rate: 0.6, label: '🐢 Chậm' },
              { rate: 0.9, label: '🚶 Vừa' },
              { rate: 1.3, label: '🐇 Nhanh' }
            ].map((item) => (
              <button
                key={item.rate}
                onClick={() => handleSpeedChange(item.rate)}
                className={`px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  Math.abs(speedRate - item.rate) < 0.05
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-pink-100/80 shadow-xs py-2">
        <nav className="flex items-center justify-center gap-1 sm:gap-2 px-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'home', label: '🏠 Trang chủ' },
            { id: 'vocab', label: '📚 Từ vựng' },
            { id: 'grammar', label: '✏️ Ngữ pháp' },
            { id: 'exercises', label: '📝 Bài tập' },
            { id: 'write', label: '🖌️ Luyện viết' },
            { id: 'game', label: '🎮 Trò chơi' },
            { id: 'report', label: '📋 Báo cáo' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                audioService.stopBGM();
                setActiveTab(tab.id as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-600 shadow-xs border border-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-4">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white/95 rounded-3xl p-5 shadow-lg shadow-sky-100/50 border border-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span>📈 Tiến độ học tập của em</span>
                </h3>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                  {state.studentName ? `Học sinh: ${state.studentName}` : 'Chưa nhập tên'}
                </span>
              </div>

              <div className="space-y-3">
                <ProgressRow
                  label="Từ vựng đã học"
                  current={state.learnedVocab.length}
                  total={VOCAB.length}
                  color="pink"
                  icon="📚"
                />
                <ProgressRow
                  label="Bài tập đã hoàn thành"
                  current={state.fillDone.length + state.timeDone.length + state.sortDone.length}
                  total={FILL_QUESTIONS.length + TIME_QUESTIONS.length + SORT_QUESTIONS.length}
                  color="green"
                  icon="📝"
                />
                <ProgressRow
                  label="Chữ Hán đã tập viết"
                  current={state.writtenChars.length}
                  total={WRITE_CHARS.length}
                  color="blue"
                  icon="🖌️"
                />
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏆</span>
                    <div>
                      <div className="text-xs font-black text-amber-900">Điểm cao nhất Game Đập Chuột</div>
                      <div className="text-xs text-amber-700">Rèn phản xạ nhận diện chữ Hán</div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-amber-600">{state.gameHighScore} điểm</div>
                </div>
              </div>
            </div>

            {/* Navigation Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ShortcutCard
                title="📚 Học Từ Vựng"
                desc="Xem chữ Hán, phiên âm và ví dụ câu"
                onClick={() => setActiveTab('vocab')}
                bg="from-blue-500 to-sky-500"
              />
              <ShortcutCard
                title="✏️ Ngữ Pháp"
                desc="Hỏi giờ 几点, trật tự thời gian"
                onClick={() => setActiveTab('grammar')}
                bg="from-emerald-500 to-teal-500"
              />
              <ShortcutCard
                title="📝 Làm Bài Tập"
                desc="Điền từ, viết giờ và sắp xếp câu"
                onClick={() => setActiveTab('exercises')}
                bg="from-pink-500 to-rose-500"
              />
              <ShortcutCard
                title="🖌️ Luyện Viết"
                desc="Tập viết theo đúng thứ tự nét"
                onClick={() => setActiveTab('write')}
                bg="from-amber-500 to-orange-500"
              />
              <ShortcutCard
                title="🎮 Chơi Trò Chơi"
                desc="Lật thẻ Memory & Đập chuột vui nhộn"
                onClick={() => setActiveTab('game')}
                bg="from-purple-500 to-violet-500"
              />
              <ShortcutCard
                title="📋 Báo Cáo"
                desc="Ký tên phụ huynh & xuất kết quả"
                onClick={() => setActiveTab('report')}
                bg="from-slate-600 to-slate-800"
              />
            </div>
          </div>
        )}

        {/* TAB 2: VOCAB */}
        {activeTab === 'vocab' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white/95 rounded-3xl p-5 shadow-lg shadow-sky-100/50 border border-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <span>📚 Từ vựng Bài 12</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    Bấm vào thẻ để xem ví dụ và nghe phát âm. Bấm 🔊 để nghe nhanh.
                  </p>
                </div>
              </div>

              {/* Vocab Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {VOCAB.map((item, idx) => {
                  const isLearned = state.learnedVocab.includes(item.hanzi);
                  const isCurrentlyPlaying = currentlyPlayingWord === item.hanzi;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedVocab(item);
                        markVocabLearned(item.hanzi);
                      }}
                      className={`group relative bg-gradient-to-b from-white to-sky-50/40 rounded-2xl p-4 text-center border-2 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                        isCurrentlyPlaying
                          ? 'border-pink-500 ring-2 ring-pink-300 shadow-pink-100'
                          : isLearned
                          ? 'border-emerald-200/80 shadow-xs'
                          : 'border-slate-100 shadow-xs'
                      }`}
                    >
                      {/* Learned badge */}
                      {isLearned && (
                        <div className="absolute top-2 left-2 text-emerald-500 text-xs font-black">
                          ✓ Đã học
                        </div>
                      )}

                      <div className="text-2xl mt-2 mb-1">{item.emoji}</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide font-sans">
                        {item.hanzi}
                      </div>
                      <div className="text-xs font-black text-sky-500 mt-0.5">{item.pinyin}</div>
                      <div className="text-xs font-bold text-slate-500 mt-1 line-clamp-1">{item.vi}</div>

                      {/* Hint & Speak */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <span className="text-[11px] font-extrabold text-pink-500 group-hover:text-pink-600 transition-colors">
                          👆 Bấm xem ví dụ
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playWord(item.hanzi);
                            markVocabLearned(item.hanzi);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                            isCurrentlyPlaying
                              ? 'bg-pink-500 text-white animate-pulse'
                              : 'bg-sky-100 hover:bg-sky-200 text-sky-700'
                          }`}
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] hidden sm:inline">Nghe</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GRAMMAR */}
        {activeTab === 'grammar' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white/95 rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-white space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>✏️ Ngữ pháp trọng tâm Bài 12</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Bấm vào biểu tượng 🔊 ở từng câu để nghe phát âm chuẩn xác.
                </p>
              </div>

              {/* Point 1 */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50/40 rounded-2xl p-5 border-2 border-pink-200/80">
                <h4 className="text-base font-black text-pink-600 mb-2">① Hỏi giờ: 几点? (Mấy giờ?)</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-bold mb-3">
                  Dùng để hỏi mấy giờ. Cấu trúc thường gặp: <b>Chủ ngữ + 几点 + Hành động?</b>
                </p>
                <div className="space-y-2">
                  {[
                    { zh: '你几点起床？', py: 'Nǐ jǐ diǎn qǐchuáng?', vi: 'Bạn mấy giờ dậy?' },
                    { zh: '现在几点？', py: 'Xiànzài jǐ diǎn?', vi: 'Bây giờ mấy giờ?' }
                  ].map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-xl shadow-xs border border-pink-100"
                    >
                      <div>
                        <div className="text-base font-black text-slate-800">{ex.zh}</div>
                        <div className="text-xs font-bold text-sky-500">{ex.py}</div>
                        <div className="text-xs text-slate-500 font-semibold">{ex.vi}</div>
                      </div>
                      <button
                        onClick={() => playWord(ex.zh)}
                        className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Point 2 */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50/40 rounded-2xl p-5 border-2 border-sky-200/80">
                <h4 className="text-base font-black text-sky-600 mb-2">
                  ② Trật tự thời gian trong tiếng Trung
                </h4>
                <div className="inline-block bg-sky-100 text-sky-800 text-xs font-black px-3 py-1 rounded-full mb-2">
                  Quy tắc: Ngày → Buổi → Giờ → Phút → Hành động
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-bold mb-3">
                  Thời gian luôn đứng <b>TRƯỚC</b> hành động. Chủ ngữ có thể đứng trước hoặc ngay sau thời gian.
                </p>
                <div className="space-y-2">
                  {[
                    { zh: '我今天早上7点半起床。', py: 'Wǒ jīntiān zǎoshang 7 diǎn bàn qǐchuáng.', vi: 'Hôm nay 7h30 sáng tôi dậy.' },
                    { zh: '今天早上7点半我起床。', py: 'Jīntiān zǎoshang 7 diǎn bàn wǒ qǐchuáng.', vi: 'Hôm nay 7h30 sáng tôi dậy.' }
                  ].map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-xl shadow-xs border border-sky-100"
                    >
                      <div>
                        <div className="text-base font-black text-slate-800">{ex.zh}</div>
                        <div className="text-xs font-bold text-sky-500">{ex.py}</div>
                        <div className="text-xs text-slate-500 font-semibold">{ex.vi}</div>
                      </div>
                      <button
                        onClick={() => playWord(ex.zh)}
                        className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs font-black text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
                  ⚠️ Lưu ý lỗi sai thường gặp: 我起床今天早上7点半 (Sai vì đặt hành động đứng trước thời gian).
                </div>
              </div>

              {/* Point 3 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-2xl p-5 border-2 border-emerald-200/80">
                <h4 className="text-base font-black text-emerald-600 mb-2">③ Cách nói Phút (分 / 刻 / 半 / 零)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="p-2 bg-white rounded-xl text-center border border-emerald-100">
                    <div className="text-sm font-black text-emerald-700">半 (bàn)</div>
                    <div className="text-xs text-slate-500 font-bold">30 phút (rưỡi)</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl text-center border border-emerald-100">
                    <div className="text-sm font-black text-emerald-700">一刻 (yíkè)</div>
                    <div className="text-xs text-slate-500 font-bold">15 phút</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl text-center border border-emerald-100">
                    <div className="text-sm font-black text-emerald-700">三刻 (sānkè)</div>
                    <div className="text-xs text-slate-500 font-bold">45 phút</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl text-center border border-emerald-100">
                    <div className="text-sm font-black text-emerald-700">零 (líng)</div>
                    <div className="text-xs text-slate-500 font-bold">01 - 09 phút</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { zh: '七点半', py: 'qī diǎn bàn', vi: '7 giờ 30 (7 giờ rưỡi)' },
                    { zh: '九点零五分', py: 'jiǔ diǎn líng wǔ fēn', vi: '9 giờ 05 phút (phải có chữ 零 líng)' }
                  ].map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-xl shadow-xs border border-emerald-100"
                    >
                      <div>
                        <div className="text-base font-black text-slate-800">{ex.zh}</div>
                        <div className="text-xs font-bold text-sky-500">{ex.py}</div>
                        <div className="text-xs text-slate-500 font-semibold">{ex.vi}</div>
                      </div>
                      <button
                        onClick={() => playWord(ex.zh)}
                        className="p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXERCISES */}
        {activeTab === 'exercises' && (
          <ExercisesSection
            state={state}
            setState={setState}
            playWord={playWord}
            showToast={showToast}
          />
        )}

        {/* TAB 5: WRITE */}
        {activeTab === 'write' && (
          <WritingSection
            state={state}
            setState={setState}
            playWord={playWord}
            showToast={showToast}
          />
        )}

        {/* TAB 6: GAME */}
        {activeTab === 'game' && (
          <GameSection
            state={state}
            setState={setState}
            playWord={playWord}
            showToast={showToast}
          />
        )}

        {/* TAB 7: REPORT */}
        {activeTab === 'report' && (
          <ReportSection
            state={state}
            setState={setState}
            showToast={showToast}
          />
        )}
      </main>

      {/* Vocab Modal */}
      {selectedVocab && (
        <VocabModal
          vocab={selectedVocab}
          onClose={() => setSelectedVocab(null)}
          playWord={playWord}
          speedRate={speedRate}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200 text-center max-w-[90vw]">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUBCOMPONENTS
// ----------------------------------------------------

function ProgressRow({
  label,
  current,
  total,
  color,
  icon
}: {
  label: string;
  current: number;
  total: number;
  color: 'pink' | 'green' | 'blue';
  icon: string;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  const barColors = {
    pink: 'from-pink-400 to-rose-500',
    green: 'from-emerald-400 to-teal-500',
    blue: 'from-sky-400 to-blue-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center text-xs font-black text-slate-600 mb-1">
        <span className="flex items-center gap-1.5">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="font-mono text-slate-700">
          {current}/{total} ({pct}%)
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColors[color]} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ShortcutCard({
  title,
  desc,
  onClick,
  bg
}: {
  title: string;
  desc: string;
  onClick: () => void;
  bg: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-2xl bg-gradient-to-br ${bg} text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg active:scale-98 cursor-pointer flex flex-col justify-between`}
    >
      <div>
        <div className="text-base font-black tracking-tight">{title}</div>
        <div className="text-[11px] text-white/80 font-bold mt-1 line-clamp-2 leading-relaxed">{desc}</div>
      </div>
      <div className="mt-3 flex items-center justify-end">
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">Vào học →</span>
      </div>
    </button>
  );
}

// ----------------------------------------------------
// VOCAB MODAL
// ----------------------------------------------------

function VocabModal({
  vocab,
  onClose,
  playWord,
  speedRate
}: {
  vocab: VocabItem;
  onClose: () => void;
  playWord: (text: string, rate?: number) => void;
  speedRate: number;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-4xl mb-1">{vocab.emoji}</div>
          <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-wider">
            {vocab.hanzi}
          </div>
          <div className="text-base font-black text-sky-500 mt-1">{vocab.pinyin}</div>
          <div className="text-sm font-bold text-slate-500 mt-0.5">{vocab.vi}</div>

          {/* Quick Pronunciation Buttons */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => playWord(vocab.hanzi, 0.6)}
              className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 cursor-pointer"
            >
              🐢 Nghe chậm
            </button>
            <button
              onClick={() => playWord(vocab.hanzi, 0.9)}
              className="px-4 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              🔊 Nghe vừa
            </button>
            <button
              onClick={() => playWord(vocab.hanzi, 1.3)}
              className="px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-black border border-sky-200 cursor-pointer"
            >
              🐇 Nghe nhanh
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Ví dụ câu mẫu ({vocab.examples.length})
          </h4>
          {vocab.examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 hover:bg-sky-50/50 rounded-2xl border border-slate-200/80 transition-all"
            >
              <div className="text-sm font-black text-slate-800">{ex.zh}</div>
              <div className="text-xs font-bold text-sky-500 mt-0.5">{ex.py}</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">{ex.vi}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// EXERCISES SECTION
// ----------------------------------------------------

function ExercisesSection({
  state,
  setState,
  playWord,
  showToast
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  playWord: (text: string) => void;
  showToast: (msg: string) => void;
}) {
  // Sort Question state
  const [sortAnswers, setSortAnswers] = useState<Record<number, string[]>>({});
  const [sortFeedback, setSortFeedback] = useState<Record<number, { ok: boolean; msg: string }>>({});

  const handleFillOption = (qIdx: number, selectedText: string, ans: string, fullZh: string) => {
    if (selectedText === ans) {
      playWord(fullZh);
      audioService.playSound('correct');
      showToast('🎉 Chính xác!');
      if (!state.fillDone.includes(qIdx)) {
        setState((prev) => ({ ...prev, fillDone: [...prev.fillDone, qIdx] }));
      }
    } else {
      audioService.playSound('wrong');
      showToast(`❌ Chưa đúng rồi! Đáp án là: ${ans}`);
    }
  };

  const handleTimeOption = (qIdx: number, selectedText: string, ans: string) => {
    if (selectedText === ans) {
      playWord(ans);
      audioService.playSound('correct');
      showToast('🎉 Giỏi lắm!');
      if (!state.timeDone.includes(qIdx)) {
        setState((prev) => ({ ...prev, timeDone: [...prev.timeDone, qIdx] }));
      }
    } else {
      audioService.playSound('wrong');
      showToast(`❌ Đáp án đúng là: ${ans}`);
    }
  };

  // Sort Question Helpers
  const addSortWord = (qIdx: number, word: string) => {
    setSortAnswers((prev) => ({
      ...prev,
      [qIdx]: [...(prev[qIdx] || []), word]
    }));
    audioService.playSound('click');
  };

  const removeSortWord = (qIdx: number, index: number) => {
    setSortAnswers((prev) => {
      const current = [...(prev[qIdx] || [])];
      current.splice(index, 1);
      return { ...prev, [qIdx]: current };
    });
    audioService.playSound('click');
  };

  const checkSort = (qIdx: number, correctSentence: string) => {
    const userSentence = (sortAnswers[qIdx] || []).join('');
    if (userSentence === correctSentence) {
      setSortFeedback((prev) => ({
        ...prev,
        [qIdx]: { ok: true, msg: `✅ Hoàn toàn chính xác: "${correctSentence}"` }
      }));
      audioService.playSound('correct');
      playWord(correctSentence);
      showToast('🎉 Rất tốt!');
      if (!state.sortDone.includes(qIdx)) {
        setState((prev) => ({ ...prev, sortDone: [...prev.sortDone, qIdx] }));
      }
    } else {
      setSortFeedback((prev) => ({
        ...prev,
        [qIdx]: { ok: false, msg: `❌ Chưa đúng. Đáp án chuẩn: "${correctSentence}"` }
      }));
      audioService.playSound('wrong');
      showToast('❌ Thử xếp lại nhé!');
    }
  };

  const resetSort = (qIdx: number) => {
    setSortAnswers((prev) => ({ ...prev, [qIdx]: [] }));
    setSortFeedback((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Exercise 1 */}
      <div className="bg-white/95 rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-white">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-1">
          <span>✏️ Bài 1: Chọn từ đúng điền vào chỗ trống</span>
        </h3>
        <p className="text-xs text-slate-500 font-bold mb-4">
          Bấm vào từ thích hợp nhất để hoàn thành câu.
        </p>

        <div className="space-y-4">
          {FILL_QUESTIONS.map((q, idx) => {
            const isCompleted = state.fillDone.includes(idx);
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-sky-300 transition-all"
              >
                <div className="text-base font-black text-slate-800">
                  {idx + 1}. {q.sentence.replace('______', ' [ ___ ] ')}
                </div>
                <div className="text-xs font-bold text-sky-500 mt-0.5">{q.py}</div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleFillOption(idx, opt.text, q.ans, q.fullZh)}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 text-xs font-black shadow-xs border border-slate-200 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{opt.text}</span>
                      <span className="text-[10px] text-sky-500 ml-1.5">({opt.py})</span>
                    </button>
                  ))}
                </div>

                {isCompleted && (
                  <div className="mt-2 text-xs font-black text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Em đã làm đúng câu này!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exercise 2 */}
      <div className="bg-white/95 rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-white">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-1">
          <span>⏰ Bài 2: Viết cách nói đúng cho các mốc giờ</span>
        </h3>
        <p className="text-xs text-slate-500 font-bold mb-4">
          Bấm chọn cách đọc giờ chính xác theo tiếng Trung.
        </p>

        <div className="space-y-4">
          {TIME_QUESTIONS.map((q, idx) => {
            const isCompleted = state.timeDone.includes(idx);
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-sky-300 transition-all"
              >
                <div className="text-base font-black text-slate-800">
                  {idx + 1}. Đồng hồ chỉ <span className="text-pink-600 font-mono text-lg font-black">{q.time}</span> nói như thế nào?
                </div>

                <div className="flex flex-wrap gap-2.5 mt-3">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleTimeOption(idx, opt.text, q.ans)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-pink-50 text-slate-800 text-xs font-black shadow-xs border border-slate-200 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{opt.text}</span>
                      <span className="text-[10px] text-sky-500 ml-1.5">({opt.py})</span>
                    </button>
                  ))}
                </div>

                {isCompleted && (
                  <div className="mt-2 text-xs font-black text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Chính xác!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exercise 3 */}
      <div className="bg-white/95 rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-white">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-1">
          <span>🔀 Bài 3: Sắp xếp từ thành câu hoàn chỉnh</span>
        </h3>
        <p className="text-xs text-slate-500 font-bold mb-4">
          Bấm vào các từ bên dưới để đưa lên khung sắp xếp. Bấm vào từ đã chọn để gỡ bỏ.
        </p>

        <div className="space-y-5">
          {SORT_QUESTIONS.map((q, idx) => {
            const currentSelected = sortAnswers[idx] || [];
            const fb = sortFeedback[idx];

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-sky-600">
                    Câu {idx + 1}: <span className="text-slate-700">{q.vi}</span>
                  </div>
                  {state.sortDone.includes(idx) && (
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                    </span>
                  )}
                </div>

                {/* Answer Box */}
                <div className="min-h-12 p-2.5 rounded-xl bg-white border-2 border-dashed border-sky-300 flex flex-wrap gap-2 items-center">
                  {currentSelected.length === 0 ? (
                    <span className="text-xs text-slate-400 font-bold italic">
                      👆 Bấm các từ bên dưới theo đúng trật tự...
                    </span>
                  ) : (
                    currentSelected.map((word, wi) => (
                      <button
                        key={wi}
                        onClick={() => removeSortWord(idx, wi)}
                        className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-black shadow-xs hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                        title="Bấm để bỏ từ này ra"
                      >
                        {word} ✕
                      </button>
                    ))
                  )}
                </div>

                {/* Word Bank */}
                <div className="flex flex-wrap gap-2">
                  {q.words.map((w, wi) => {
                    const countInOriginal = q.words.filter((x) => x.w === w.w).length;
                    const countInCurrent = currentSelected.filter((x) => x === w.w).length;
                    const isFullyUsed = countInCurrent >= countInOriginal;

                    return (
                      <button
                        key={wi}
                        disabled={isFullyUsed}
                        onClick={() => addSortWord(idx, w.w)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isFullyUsed
                            ? 'bg-slate-200 text-slate-400 line-through cursor-not-allowed'
                            : 'bg-white hover:bg-pink-50 text-slate-800 shadow-xs border border-slate-200 active:scale-95'
                        }`}
                      >
                        <div>{w.w}</div>
                        <div className="text-[10px] text-sky-500 font-bold">{w.py}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => checkSort(idx, q.ans)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-xs active:scale-95 cursor-pointer"
                  >
                    Kiểm tra
                  </button>
                  <button
                    onClick={() => resetSort(idx)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black transition-colors cursor-pointer"
                  >
                    Làm lại
                  </button>
                </div>

                {/* Feedback */}
                {fb && (
                  <div
                    className={`text-xs font-black p-2.5 rounded-xl ${
                      fb.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {fb.msg}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// WRITING SECTION (HanziWriter)
// ----------------------------------------------------

function WritingSection({
  state,
  setState,
  playWord,
  showToast
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  playWord: (text: string) => void;
  showToast: (msg: string) => void;
}) {
  const [selectedChar, setSelectedChar] = useState<string>('现');
  const writerRef = useRef<HTMLDivElement>(null);
  const writerInstance = useRef<any>(null);

  const charInfo = WRITE_CHARS.find((c) => c.c === selectedChar) || WRITE_CHARS[0];

  useEffect(() => {
    if (!writerRef.current) return;
    writerRef.current.innerHTML = '';

    if (window.HanziWriter) {
      try {
        writerInstance.current = window.HanziWriter.create(writerRef.current, selectedChar, {
          width: 260,
          height: 260,
          padding: 18,
          showOutline: true,
          strokeAnimationSpeed: 1.2,
          delayBetweenStrokes: 220,
          strokeColor: '#ff5b8a',
          radicalColor: '#4fa8ff',
          outlineColor: '#e2e8f0',
          highlightColor: '#f59e0b',
          charDataLoader: (char: string, onComplete: any, onError: any) => {
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(char)}.json`)
              .then((res) => res.json())
              .then(onComplete)
              .catch(onError);
          }
        });
      } catch (e) {
        console.warn('HanziWriter error:', e);
      }
    }
  }, [selectedChar]);

  const handleAnimate = () => {
    if (writerInstance.current?.animateCharacter) {
      writerInstance.current.animateCharacter();
    }
    playWord(selectedChar);
  };

  const handleQuiz = () => {
    if (writerInstance.current?.quiz) {
      writerInstance.current.quiz({
        onMistake: () => {
          showToast('❌ Nét chưa đúng rồi, thử lại nhé!');
        },
        onComplete: (summary: any) => {
          showToast(`🎉 Viết hoàn thành! Tổng ${summary.totalMistakes} lần chưa chuẩn.`);
          audioService.playSound('victory');
          if (!state.writtenChars.includes(selectedChar)) {
            setState((prev) => ({
              ...prev,
              writtenChars: [...prev.writtenChars, selectedChar]
            }));
          }
        }
      });
      playWord(selectedChar);
    } else {
      showToast('✍️ Chúc em luyện viết nét chữ thật đẹp!');
      if (!state.writtenChars.includes(selectedChar)) {
        setState((prev) => ({
          ...prev,
          writtenChars: [...prev.writtenChars, selectedChar]
        }));
      }
    }
  };

  const handleReset = () => {
    if (writerInstance.current?.cancelQuiz) {
      writerInstance.current.cancelQuiz();
    }
    if (writerInstance.current?.showCharacter) {
      writerInstance.current.showCharacter();
    }
    showToast('🗑️ Đã xóa, em có thể viết lại từ đầu.');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-white/95 rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-white">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>🖌️ Luyện viết chữ Hán theo thứ tự nét</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Chọn chữ Hán bên dưới → Bấm <b>▶ Xem nét</b> để xem hướng dẫn → Bấm <b>✍️ Tập viết</b> để tự rê chuột/ngón tay viết theo.
          </p>
        </div>

        {/* Char Chips */}
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {WRITE_CHARS.map((item) => {
            const isDone = state.writtenChars.includes(item.c);
            const isSelected = item.c === selectedChar;
            return (
              <button
                key={item.c}
                onClick={() => setSelectedChar(item.c)}
                className={`w-11 h-11 rounded-2xl text-lg font-black transition-all cursor-pointer flex items-center justify-center relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md scale-105'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.c}
                {isDone && !isSelected && (
                  <span className="absolute -top-1 -right-1 text-[9px] bg-emerald-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Writer Box & Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2">
          {/* Canvas Box */}
          <div className="relative w-[280px] h-[280px] rounded-3xl bg-slate-50 border-4 border-dashed border-sky-200 flex items-center justify-center shadow-inner overflow-hidden">
            {/* Guidelines */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-red-500" />
              <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-red-500" />
            </div>
            <div ref={writerRef} className="z-10" />
          </div>

          {/* Details & Actions */}
          <div className="space-y-4 text-center md:text-left">
            <div>
              <div className="text-4xl font-black text-slate-800">{charInfo.c}</div>
              <div className="text-lg font-black text-sky-500 mt-1">{charInfo.py}</div>
              <div className="text-sm font-bold text-slate-500 mt-0.5">{charInfo.vi}</div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <button
                onClick={handleAnimate}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black shadow-xs active:scale-95 cursor-pointer"
              >
                ▶ Xem nét
              </button>
              <button
                onClick={handleQuiz}
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black shadow-xs active:scale-95 cursor-pointer"
              >
                ✍️ Tập viết
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black cursor-pointer"
              >
                🗑️ Xóa / Viết lại
              </button>
              <button
                onClick={() => playWord(charInfo.audioKey || charInfo.c)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Phát âm</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 font-bold max-w-xs">
              Mẹo: Luyện viết theo từng nét chuẩn sẽ giúp các em ghi nhớ mặt chữ Hán lâu hơn và viết đẹp hơn rất nhiều!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// GAME SECTION (Memory & Whack-a-Mole)
// ----------------------------------------------------

function GameSection({
  state,
  setState,
  playWord,
  showToast
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  playWord: (text: string) => void;
  showToast: (msg: string) => void;
}) {
  const [gameMode, setGameMode] = useState<'memory' | 'whack'>('memory');

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Game Mode Tabs */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setGameMode('memory')}
          className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            gameMode === 'memory'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md scale-105'
              : 'bg-white hover:bg-slate-100 text-slate-600 shadow-xs'
          }`}
        >
          🧠 Trò chơi Lật Thẻ Trí Nhớ (Memory)
        </button>
        <button
          onClick={() => setGameMode('whack')}
          className={`px-5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            gameMode === 'whack'
              ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md scale-105'
              : 'bg-white hover:bg-slate-100 text-slate-600 shadow-xs'
          }`}
        >
          🔨 Đập Chuột Nhận Diện (Whack-a-Mole)
        </button>
      </div>

      {gameMode === 'memory' ? (
        <MemoryGame
          playWord={playWord}
          showToast={showToast}
          onWin={() => {
            audioService.playSound('victory');
          }}
        />
      ) : (
        <WhackMoleGame
          highScore={state.gameHighScore}
          onUpdateScore={(newHigh) => {
            setState((prev) => ({ ...prev, gameHighScore: newHigh }));
          }}
          playWord={playWord}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// 1. MEMORY GAME
interface MemoryCard {
  id: number;
  pairId: number;
  type: 'hanzi' | 'vi';
  text: string;
  pinyin?: string;
}

function MemoryGame({
  playWord,
  showToast,
  onWin
}: {
  playWord: (text: string) => void;
  showToast: (msg: string) => void;
  onWin: () => void;
}) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initialize cards
  const startNewGame = () => {
    const shuffledVocab = [...VOCAB].sort(() => 0.5 - Math.random()).slice(0, 6);
    const deck: MemoryCard[] = [];
    shuffledVocab.forEach((v, idx) => {
      deck.push({ id: idx * 2, pairId: idx, type: 'hanzi', text: v.hanzi, pinyin: v.pinyin });
      deck.push({ id: idx * 2 + 1, pairId: idx, type: 'vi', text: v.vi });
    });
    deck.sort(() => 0.5 - Math.random());

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleCardClick = (index: number) => {
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(index)) return;

    audioService.playSound('click');
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    const card = cards[index];
    if (card.type === 'hanzi') {
      playWord(card.text);
    }

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const c1 = cards[firstIdx];
      const c2 = cards[secondIdx];

      if (c1.pairId === c2.pairId && c1.type !== c2.type) {
        // Matched
        setTimeout(() => {
          setMatched((prev) => {
            const next = [...prev, firstIdx, secondIdx];
            if (next.length === cards.length) {
              setIsPlaying(false);
              onWin();
              showToast(`🎉 Xuất sắc! Hoàn thành trong ${moves + 1} lượt và ${seconds}s!`);
            }
            return next;
          });
          audioService.playSound('correct');
          setFlipped([]);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          audioService.playSound('wrong');
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="bg-white/95 rounded-3xl p-6 shadow-lg shadow-sky-100/50 border border-white">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-800">🧠 Ghép thẻ Chữ Hán & Nghĩa Tiếng Việt</h3>
          <p className="text-xs text-slate-500 font-bold">Lật 2 thẻ tương ứng để hoàn thành 6 cặp thẻ.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-2xl">
          <span>🎯 Lượt: <span className="text-pink-600 font-mono">{moves}</span></span>
          <span>⏱️ Thời gian: <span className="text-sky-600 font-mono">{seconds}s</span></span>
          <span>✅ Cặp: <span className="text-emerald-600 font-mono">{matched.length / 2}/6</span></span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
        {cards.map((c, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          const isMatched = matched.includes(idx);

          return (
            <div
              key={c.id}
              onClick={() => handleCardClick(idx)}
              className="aspect-square perspective-500 cursor-pointer"
            >
              <div
                className={`relative w-full h-full rounded-2xl transition-all duration-300 shadow-md ${
                  isFlipped
                    ? isMatched
                      ? 'bg-gradient-to-br from-emerald-100 to-teal-200 border-2 border-emerald-400 text-emerald-950 scale-95'
                      : 'bg-gradient-to-br from-amber-100 to-yellow-200 border-2 border-amber-300 text-amber-950 scale-100'
                    : 'bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white hover:scale-105'
                } flex flex-col items-center justify-center p-2 text-center select-none`}
              >
                {isFlipped ? (
                  <div>
                    <div className={`font-black ${c.type === 'hanzi' ? 'text-2xl sm:text-3xl font-sans' : 'text-xs sm:text-sm'}`}>
                      {c.text}
                    </div>
                    {c.pinyin && <div className="text-[10px] text-sky-700 font-bold mt-0.5">{c.pinyin}</div>}
                  </div>
                ) : (
                  <div className="text-2xl font-black text-white/90">?</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={startNewGame}
          className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 cursor-pointer"
        >
          🔄 Chơi ván mới
        </button>
      </div>
    </div>
  );
}

// 2. WHACK-A-MOLE GAME
function WhackMoleGame({
  highScore,
  onUpdateScore,
  playWord,
  showToast
}: {
  highScore: number;
  onUpdateScore: (newScore: number) => void;
  playWord: (text: string) => void;
  showToast: (msg: string) => void;
}) {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTarget, setCurrentTarget] = useState<VocabItem>(VOCAB[0]);
  const [activeMole, setActiveMole] = useState<{ holeIndex: number; word: string } | null>(null);

  // Custom hammer coords
  const [hammerPos, setHammerPos] = useState<{ x: number; y: number } | null>(null);
  const [isSmashing, setIsSmashing] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const pickNextTarget = () => {
    const random = VOCAB[Math.floor(Math.random() * VOCAB.length)];
    setCurrentTarget(random);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsRunning(true);
    setIsPaused(false);
    setActiveMole(null);
    pickNextTarget();
  };

  const stopGame = () => {
    setIsRunning(false);
    setIsPaused(false);
    setActiveMole(null);
    audioService.stopBGM();
    audioService.stopAll();

    if (score > highScore) {
      onUpdateScore(score);
      showToast(`🏆 Kỷ lục mới: ${score} điểm!`);
    }
  };

  // Sync BGM strictly with running & unpaused state, and always clean up on unmount
  useEffect(() => {
    if (isRunning && !isPaused) {
      audioService.startBGM();
    } else {
      audioService.stopBGM();
      if (isPaused) {
        audioService.stopAll();
      }
    }
    return () => {
      audioService.stopBGM();
    };
  }, [isRunning, isPaused]);

  // Timer
  useEffect(() => {
    if (!isRunning || isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  // End game cleanly when timeLeft hits 0
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      stopGame();
    }
  }, [isRunning, timeLeft]);

  // Mole pop interval
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      const hole = Math.floor(Math.random() * 9);
      const isCorrect = Math.random() < 0.45;
      let word = currentTarget.hanzi;
      if (!isCorrect) {
        const others = VOCAB.filter((v) => v.hanzi !== currentTarget.hanzi);
        word = others[Math.floor(Math.random() * others.length)].hanzi;
      }
      if (word.includes('/')) word = word.split('/')[0].trim();

      setActiveMole({ holeIndex: hole, word });

      setTimeout(() => {
        setActiveMole((cur) => (cur?.holeIndex === hole ? null : cur));
      }, 1450);
    }, 1250);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, currentTarget]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setHammerPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleHoleClick = (holeIndex: number) => {
    if (!isRunning || isPaused) return;

    setIsSmashing(true);
    audioService.playSound('hit');
    setTimeout(() => setIsSmashing(false), 120);

    if (activeMole && activeMole.holeIndex === holeIndex) {
      let targetClean = currentTarget.hanzi;
      if (targetClean.includes('/')) targetClean = targetClean.split('/')[0].trim();

      if (activeMole.word === targetClean) {
        // Correct mole!
        setScore((s) => s + 10);
        audioService.playSound('correct');
        playWord(activeMole.word);
        setActiveMole(null);
        pickNextTarget();
      } else {
        // Wrong mole
        setScore((s) => Math.max(0, s - 5));
        audioService.playSound('wrong');
        showToast(`❌ Chưa đúng rồi!`);
        setActiveMole(null);
      }
    }
  };

  return (
    <div className="bg-white/95 rounded-3xl p-4 sm:p-6 shadow-lg shadow-sky-100/50 border border-white">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-800">🔨 Đập Chuột Nhận Diện Từ Vựng</h3>
          <p className="text-xs text-slate-500 font-bold">
            Quan sát nghĩa tiếng Việt yêu cầu và đập đúng chuột cầm bảng chữ Hán!
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            Điểm: <span className="text-pink-600 font-mono text-base font-black">{score}</span>
          </div>
          <div className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            ⏱️ <span className="text-sky-600 font-mono text-base font-black">{timeLeft}s</span>
          </div>
          {isRunning && (
            <>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 text-xs font-black hover:bg-amber-200 cursor-pointer"
              >
                {isPaused ? '▶️ Tiếp tục' : '⏸️ Tạm dừng'}
              </button>
              <button
                onClick={stopGame}
                className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-black hover:bg-rose-200 cursor-pointer"
              >
                ⏹️ Dừng chơi
              </button>
            </>
          )}
        </div>
      </div>

      {/* Target Word Banner */}
      <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-center shadow-md mb-4 flex items-center justify-center flex-wrap gap-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Mục tiêu đập chuột:</span>
        <span className="text-lg sm:text-xl font-black bg-white text-pink-600 px-4 py-0.5 rounded-full shadow-xs">
          {currentTarget.vi}
        </span>
      </div>

      {/* Stage Area */}
      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={() => setHammerPos(null)}
        className="relative bg-gradient-to-b from-emerald-300 to-emerald-500 rounded-3xl p-4 sm:p-6 shadow-inner overflow-hidden select-none min-h-[380px] flex items-center justify-center cursor-none"
      >
        {/* Custom Hammer */}
        {hammerPos && isRunning && !isPaused && (
          <div
            className={`absolute pointer-events-none text-4xl z-50 transition-transform duration-75 ${
              isSmashing ? 'hammer-smash' : ''
            }`}
            style={{
              left: hammerPos.x - 15,
              top: hammerPos.y - 35
            }}
          >
            🔨
          </div>
        )}

        {/* 9 Holes Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isMoleHere = activeMole?.holeIndex === idx;
            const moleWord = isMoleHere ? activeMole.word : '';

            return (
              <div
                key={idx}
                onClick={() => handleHoleClick(idx)}
                className="relative aspect-square rounded-full bg-amber-950/85 shadow-[inset_0_8px_16px_rgba(0,0,0,0.65)] flex items-end justify-center overflow-hidden border-4 border-emerald-600/70"
              >
                {/* Mole Character */}
                <div
                  className={`relative z-20 transition-all duration-150 flex flex-col items-center pb-1 sm:pb-2 ${
                    isMoleHere ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-28 scale-75 opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Enlarged Mole Sign Board */}
                  <div
                    className={`bg-amber-50 border-[3px] border-amber-600 text-slate-900 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-black shadow-lg mb-1 font-sans whitespace-nowrap leading-none text-center ${
                      moleWord.length >= 3
                        ? 'text-lg sm:text-2xl'
                        : 'text-2xl sm:text-3xl md:text-4xl min-w-[54px] sm:min-w-[74px]'
                    }`}
                  >
                    {moleWord}
                  </div>

                  {/* Mole Body/Head */}
                  <div className="w-14 h-9 sm:w-18 sm:h-11 bg-amber-700 rounded-t-full relative shadow-inner flex flex-col items-center">
                    {/* Ears */}
                    <div className="absolute -top-1.5 -left-1 w-4 h-4 bg-amber-700 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-pink-300 rounded-full" />
                    </div>
                    <div className="absolute -top-1.5 -right-1 w-4 h-4 bg-amber-700 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-pink-300 rounded-full" />
                    </div>
                    {/* Eyes */}
                    <div className="flex gap-3 mt-2">
                      <div className="w-1.5 h-2 bg-slate-950 rounded-full" />
                      <div className="w-1.5 h-2 bg-slate-950 rounded-full" />
                    </div>
                    {/* Nose */}
                    <div className="w-2.5 h-2 bg-pink-400 rounded-full mt-0.5" />
                  </div>
                </div>

                {/* Hole Rim (sits lower so sign & face remain clearly visible) */}
                <div className="absolute inset-x-0 bottom-0 h-1/5 bg-amber-900/95 rounded-b-full z-30 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Paused Overlay */}
        {isRunning && isPaused && (
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-40 cursor-auto">
            <h4 className="text-2xl font-black mb-2">⏸️ Đang tạm dừng</h4>
            <p className="text-xs text-white/85 font-bold mb-4">
              Âm thanh và thời gian đã được tạm dừng.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPaused(false)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl hover:scale-105 cursor-pointer"
              >
                ▶️ Tiếp tục chơi
              </button>
              <button
                onClick={stopGame}
                className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm cursor-pointer"
              >
                ⏹️ Kết thúc
              </button>
            </div>
          </div>
        )}

        {/* Start / Finish Overlay */}
        {!isRunning && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-40 cursor-auto">
            <h4 className="text-2xl font-black mb-1">🔨 Sẵn sàng Đập Chuột!</h4>
            <p className="text-xs text-white/80 font-bold max-w-xs mb-4">
              Nhìn nghĩa tiếng Việt ở trên, nhanh tay đập vào chú chuột cầm đúng chữ Hán nhé!
            </p>
            {score > 0 && (
              <div className="mb-4 text-sm font-black text-amber-300">
                Ván trước đạt được: {score} điểm
              </div>
            )}
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              ▶ Bắt đầu chơi ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// REPORT SECTION
// ----------------------------------------------------

function ReportSection({
  state,
  setState,
  showToast
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  showToast: (msg: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(!!state.signature);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2b3a55';

    if (state.signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = state.signature;
    }
  }, [state.signature]);

  const getCanvasPoint = (
    canvas: HTMLCanvasElement,
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasPoint(canvas, e);

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2b3a55';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasPoint(canvas, e);

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setState((prev) => ({ ...prev, signature: '' }));
    showToast('🗑️ Đã xóa chữ ký.');
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) {
      showToast('✍️ Phụ huynh vui lòng ký tên vào ô trước nhé!');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    setState((prev) => ({ ...prev, signature: dataUrl }));
    showToast('💾 Đã lưu chữ ký phụ huynh thành công!');
  };

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  };

  const handleExportImage = async () => {
    try {
      showToast('📷 Đang xuất phiếu báo cáo...');

      const W = 760;
      const H = 860;
      const scale = 2;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = W * scale;
      exportCanvas.height = H * scale;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context unavailable');
      }
      ctx.scale(scale, scale);

      const fontSans = '"Nunito", "Quicksand", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
      const fontMono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

      // Outer backdrop
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 0, W, H);

      // Card container
      const pad = 28;
      const cardX = pad;
      const cardY = pad;
      const cardW = W - pad * 2;
      const cardH = H - pad * 2;

      ctx.save();
      ctx.shadowColor = 'rgba(14, 165, 233, 0.14)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#e0f2fe';
      ctx.stroke();

      const innerX = cardX + 36;
      const innerW = cardW - 72;

      // Header
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `36px ${fontSans}`;
      ctx.fillStyle = '#1e293b';
      ctx.fillText('📋', W / 2, cardY + 52);

      ctx.font = `900 28px ${fontSans}`;
      ctx.fillStyle = '#db2777';
      ctx.fillText('PHIẾU BÁO CÁO ÔN TẬP', W / 2, cardY + 96);

      ctx.font = `700 14px ${fontSans}`;
      ctx.fillStyle = '#64748b';
      ctx.fillText('中文乐园 · Bài 12 · Lớp Thanh Thiếu Niên', W / 2, cardY + 124);

      // Dashed divider
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([7, 6]);
      ctx.moveTo(innerX, cardY + 150);
      ctx.lineTo(innerX + innerW, cardY + 150);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#bae6fd';
      ctx.stroke();
      ctx.restore();

      // Student Info
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      const nameY = cardY + 194;
      ctx.font = `800 16px ${fontSans}`;
      ctx.fillStyle = '#475569';
      const labelText = '👤 Họ và tên học sinh:';
      ctx.fillText(labelText, innerX, nameY);
      const labelWidth = ctx.measureText(labelText).width;

      const nameFieldX = innerX + labelWidth + 14;
      const nameFieldEnd = innerX + innerW;
      const displayName = state.studentName && state.studentName.trim()
        ? state.studentName.trim()
        : '...................................................';

      ctx.font = `900 18px ${fontSans}`;
      ctx.fillStyle = '#0c4a6e';
      ctx.fillText(displayName, nameFieldX + 4, nameY - 2, Math.max(120, nameFieldEnd - nameFieldX - 8));

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 5]);
      ctx.moveTo(nameFieldX, nameY + 7);
      ctx.lineTo(nameFieldEnd, nameY + 7);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#7dd3fc';
      ctx.stroke();
      ctx.restore();

      const dateY = cardY + 234;
      ctx.font = `800 16px ${fontSans}`;
      ctx.fillStyle = '#475569';
      const dateLabel = '📅 Ngày học:';
      ctx.fillText(dateLabel, innerX, dateY);
      const dateLabelWidth = ctx.measureText(dateLabel).width;

      ctx.font = `800 15px ${fontMono}`;
      ctx.fillStyle = '#334155';
      ctx.fillText(today, innerX + dateLabelWidth + 12, dateY);

      // Results title
      const resultsTitleY = cardY + 280;
      ctx.font = `900 13px ${fontSans}`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('KẾT QUẢ ÔN TẬP', innerX, resultsTitleY);

      const exDone = state.fillDone.length + state.timeDone.length + state.sortDone.length;
      const exTotal = FILL_QUESTIONS.length + TIME_QUESTIONS.length + SORT_QUESTIONS.length;
      const rows = [
        {
          done: state.learnedVocab.length >= 15,
          label: 'Học từ vựng (xem ví dụ + nghe phát âm)',
          score: `${state.learnedVocab.length}/${VOCAB.length}`,
          color: '#db2777'
        },
        {
          done: exDone >= 10,
          label: 'Làm bài tập tổng hợp (Điền từ, Viết giờ, Xếp câu)',
          score: `${exDone}/${exTotal}`,
          color: '#059669'
        },
        {
          done: state.writtenChars.length >= 5,
          label: 'Luyện viết chữ Hán theo thứ tự nét',
          score: `${state.writtenChars.length}/${WRITE_CHARS.length}`,
          color: '#0284c7'
        },
        {
          done: state.gameHighScore > 0,
          label: 'Điểm cao nhất trò chơi Đập Chuột',
          score: `${state.gameHighScore} điểm`,
          color: '#d97706'
        }
      ];

      let rowY = resultsTitleY + 16;
      const rowH = 54;
      const rowGap = 12;

      rows.forEach((row) => {
        drawRoundedRect(ctx, innerX, rowY, innerW, rowH, 14);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = `18px ${fontSans}`;
        ctx.fillStyle = '#1e293b';
        ctx.fillText(row.done ? '✅' : '⬜', innerX + 16, rowY + rowH / 2);

        ctx.font = `800 14px ${fontSans}`;
        ctx.fillStyle = '#334155';
        ctx.fillText(row.label, innerX + 46, rowY + rowH / 2, innerW - 170);

        ctx.textAlign = 'right';
        ctx.font = `900 15px ${fontMono}`;
        ctx.fillStyle = row.color;
        ctx.fillText(row.score, innerX + innerW - 16, rowY + rowH / 2);

        rowY += rowH + rowGap;
      });

      // Signature Section
      const sigTitleY = rowY + 20;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = `800 15px ${fontSans}`;
      ctx.fillStyle = '#475569';
      ctx.fillText('✍️ Chữ ký xác nhận của Phụ Huynh:', innerX, sigTitleY);

      const sigOuterY = sigTitleY + 14;
      const sigOuterH = cardY + cardH - 34 - sigOuterY;
      drawRoundedRect(ctx, innerX, sigOuterY, innerW, sigOuterH, 18);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#7dd3fc';
      ctx.stroke();
      ctx.restore();

      const sigBoxPad = 12;
      const sigBoxX = innerX + sigBoxPad;
      const sigBoxY = sigOuterY + sigBoxPad;
      const sigBoxW = innerW - sigBoxPad * 2;
      const sigBoxH = sigOuterH - sigBoxPad * 2;

      drawRoundedRect(ctx, sigBoxX, sigBoxY, sigBoxW, sigBoxH, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      const drawContainedSignature = (source: HTMLCanvasElement | HTMLImageElement, srcW: number, srcH: number) => {
        if (!srcW || !srcH) return;
        const ratio = Math.min(sigBoxW / srcW, sigBoxH / srcH);
        const drawW = srcW * ratio;
        const drawH = srcH * ratio;
        const drawX = sigBoxX + (sigBoxW - drawW) / 2;
        const drawY = sigBoxY + (sigBoxH - drawH) / 2;
        ctx.drawImage(source, drawX, drawY, drawW, drawH);
      };

      // Draw signature from live canvas (even if user didn't click Save yet)
      if (canvasRef.current && hasSignature) {
        drawContainedSignature(canvasRef.current, canvasRef.current.width, canvasRef.current.height);
      } else if (state.signature) {
        await new Promise<void>((resolve) => {
          const sigImg = new Image();
          sigImg.onload = () => {
            drawContainedSignature(sigImg, sigImg.naturalWidth || 560, sigImg.naturalHeight || 120);
            resolve();
          };
          sigImg.onerror = () => resolve();
          sigImg.src = state.signature;
        });
      }

      const fileName = `Bao-cao-on-tap-Bai-12-${
        state.studentName ? state.studentName.trim().replace(/\s+/g, '-') : 'HocSinh'
      }.png`;

      // Auto-save signature if drawn but not saved yet
      if (canvasRef.current && hasSignature && !state.signature) {
        const sigDataUrl = canvasRef.current.toDataURL('image/png');
        setState((prev) => ({ ...prev, signature: sigDataUrl }));
      }

      const triggerDownload = (url: string, revokeAfter = false) => {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (revokeAfter) {
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        }
      };

      if (exportCanvas.toBlob) {
        exportCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            triggerDownload(url, true);
          } else {
            triggerDownload(exportCanvas.toDataURL('image/png'));
          }
          showToast('🎉 Đã tải ảnh phiếu báo cáo về máy!');
        }, 'image/png');
      } else {
        triggerDownload(exportCanvas.toDataURL('image/png'));
        showToast('🎉 Đã tải ảnh phiếu báo cáo về máy!');
      }
    } catch (e) {
      console.error('Export report error:', e);
      showToast('⚠️ Không thể xuất ảnh lúc này.');
    }
  };

  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div
        ref={reportRef}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-sky-100 max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-sky-200 pb-5">
          <div className="text-3xl mb-1">📋</div>
          <h2 className="text-2xl font-black text-pink-600 tracking-tight">PHIẾU BÁO CÁO ÔN TẬP</h2>
          <p className="text-xs font-bold text-slate-500 mt-0.5">中文乐园 · Bài 12 · Lớp Thanh Thiếu Niên</p>
        </div>

        {/* Info fields */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-black text-slate-600 whitespace-nowrap">👤 Họ và tên học sinh:</span>
            <div className="flex-1 flex items-center border-b-2 border-dashed border-sky-300 pb-0.5">
              <span className="student-name-export hidden text-sm sm:text-base font-black text-sky-950 px-1 leading-normal">
                {state.studentName ? state.studentName : '...................................................'}
              </span>
              <input
                type="text"
                placeholder="Nhập họ và tên của em..."
                value={state.studentName}
                onChange={(e) => setState((prev) => ({ ...prev, studentName: e.target.value }))}
                className="student-name-input w-full focus:border-pink-500 outline-hidden px-1 py-0.5 text-sm sm:text-base font-black text-sky-950 bg-transparent leading-normal placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-black text-slate-600 whitespace-nowrap">📅 Ngày học:</span>
            <span className="text-xs sm:text-sm font-mono font-black text-slate-700">{today}</span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Kết quả ôn tập</h4>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-base">{state.learnedVocab.length >= 15 ? '✅' : '⬜'}</span>
              <span className="text-xs font-black text-slate-700">Học từ vựng (xem ví dụ + nghe phát âm)</span>
            </div>
            <span className="text-xs font-mono font-black text-pink-600">
              {state.learnedVocab.length}/{VOCAB.length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-base">
                {state.fillDone.length + state.timeDone.length + state.sortDone.length >= 10 ? '✅' : '⬜'}
              </span>
              <span className="text-xs font-black text-slate-700">Làm bài tập tổng hợp (Điền từ, Viết giờ, Xếp câu)</span>
            </div>
            <span className="text-xs font-mono font-black text-emerald-600">
              {state.fillDone.length + state.timeDone.length + state.sortDone.length}/
              {FILL_QUESTIONS.length + TIME_QUESTIONS.length + SORT_QUESTIONS.length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-base">{state.writtenChars.length >= 5 ? '✅' : '⬜'}</span>
              <span className="text-xs font-black text-slate-700">Luyện viết chữ Hán theo thứ tự nét</span>
            </div>
            <span className="text-xs font-mono font-black text-sky-600">
              {state.writtenChars.length}/{WRITE_CHARS.length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-base">{state.gameHighScore > 0 ? '✅' : '⬜'}</span>
              <span className="text-xs font-black text-slate-700">Điểm cao nhất trò chơi Đập Chuột</span>
            </div>
            <span className="text-xs font-mono font-black text-amber-600">
              {state.gameHighScore} điểm
            </span>
          </div>
        </div>

        {/* Parent Signature Canvas */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-black text-slate-600">✍️ Chữ ký xác nhận của Phụ Huynh:</h4>
          <div className="border-2 border-dashed border-sky-300 rounded-2xl p-2 bg-slate-50/50">
            <canvas
              id="sigCanvas"
              ref={canvasRef}
              width={560}
              height={120}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="w-full h-28 bg-white rounded-xl touch-none cursor-crosshair border border-slate-200"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleClearSignature}
                className="px-3 py-1 bg-rose-50 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Xóa chữ ký
              </button>
              <button
                onClick={handleSaveSignature}
                className="px-4 py-1 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Lưu chữ ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleExportImage}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Lưu ảnh Phiếu Báo Cáo</span>
        </button>
      </div>
    </div>
  );
}
