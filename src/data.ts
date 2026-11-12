export interface AudioWordSync {
  id: string;
  word: string;
  start: number;
  end: number;
  dur: number;
  pinyin: string;
  meaning: string;
  audioFile: string;
}

export const MASTER_AUDIO_SRC = '/assets/aistudio/luvvoice.com-20261112-03kFkB_3bc03754.mp3';

export const AUDIO_SYNCS: AudioWordSync[] = [
  { id: 'xianzai', word: '现在', start: 0.35, end: 0.83, dur: 0.48, pinyin: 'xiànzài', meaning: 'Bây giờ', audioFile: '/audio/words/xianzai.mp3' },
  { id: 'shangwu', word: '上午', start: 1.20, end: 1.68, dur: 0.48, pinyin: 'shàngwǔ', meaning: 'Buổi sáng', audioFile: '/audio/words/shangwu.mp3' },
  { id: 'ji', word: '几', start: 2.20, end: 2.55, dur: 0.35, pinyin: 'jǐ', meaning: 'Mấy', audioFile: '/audio/words/ji.mp3' },
  { id: 'shangke', word: '上课', start: 2.92, end: 3.50, dur: 0.58, pinyin: 'shàngkè', meaning: 'Đi học / Vào lớp', audioFile: '/audio/words/shangke.mp3' },
  { id: 'dian', word: '点', start: 3.97, end: 4.35, dur: 0.38, pinyin: 'diǎn', meaning: 'Giờ', audioFile: '/audio/words/dian.mp3' },
  { id: 'dianzhong', word: '点钟', start: 4.72, end: 5.30, dur: 0.58, pinyin: 'diǎnzhōng', meaning: 'Giờ (đầy đủ)', audioFile: '/audio/words/dianzhong.mp3' },
  { id: 'xiake', word: '下课', start: 5.73, end: 6.33, dur: 0.60, pinyin: 'xiàkè', meaning: 'Tan học', audioFile: '/audio/words/xiake.mp3' },
  { id: 'fen', word: '分', start: 6.91, end: 7.23, dur: 0.32, pinyin: 'fēn', meaning: 'Phút', audioFile: '/audio/words/fen.mp3' },
  { id: 'fenzhong', word: '分钟', start: 7.72, end: 8.22, dur: 0.50, pinyin: 'fēnzhōng', meaning: 'Phút (đầy đủ)', audioFile: '/audio/words/fenzhong.mp3' },
  { id: 'zhongwu', word: '中午', start: 8.66, end: 9.26, dur: 0.60, pinyin: 'zhōngwǔ', meaning: 'Buổi trưa', audioFile: '/audio/words/zhongwu.mp3' },
  { id: 'ling', word: '零', start: 9.72, end: 10.12, dur: 0.40, pinyin: 'líng', meaning: 'Số 0', audioFile: '/audio/words/ling.mp3' },
  { id: 'ke', word: '刻', start: 10.56, end: 10.91, dur: 0.35, pinyin: 'kè', meaning: 'Khắc (15 phút)', audioFile: '/audio/words/ke.mp3' },
  { id: 'zaoshang', word: '早上', start: 11.40, end: 11.92, dur: 0.52, pinyin: 'zǎoshang', meaning: 'Buổi sáng sớm', audioFile: '/audio/words/zaoshang.mp3' },
  { id: 'wanshang', word: '晚上', start: 12.31, end: 12.83, dur: 0.52, pinyin: 'wǎnshang', meaning: 'Buổi tối', audioFile: '/audio/words/wanshang.mp3' },
  { id: 'jintian', word: '今天', start: 13.33, end: 13.83, dur: 0.50, pinyin: 'jīntiān', meaning: 'Hôm nay', audioFile: '/audio/words/jintian.mp3' },
  { id: 'zuotian', word: '昨天', start: 14.32, end: 14.80, dur: 0.48, pinyin: 'zuótiān', meaning: 'Hôm qua', audioFile: '/audio/words/zuotian.mp3' },
  { id: 'mingtian', word: '明天', start: 15.17, end: 15.77, dur: 0.60, pinyin: 'míngtiān', meaning: 'Ngày mai', audioFile: '/audio/words/mingtian.mp3' },
  { id: 'lingchen', word: '凌晨', start: 16.18, end: 16.83, dur: 0.65, pinyin: 'língchén', meaning: 'Rạng sáng', audioFile: '/audio/words/lingchen.mp3' },
  { id: 'zaofan', word: '早饭', start: 17.29, end: 17.82, dur: 0.53, pinyin: 'zǎofàn', meaning: 'Bữa sáng', audioFile: '/audio/words/zaofan.mp3' },
  { id: 'wufan', word: '午饭', start: 18.37, end: 18.89, dur: 0.52, pinyin: 'wǔfàn', meaning: 'Bữa trưa', audioFile: '/audio/words/wufan.mp3' },
  { id: 'wanfan', word: '晚饭', start: 19.36, end: 19.89, dur: 0.53, pinyin: 'wǎnfàn', meaning: 'Bữa tối', audioFile: '/audio/words/wanfan.mp3' },
  { id: 'qichuang', word: '起床', start: 20.35, end: 20.96, dur: 0.61, pinyin: 'qǐchuáng', meaning: 'Thức dậy', audioFile: '/audio/words/qichuang.mp3' },
  { id: 'chifan', word: '吃饭', start: 21.36, end: 21.86, dur: 0.50, pinyin: 'chīfàn', meaning: 'Ăn cơm', audioFile: '/audio/words/chifan.mp3' },
  { id: 'huijia', word: '回家', start: 22.37, end: 22.87, dur: 0.50, pinyin: 'huíjiā', meaning: 'Về nhà', audioFile: '/audio/words/huijia.mp3' },
  { id: 'shuijiao', word: '睡觉', start: 23.24, end: 23.70, dur: 0.46, pinyin: 'shuìjiào', meaning: 'Ngủ', audioFile: '/audio/words/shuijiao.mp3' }
];

export interface VocabExample {
  zh: string;
  py: string;
  vi: string;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  vi: string;
  emoji: string;
  audioKey?: string;
  examples: VocabExample[];
}

export const VOCAB: VocabItem[] = [
  {
    id: 'xianzai',
    hanzi: '现在',
    pinyin: 'xiànzài',
    vi: 'Bây giờ',
    emoji: '⏱️',
    audioKey: '现在',
    examples: [
      { zh: '现在几点？', py: 'Xiànzài jǐ diǎn?', vi: 'Bây giờ mấy giờ?' },
      { zh: '我现在去学校。', py: 'Wǒ xiànzài qù xuéxiào.', vi: 'Bây giờ tôi đi đến trường.' },
      { zh: '现在下雨了。', py: 'Xiànzài xià yǔ le.', vi: 'Bây giờ trời mưa rồi.' }
    ]
  },
  {
    id: 'shangwu',
    hanzi: '上午',
    pinyin: 'shàngwǔ',
    vi: 'Buổi sáng',
    emoji: '🌅',
    audioKey: '上午',
    examples: [
      { zh: '上午我有课。', py: 'Shàngwǔ wǒ yǒu kè.', vi: 'Buổi sáng tôi có tiết học.' },
      { zh: '明天上午八点上课。', py: 'Míngtiān shàngwǔ bā diǎn shàngkè.', vi: 'Sáng mai 8 giờ vào học.' },
      { zh: '上午我很忙。', py: 'Shàngwǔ wǒ hěn máng.', vi: 'Buổi sáng tôi rất bận.' }
    ]
  },
  {
    id: 'ji',
    hanzi: '几',
    pinyin: 'jǐ',
    vi: 'Mấy',
    emoji: '❓',
    audioKey: '几',
    examples: [
      { zh: '你几点起床？', py: 'Nǐ jǐ diǎn qǐchuáng?', vi: 'Bạn mấy giờ dậy?' },
      { zh: '现在几点？', py: 'Xiànzài jǐ diǎn?', vi: 'Bây giờ mấy giờ?' },
      { zh: '你有几个同学？', py: 'Nǐ yǒu jǐ gè tóngxué?', vi: 'Bạn có mấy người bạn học?' }
    ]
  },
  {
    id: 'shangke',
    hanzi: '上课',
    pinyin: 'shàngkè',
    vi: 'Đi học / Vào lớp',
    emoji: '📖',
    audioKey: '上课',
    examples: [
      { zh: '我们八点上课。', py: 'Wǒmen bā diǎn shàngkè.', vi: 'Chúng tôi 8 giờ vào học.' },
      { zh: '老师来上课了。', py: 'Lǎoshī lái shàngkè le.', vi: 'Giáo viên đến dạy học rồi.' },
      { zh: '上课的时候不要说话。', py: 'Shàngkè de shíhou búyào shuōhuà.', vi: 'Giờ học đừng nói chuyện.' }
    ]
  },
  {
    id: 'dian',
    hanzi: '点 / 点钟',
    pinyin: 'diǎn / diǎnzhōng',
    vi: 'Giờ',
    emoji: '🕐',
    audioKey: '点',
    examples: [
      { zh: '现在三点。', py: 'Xiànzài sān diǎn.', vi: 'Bây giờ là 3 giờ.' },
      { zh: '我七点吃早饭。', py: 'Wǒ qī diǎn chī zǎofàn.', vi: 'Tôi ăn sáng lúc 7 giờ.' },
      { zh: '下午两点半见。', py: 'Xiàwǔ liǎng diǎn bàn jiàn.', vi: 'Gặp lúc 2 giờ rưỡi chiều.' }
    ]
  },
  {
    id: 'xiake',
    hanzi: '下课',
    pinyin: 'xiàkè',
    vi: 'Tan học',
    emoji: '🔔',
    audioKey: '下课',
    examples: [
      { zh: '我们十二点下课。', py: 'Wǒmen shí\'èr diǎn xiàkè.', vi: 'Chúng tôi 12 giờ tan học.' },
      { zh: '下课以后你去哪儿？', py: 'Xiàkè yǐhòu nǐ qù nǎr?', vi: 'Tan học xong bạn đi đâu?' },
      { zh: '下课了，我们回家吧。', py: 'Xiàkè le, wǒmen huíjiā ba.', vi: 'Tan học rồi, chúng ta về nhà thôi.' }
    ]
  },
  {
    id: 'fen',
    hanzi: '分 / 分钟',
    pinyin: 'fēn / fēnzhōng',
    vi: 'Phút',
    emoji: '⏳',
    audioKey: '分',
    examples: [
      { zh: '现在九点零五分。', py: 'Xiànzài jiǔ diǎn líng wǔ fēn.', vi: 'Bây giờ là 9 giờ 05 phút.' },
      { zh: '还有十分钟上课。', py: 'Hái yǒu shí fēnzhōng shàngkè.', vi: 'Còn mười phút nữa vào học.' },
      { zh: '我走十分钟就到了。', py: 'Wǒ zǒu shí fēnzhōng jiù dào le.', vi: 'Tôi đi bộ mười phút là đến.' }
    ]
  },
  {
    id: 'zhongwu',
    hanzi: '中午',
    pinyin: 'zhōngwǔ',
    vi: 'Buổi trưa',
    emoji: '☀️',
    audioKey: '中午',
    examples: [
      { zh: '中午十二点吃午饭。', py: 'Zhōngwǔ shí\'èr diǎn chī wǔfàn.', vi: 'Buổi trưa 12 giờ ăn cơm trưa.' },
      { zh: '中午我在家休息。', py: 'Zhōngwǔ wǒ zài jiā xiūxì.', vi: 'Buổi trưa tôi ở nhà nghỉ ngơi.' },
      { zh: '中午很热。', py: 'Zhōngwǔ hěn rè.', vi: 'Buổi trưa rất nóng.' }
    ]
  },
  {
    id: 'ling',
    hanzi: '零',
    pinyin: 'líng',
    vi: 'Số 0',
    emoji: '0️⃣',
    audioKey: '零',
    examples: [
      { zh: '八点零八分。', py: 'Bā diǎn líng bā fēn.', vi: '8 giờ 08 phút.' },
      { zh: '九点零五分。', py: 'Jiǔ diǎn líng wǔ fēn.', vi: '9 giờ 05 phút.' },
      { zh: '十点零三分。', py: 'Shí diǎn líng sān fēn.', vi: '10 giờ 03 phút.' }
    ]
  },
  {
    id: 'xiawu',
    hanzi: '下午',
    pinyin: 'xiàwǔ',
    vi: 'Buổi chiều',
    emoji: '🌇',
    examples: [
      { zh: '下午我有课。', py: 'Xiàwǔ wǒ yǒu kè.', vi: 'Buổi chiều tôi có tiết học.' },
      { zh: '下午三点去图书馆。', py: 'Xiàwǔ sān diǎn qù túshūguǎn.', vi: 'Buổi chiều 3 giờ đi thư viện.' },
      { zh: '今天下午下雨了。', py: 'Jīntiān xiàwǔ xià yǔ le.', vi: 'Chiều nay trời mưa rồi.' }
    ]
  },
  {
    id: 'ban',
    hanzi: '半',
    pinyin: 'bàn',
    vi: 'Nửa, rưỡi',
    emoji: '½',
    examples: [
      { zh: '七点半起床。', py: 'Qī diǎn bàn qǐchuáng.', vi: '7 giờ rưỡi thức dậy.' },
      { zh: '我吃了一半。', py: 'Wǒ chī le yíbàn.', vi: 'Tôi ăn một nửa rồi.' },
      { zh: '下午两点半上课。', py: 'Xiàwǔ liǎng diǎn bàn shàngkè.', vi: 'Chiều 2 giờ rưỡi vào học.' }
    ]
  },
  {
    id: 'fangxue',
    hanzi: '放学',
    pinyin: 'fàngxué',
    vi: 'Tan học (trường)',
    emoji: '🎒',
    examples: [
      { zh: '放学后我回家。', py: 'Fàngxué hòu wǒ huíjiā.', vi: 'Tan học xong tôi về nhà.' },
      { zh: '我们四点放学。', py: 'Wǒmen sì diǎn fàngxué.', vi: 'Chúng tôi 4 giờ tan học.' },
      { zh: '放学了，大家很高兴。', py: 'Fàngxué le, dàjiā hěn gāoxìng.', vi: 'Tan học rồi, mọi người rất vui.' }
    ]
  },
  {
    id: 'dao',
    hanzi: '到',
    pinyin: 'dào',
    vi: 'Đến',
    emoji: '🚶',
    examples: [
      { zh: '我七点到学校。', py: 'Wǒ qī diǎn dào xuéxiào.', vi: 'Tôi 7 giờ đến trường.' },
      { zh: '火车到了。', py: 'Huǒchē dào le.', vi: 'Tàu hỏa đến rồi.' },
      { zh: '你什么时候到？', py: 'Nǐ shénme shíhou dào?', vi: 'Bạn khi nào đến?' }
    ]
  },
  {
    id: 'ke',
    hanzi: '刻',
    pinyin: 'kè',
    vi: 'Khắc (15 phút)',
    emoji: '🕒',
    audioKey: '刻',
    examples: [
      { zh: '现在七点一刻。', py: 'Xiànzài qī diǎn yíkè.', vi: 'Bây giờ là 7 giờ 15 phút.' },
      { zh: '三点一刻上课。', py: 'Sān diǎn yíkè shàngkè.', vi: '3 giờ 15 phút vào học.' },
      { zh: '我们七点三刻出发。', py: 'Wǒmen qī diǎn sānkè chūfā.', vi: 'Chúng tôi 7 giờ 45 phút xuất phát.' }
    ]
  },
  {
    id: 'zaoshang',
    hanzi: '早上',
    pinyin: 'zǎoshang',
    vi: 'Buổi sáng (sớm)',
    emoji: '🌄',
    audioKey: '早上',
    examples: [
      { zh: '早上我六点起床。', py: 'Zǎoshang wǒ liù diǎn qǐchuáng.', vi: 'Buổi sáng tôi 6 giờ dậy.' },
      { zh: '早上好！', py: 'Zǎoshang hǎo!', vi: 'Chào buổi sáng!' },
      { zh: '早上我去跑步。', py: 'Zǎoshang wǒ qù pǎobù.', vi: 'Buổi sáng tôi đi chạy bộ.' }
    ]
  },
  {
    id: 'wanshang',
    hanzi: '晚上',
    pinyin: 'wǎnshang',
    vi: 'Buổi tối',
    emoji: '🌙',
    audioKey: '晚上',
    examples: [
      { zh: '晚上我十点睡觉。', py: 'Wǎnshang wǒ shí diǎn shuìjiào.', vi: 'Buổi tối tôi 10 giờ ngủ.' },
      { zh: '晚上好！', py: 'Wǎnshang hǎo!', vi: 'Chào buổi tối!' },
      { zh: '晚上我们一起吃饭。', py: 'Wǎnshang wǒmen yìqǐ chīfàn.', vi: 'Buổi tối chúng ta cùng ăn cơm.' }
    ]
  },
  {
    id: 'jintian',
    hanzi: '今天',
    pinyin: 'jīntiān',
    vi: 'Hôm nay',
    emoji: '📅',
    audioKey: '今天',
    examples: [
      { zh: '今天我很忙。', py: 'Jīntiān wǒ hěn máng.', vi: 'Hôm nay tôi rất bận.' },
      { zh: '今天星期几？', py: 'Jīntiān xīngqī jǐ?', vi: 'Hôm nay thứ mấy?' },
      { zh: '今天我们上课。', py: 'Jīntiān wǒmen shàngkè.', vi: 'Hôm nay chúng tôi có tiết.' }
    ]
  },
  {
    id: 'zuotian',
    hanzi: '昨天',
    pinyin: 'zuótiān',
    vi: 'Hôm qua',
    emoji: '⏪',
    audioKey: '昨天',
    examples: [
      { zh: '昨天下雨了。', py: 'Zuótiān xià yǔ le.', vi: 'Hôm qua trời mưa rồi.' },
      { zh: '昨天我没去学校。', py: 'Zuótiān wǒ méi qù xuéxiào.', vi: 'Hôm qua tôi không đi học.' },
      { zh: '昨天你做什么了？', py: 'Zuótiān nǐ zuò shénme le?', vi: 'Hôm qua bạn làm gì?' }
    ]
  },
  {
    id: 'mingtian',
    hanzi: '明天',
    pinyin: 'míngtiān',
    vi: 'Ngày mai',
    emoji: '⏩',
    audioKey: '明天',
    examples: [
      { zh: '明天见！', py: 'Míngtiān jiàn!', vi: 'Ngày mai gặp!' },
      { zh: '明天我有课。', py: 'Míngtiān wǒ yǒu kè.', vi: 'Ngày mai tôi có tiết học.' },
      { zh: '明天上午八点上课。', py: 'Míngtiān shàngwǔ bā diǎn shàngkè.', vi: 'Sáng mai 8 giờ vào học.' }
    ]
  },
  {
    id: 'lingchen',
    hanzi: '凌晨',
    pinyin: 'língchén',
    vi: 'Rạng sáng',
    emoji: '🌌',
    audioKey: '凌晨',
    examples: [
      { zh: '凌晨两点。', py: 'Língchén liǎng diǎn.', vi: '2 giờ sáng.' },
      { zh: '凌晨很安静。', py: 'Língchén hěn ānjìng.', vi: 'Rạng sáng rất yên tĩnh.' },
      { zh: '我凌晨才睡觉。', py: 'Wǒ língchén cái shuìjiào.', vi: 'Tôi rạng sáng mới đi ngủ.' }
    ]
  },
  {
    id: 'zaofan',
    hanzi: '早饭',
    pinyin: 'zǎofàn',
    vi: 'Bữa sáng',
    emoji: '🥣',
    audioKey: '早饭',
    examples: [
      { zh: '我七点吃早饭。', py: 'Wǒ qī diǎn chī zǎofàn.', vi: 'Tôi ăn sáng lúc 7 giờ.' },
      { zh: '早饭吃什么？', py: 'Zǎofàn chī shénme?', vi: 'Bữa sáng ăn gì?' },
      { zh: '早饭很重要。', py: 'Zǎofàn hěn zhòngyào.', vi: 'Bữa sáng rất quan trọng.' }
    ]
  },
  {
    id: 'wufan',
    hanzi: '午饭',
    pinyin: 'wǔfàn',
    vi: 'Bữa trưa',
    emoji: '🍱',
    audioKey: '午饭',
    examples: [
      { zh: '我十二点吃午饭。', py: 'Wǒ shí\'èr diǎn chī wǔfàn.', vi: 'Tôi 12 giờ ăn trưa.' },
      { zh: '午饭很好吃。', py: 'Wǔfàn hěn hǎochī.', vi: 'Bữa trưa rất ngon.' },
      { zh: '我们一起去吃午饭吧。', py: 'Wǒmen yìqǐ qù chī wǔfàn ba.', vi: 'Chúng ta cùng đi ăn trưa nhé.' }
    ]
  },
  {
    id: 'wanfan',
    hanzi: '晚饭',
    pinyin: 'wǎnfàn',
    vi: 'Bữa tối',
    emoji: '🍲',
    audioKey: '晚饭',
    examples: [
      { zh: '晚上七点吃晚饭。', py: 'Wǎnshang qī diǎn chī wǎnfàn.', vi: 'Buổi tối 7 giờ ăn cơm tối.' },
      { zh: '晚饭后我们去散步。', py: 'Wǎnfàn hòu wǒmen qù sànbù.', vi: 'Sau bữa tối chúng tôi đi dạo.' },
      { zh: '晚饭我不吃了。', py: 'Wǎnfàn wǒ bù chī le.', vi: 'Bữa tối tôi không ăn nữa.' }
    ]
  },
  {
    id: 'qichuang',
    hanzi: '起床',
    pinyin: 'qǐchuáng',
    vi: 'Thức dậy',
    emoji: '🛏️',
    audioKey: '起床',
    examples: [
      { zh: '我今天早上7点半起床。', py: 'Wǒ jīntiān zǎoshang 7 diǎn bàn qǐchuáng.', vi: 'Hôm nay 7h30 sáng tôi dậy.' },
      { zh: '快起床，要迟到了！', py: 'Kuài qǐchuáng, yào chídào le!', vi: 'Dậy mau, muộn học rồi!' },
      { zh: '你每天几点起床？', py: 'Nǐ měitiān jǐ diǎn qǐchuáng?', vi: 'Mỗi ngày bạn mấy giờ dậy?' }
    ]
  },
  {
    id: 'chifan',
    hanzi: '吃饭',
    pinyin: 'chīfàn',
    vi: 'Ăn cơm',
    emoji: '🍚',
    audioKey: '吃饭',
    examples: [
      { zh: '他晚上7点吃饭。', py: 'Tā wǎnshang 7 diǎn chīfàn.', vi: 'Anh ấy ăn cơm lúc 7 giờ tối.' },
      { zh: '你吃饭了吗？', py: 'Nǐ chīfàn le ma?', vi: 'Bạn ăn cơm chưa?' },
      { zh: '我们一起去吃饭吧。', py: 'Wǒmen yìqǐ qù chīfàn ba.', vi: 'Chúng ta cùng đi ăn cơm nhé.' }
    ]
  },
  {
    id: 'huijia',
    hanzi: '回家',
    pinyin: 'huíjiā',
    vi: 'Về nhà',
    emoji: '🏠',
    audioKey: '回家',
    examples: [
      { zh: '放学后我回家。', py: 'Fàngxué hòu wǒ huíjiā.', vi: 'Tan học xong tôi về nhà.' },
      { zh: '你几点回家？', py: 'Nǐ jǐ diǎn huíjiā?', vi: 'Bạn mấy giờ về nhà?' },
      { zh: '我要回家了。', py: 'Wǒ yào huíjiā le.', vi: 'Tôi phải về nhà rồi.' }
    ]
  },
  {
    id: 'shuijiao',
    hanzi: '睡觉',
    pinyin: 'shuìjiào',
    vi: 'Ngủ',
    emoji: '💤',
    audioKey: '睡觉',
    examples: [
      { zh: '我晚上十点睡觉。', py: 'Wǒ wǎnshang shí diǎn shuìjiào.', vi: 'Tôi ngủ lúc 10 giờ tối.' },
      { zh: '早点睡觉吧。', py: 'Zǎodiǎn shuìjiào ba.', vi: 'Ngủ sớm đi nhé.' },
      { zh: '他睡觉了。', py: 'Tā shuìjiào le.', vi: 'Anh ấy ngủ rồi.' }
    ]
  }
];

export interface WriteCharItem {
  c: string;
  py: string;
  vi: string;
  audioKey?: string;
}

export const WRITE_CHARS: WriteCharItem[] = [
  { c: '现', py: 'xiàn', vi: 'hiện - 现在', audioKey: '现在' },
  { c: '在', py: 'zài', vi: 'tại - 现在', audioKey: '现在' },
  { c: '早', py: 'zǎo', vi: 'sớm - 早上', audioKey: '早上' },
  { c: '上', py: 'shàng', vi: 'trên - 上午', audioKey: '上午' },
  { c: '午', py: 'wǔ', vi: 'trưa - 中午', audioKey: '中午' },
  { c: '下', py: 'xià', vi: 'dưới - 下午', audioKey: '下课' },
  { c: '晚', py: 'wǎn', vi: 'tối - 晚上', audioKey: '晚上' },
  { c: '半', py: 'bàn', vi: 'rưỡi - 半' },
  { c: '点', py: 'diǎn', vi: 'giờ - 点', audioKey: '点' },
  { c: '分', py: 'fēn', vi: 'phút - 分', audioKey: '分' },
  { c: '刻', py: 'kè', vi: 'khắc - 刻', audioKey: '刻' },
  { c: '零', py: 'líng', vi: 'số 0 - 零', audioKey: '零' },
  { c: '起', py: 'qǐ', vi: 'dậy - 起床', audioKey: '起床' },
  { c: '床', py: 'chuáng', vi: 'giường - 起床', audioKey: '起床' },
  { c: '课', py: 'kè', vi: 'bài - 上课', audioKey: '上课' },
  { c: '到', py: 'dào', vi: 'đến - 到' },
  { c: '几', py: 'jǐ', vi: 'mấy - 几', audioKey: '几' },
  { c: '回', py: 'huí', vi: 'về - 回家', audioKey: '回家' },
  { c: '家', py: 'jiā', vi: 'nhà - 回家', audioKey: '回家' },
  { c: '觉', py: 'jiào', vi: 'ngủ - 睡觉', audioKey: '睡觉' }
];

export const FILL_QUESTIONS = [
  {
    sentence: '他每天七点______学校。',
    py: 'Tā měitiān qī diǎn ______ xuéxiào.',
    options: [
      { text: '去', py: 'qù' },
      { text: '在', py: 'zài' },
      { text: '到', py: 'dào' }
    ],
    ans: '去',
    fullZh: '他每天七点去学校。'
  },
  {
    sentence: '我们下午四点______。',
    py: 'Wǒmen xiàwǔ sì diǎn ______.',
    options: [
      { text: '下课', py: 'xiàkè' },
      { text: '上课', py: 'shàngkè' },
      { text: '起床', py: 'qǐchuáng' }
    ],
    ans: '下课',
    fullZh: '我们下午四点下课。'
  },
  {
    sentence: '妹妹喜欢去______看篮球比赛。',
    py: 'Mèimei xǐhuan qù ______ kàn lánqiú bǐsài.',
    options: [
      { text: '学校', py: 'xuéxiào' },
      { text: '饭厅', py: 'fàntīng' },
      { text: '厕所', py: 'cèsuǒ' }
    ],
    ans: '学校',
    fullZh: '妹妹喜欢去学校看篮球比赛。'
  },
  {
    sentence: '你______在做什么？',
    py: 'Nǐ ______ zài zuò shénme?',
    options: [
      { text: '现在', py: 'xiànzài' },
      { text: '明天', py: 'míngtiān' },
      { text: '昨天', py: 'zuótiān' }
    ],
    ans: '现在',
    fullZh: '你现在在做什么？'
  },
  {
    sentence: '我十二点______午饭。',
    py: 'Wǒ shí\'èr diǎn ______ wǔfàn.',
    options: [
      { text: '吃', py: 'chī' },
      { text: '喝', py: 'hē' },
      { text: '看', py: 'kàn' }
    ],
    ans: '吃',
    fullZh: '我十二点吃午饭。'
  }
];

export const TIME_QUESTIONS = [
  {
    time: '07:15',
    options: [
      { text: '七点一刻', py: 'qī diǎn yíkè' },
      { text: '七点三刻', py: 'qī diǎn sānkè' }
    ],
    ans: '七点一刻'
  },
  {
    time: '09:08',
    options: [
      { text: '九点零八分', py: 'jiǔ diǎn líng bā fēn' },
      { text: '九点八分', py: 'jiǔ diǎn bā fēn' }
    ],
    ans: '九点零八分'
  },
  {
    time: '10:45',
    options: [
      { text: '十点三刻', py: 'shí diǎn sānkè' },
      { text: '十点一刻', py: 'shí diǎn yíkè' }
    ],
    ans: '十点三刻'
  },
  {
    time: '06:30',
    options: [
      { text: '六点半', py: 'liù diǎn bàn' },
      { text: '六点一刻', py: 'liù diǎn yíkè' }
    ],
    ans: '六点半'
  },
  {
    time: '12:05',
    options: [
      { text: '十二点零五分', py: 'shí\'èr diǎn líng wǔ fēn' },
      { text: '十二点五分', py: 'shí\'èr diǎn wǔ fēn' }
    ],
    ans: '十二点零五分'
  }
];

export const SORT_QUESTIONS = [
  {
    words: [
      { w: '我', py: 'wǒ' },
      { w: '早上', py: 'zǎoshang' },
      { w: '七点', py: 'qī diǎn' },
      { w: '起床', py: 'qǐchuáng' }
    ],
    ans: '我早上七点起床',
    vi: 'Tôi thức dậy lúc 7 giờ sáng.'
  },
  {
    words: [
      { w: '他', py: 'tā' },
      { w: '晚上', py: 'wǎnshang' },
      { w: '十点', py: 'shí diǎn' },
      { w: '睡觉', py: 'shuìjiào' }
    ],
    ans: '他晚上十点睡觉',
    vi: 'Anh ấy đi ngủ lúc 10 giờ tối.'
  },
  {
    words: [
      { w: '我们', py: 'wǒmen' },
      { w: '下午', py: 'xiàwǔ' },
      { w: '三点', py: 'sān diǎn' },
      { w: '上课', py: 'shàngkè' }
    ],
    ans: '我们下午三点上课',
    vi: 'Chúng tôi học lúc 3 giờ chiều.'
  },
  {
    words: [
      { w: '你', py: 'nǐ' },
      { w: '每天', py: 'měitiān' },
      { w: '几点', py: 'jǐ diǎn' },
      { w: '吃饭', py: 'chīfàn' }
    ],
    ans: '你每天几点吃饭',
    vi: 'Mỗi ngày bạn ăn cơm lúc mấy giờ?'
  },
  {
    words: [
      { w: '妹妹', py: 'mèimei' },
      { w: '中午', py: 'zhōngwǔ' },
      { w: '十二点', py: 'shí\'èr diǎn' },
      { w: '吃午饭', py: 'chī wǔfàn' }
    ],
    ans: '妹妹中午十二点吃午饭',
    vi: 'Em gái ăn trưa lúc 12 giờ trưa.'
  }
];
