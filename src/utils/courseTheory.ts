import { normalizeQuestionPickOptions, pickQuestionCandidate } from "./reviewQueue";
import type { QuestionPickOptions } from "./reviewQueue";

export type TheoryDifficultyId = "easy" | "medium" | "hard" | "hell";

export interface TheoryChapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessonRefs: string;
  difficulties: TheoryDifficultyConfig[];
}

export interface TheoryDifficultyConfig {
  id: TheoryDifficultyId;
  title: string;
  badge: string;
  description: string;
  questions: TheoryQuestion[];
}

export interface TheoryQuestion {
  id: string;
  chapterId: string;
  difficultyId: TheoryDifficultyId;
  label: string;
  prompt: string;
  answerLabel: string;
  expectedAnswer: string;
  acceptedAnswers: string[];
  typeLabel: string;
  hint: string[];
  explanation: string[];
  options?: string[];
}

export interface TheoryEvaluationResult {
  isFullyCorrect: boolean;
  expectedFinal: string;
  typeLabel: string;
  explanation: string[];
  normalizedUserAnswer: string;
}

interface QuestionSeed {
  label: string;
  prompt: string;
  answerLabel: string;
  expectedAnswer: string;
  acceptedAnswers?: string[];
  typeLabel: string;
  hint: string[];
  explanation: string[];
  options?: string[];
}

const DIFFICULTY_TITLES: Record<TheoryDifficultyId, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
  hell: "综合",
};

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const NATURAL_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const HARMONIC_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 11];
const NOTE_LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
const NATURAL_PITCH: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const TRIAD_ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const SEVENTH_ROMANS = ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø7"];
const TRIAD_SUFFIXES = ["", "m", "m", "", "", "m", "dim"];
const SEVENTH_SUFFIXES = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"];
const TRIAD_QUALITY_NAMES = ["大三", "小三", "小三", "大三", "大三", "小三", "减三"];
const SEVENTH_QUALITY_NAMES = ["大七", "小七", "小七", "大七", "属七", "小七", "半减七"];

const MAJOR_PROGRESSIONS = [
  { id: "1-6-2-5", display: "1-6-2-5", degrees: [1, 6, 2, 5], roman: "Imaj7 vi7 ii7 V7" },
  { id: "ii-V-I", display: "ii-V-I", degrees: [2, 5, 1], roman: "ii7 V7 Imaj7" },
  { id: "iii-vi-ii-V", display: "iii-vi-ii-V", degrees: [3, 6, 2, 5], roman: "iii7 vi7 ii7 V7" },
  { id: "IV-iii-ii-I", display: "IV-iii-ii-I", degrees: [4, 3, 2, 1], roman: "IVmaj7 iii7 ii7 Imaj7" },
];

type BorrowedDegreeId = "bIIImaj7" | "bVImaj7" | "bVII7" | "iv" | "bVII";

const BORROWED_DEGREES: Record<BorrowedDegreeId, { scaleIndex: number; suffix: string; typeLabel: string; hint: string; explanation: string }> = {
  bIIImaj7: {
    scaleIndex: 2,
    suffix: "maj7",
    typeLabel: "借用 bIIImaj7",
    hint: "bIIImaj7 来自同主音自然小调的第 3 级七和弦。",
    explanation: "bIIImaj7 是同主音小调里常见的大七色彩。",
  },
  bVImaj7: {
    scaleIndex: 5,
    suffix: "maj7",
    typeLabel: "借用 bVImaj7",
    hint: "bVImaj7 来自同主音自然小调的第 6 级七和弦。",
    explanation: "bVImaj7 是从大调中心突然转暗的常见 borrowed chord 色彩。",
  },
  bVII7: {
    scaleIndex: 6,
    suffix: "7",
    typeLabel: "借用 bVII7",
    hint: "bVII7 来自同主音自然小调的第 7 级七和弦。",
    explanation: "bVII7 是流行、摇滚和 blues 语境里很常见的同主音借用色彩。",
  },
  iv: {
    scaleIndex: 3,
    suffix: "m",
    typeLabel: "borrowed iv",
    hint: "iv 是把大调里的 IV 借成同主音小调里的小四级。",
    explanation: "iv 是流行歌里高频的小四级借用，会让大调进行短暂变暗。一个常用听觉锚点是 Radiohead《Creep》的 G - B - C - Cm，其中 Cm 是 G major 里的 borrowed iv。",
  },
  bVII: {
    scaleIndex: 6,
    suffix: "",
    typeLabel: "借用 bVII",
    hint: "bVII 三和弦来自同主音自然小调的第 7 级三和弦。",
    explanation: "bVII 三和弦在流行/摇滚吉他里很常见，也常和 mixolydian 色彩相邻。",
  },
};

type KeySignatureKind = "none" | "sharp" | "flat";

interface KeySignatureDefinition {
  key: string;
  accidentals: string[];
  kind: KeySignatureKind;
  relativeMinor: string;
}

const SHARP_KEY_ORDER = ["C", "G", "D", "A", "E", "B", "F#", "C#"];
const FLAT_KEY_ORDER = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];

const KEY_SIGNATURES: KeySignatureDefinition[] = [
  { key: "C", accidentals: [], kind: "none", relativeMinor: "A minor" },
  { key: "G", accidentals: ["F#"], kind: "sharp", relativeMinor: "E minor" },
  { key: "D", accidentals: ["F#", "C#"], kind: "sharp", relativeMinor: "B minor" },
  { key: "A", accidentals: ["F#", "C#", "G#"], kind: "sharp", relativeMinor: "F# minor" },
  { key: "E", accidentals: ["F#", "C#", "G#", "D#"], kind: "sharp", relativeMinor: "C# minor" },
  { key: "B", accidentals: ["F#", "C#", "G#", "D#", "A#"], kind: "sharp", relativeMinor: "G# minor" },
  { key: "F#", accidentals: ["F#", "C#", "G#", "D#", "A#", "E#"], kind: "sharp", relativeMinor: "D# minor" },
  { key: "C#", accidentals: ["F#", "C#", "G#", "D#", "A#", "E#", "B#"], kind: "sharp", relativeMinor: "A# minor" },
  { key: "F", accidentals: ["Bb"], kind: "flat", relativeMinor: "D minor" },
  { key: "Bb", accidentals: ["Bb", "Eb"], kind: "flat", relativeMinor: "G minor" },
  { key: "Eb", accidentals: ["Bb", "Eb", "Ab"], kind: "flat", relativeMinor: "C minor" },
  { key: "Ab", accidentals: ["Bb", "Eb", "Ab", "Db"], kind: "flat", relativeMinor: "F minor" },
  { key: "Db", accidentals: ["Bb", "Eb", "Ab", "Db", "Gb"], kind: "flat", relativeMinor: "Bb minor" },
  { key: "Gb", accidentals: ["Bb", "Eb", "Ab", "Db", "Gb", "Cb"], kind: "flat", relativeMinor: "Eb minor" },
  { key: "Cb", accidentals: ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"], kind: "flat", relativeMinor: "Ab minor" },
];

const DIATONIC_SPECIAL_QUESTIONS = [
  q(
    "Bm7b5-E7-Am7",
    "Bm7b5 - E7 - Am7 在 C 大调里用罗马数字应怎样分析？",
    "级数进行",
    "viiø7 - V7/vi - vi7",
    ["viiø7 V7/vi vi7", "viiø - V7/vi - vi", "viiø7 V7 of vi vi7", "viio7 V7/vi vi7", "vii07 V7/vi vi7", "viim7b5 V7/vi vi7", "vii m7b5 V7/vi vi7"],
    "副属和弦",
    ["罗马数字大小写有含义：大写表示大三/属功能，小写表示小三或减性和弦。", "Bm7b5 是 C 大调的 viiø7；E7 不是顺阶 iii7，而是指向 Am/vi 的副属七和弦。"],
    ["在 C 大调视角下，Bm7b5 是 viiø7，E7 是 V7/vi，Am7 是 vi7。键盘不好输入 ø 时，可写 viiø7、viio7、vii07 或 viim7b5。若临时把 A minor 当中心听，也可理解为 A 小调的 iiø7 - V7 - i7。"],
  ),
  q(
    "Dm7-G7-Cmaj7",
    "Dm7 - G7 - Cmaj7 在 C 大调里用罗马数字怎样分析？",
    "级数进行",
    "ii7 - V7 - Imaj7",
    ["ii7 V7 Imaj7", "ii V I", "2-5-1"],
    "ii-V-I",
    ["罗马数字大小写有含义：ii 是小七，V7 是属七，Imaj7 是大七。"],
    ["Dm7 - G7 - Cmaj7 是 C 大调 ii7 - V7 - Imaj7。"],
  ),
];

const COURSE_DEFINITIONS: Array<Omit<TheoryChapter, "difficulties"> & { difficultySeeds: Record<TheoryDifficultyId, { badge: string; description: string; questions: QuestionSeed[] }> }> = [
  {
    id: "fretboard-root",
    title: "指板根音定位",
    subtitle: "五弦/六弦根音与右手落点",
    description: "训练 5、6 弦根音位置、和弦根音系统，以及 ghost note 应该落在哪个弦区。",
    lessonRefs: "第2、3、4、7课",
    difficultySeeds: {
      easy: {
        badge: "自然音根音",
        description: "只练 5、6 弦上的自然音根音，并记住 +12 品同名的迁移规则。",
        questions: [
          q("C 在五弦", "C 在 5 弦第几品？", "品位", "3", ["3品", "五弦3品", "5弦3品"], "五弦根音", ["5 弦开放音 A，1 品 Bb，2 品 B，3 品 C。"], ["5 弦 3 品是 C，这是课堂里最常用的 C 根音锚点。"]),
          q("D 在五弦", "D 在 5 弦第几品？", "品位", "5", ["5品", "五弦5品", "5弦5品"], "五弦根音", ["5 弦 3 品 C，5 品 D。"], ["5 弦 5 品是 D；12 品后同名，所以 17 品也是 D。"]),
          q("E 在五弦", "E 在 5 弦第几品？", "品位", "7", ["7品", "五弦7品", "5弦7品"], "五弦根音", ["5 弦 5 品 D，7 品 E。"], ["5 弦 7 品是 E；+12 品到 19 品仍是 E。"]),
          q("F 在五弦", "F 在 5 弦第几品？", "品位", "8", ["8品", "五弦8品", "5弦8品"], "五弦根音", ["5 弦 7 品 E，8 品 F。"], ["5 弦 8 品是 F。"]),
          q("G 在五弦", "G 在 5 弦第几品？", "品位", "10", ["10品", "十品", "五弦10品", "5弦10品"], "五弦根音", ["5 弦 8 品 F，10 品 G。"], ["5 弦 10 品是 G。"]),
          q("A 在六弦", "A 在 6 弦第几品？", "品位", "5", ["5品", "六弦5品", "6弦5品"], "六弦根音", ["6 弦 3 品 G，5 品 A。"], ["6 弦 5 品是 A，是小调与五声音阶最常用锚点之一。"]),
          q("B 在六弦", "B 在 6 弦第几品？", "品位", "7", ["7品", "六弦7品", "6弦7品"], "六弦根音", ["6 弦 5 品 A，7 品 B。"], ["6 弦 7 品是 B。"]),
          q("F 在六弦", "F 在 6 弦第几品？", "品位", "1", ["1品", "一品", "六弦1品", "6弦1品"], "六弦根音", ["6 弦开放音 E，1 品 F。"], ["6 弦 1 品是 F；13 品也是 F。"]),
          q("C 在六弦", "C 在 6 弦第几品？", "品位", "8", ["8品", "八品", "六弦8品", "6弦8品"], "六弦根音", ["6 弦 3 品 G -> 5 品 A -> 7 品 B -> 8 品 C。"], ["6 弦 8 品是 C，适合 E shape / 六弦根音系统。"]),
          q("G 在六弦", "G 在 6 弦第几品？", "品位", "3", ["3品", "六弦3品", "6弦3品"], "六弦根音", ["6 弦开放音 E，1 品 F，3 品 G。"], ["G 的六弦根音在 3 品。"]),
        ],
      },
      medium: {
        badge: "常见升降根音",
        description: "加入 Bb、Eb、F#、C#、Ab 等课堂常见根音。",
        questions: [
          q("Bb 在五弦", "Bb 在 5 弦第几品？", "品位", "1", ["1品", "五弦1品", "5弦1品"], "降号根音", ["5 弦开放音是 A，升高 1 个半音就是 Bb/A#。"], ["5 弦 1 品是 Bb，也可听成 A#；在降号调里优先写 Bb。"]),
          q("Eb 在五弦", "Eb 在 5 弦第几品？", "品位", "6", ["6品", "五弦6品", "5弦6品"], "降号根音", ["C 在 5 弦 3 品，再往上 3 个半音到 Eb。"], ["5 弦 6 品是 Eb/D#，课堂借用和弦常会用到 Ebmaj7。"]),
          q("Ab 在六弦", "Ab 在 6 弦第几品？", "品位", "4", ["4品", "六弦4品", "6弦4品"], "降号根音", ["6 弦 3 品是 G，4 品是 Ab/G#。"], ["6 弦 4 品可作为 Ab 根音，也常写成 G#。"]),
        ],
      },
      hard: {
        badge: "品位反推音名",
        description: "给出 5、6 弦品位，反向说音名。",
        questions: [
          q("6弦8品", "6 弦 8 品是什么音？", "音名", "C", ["c"], "反向定位", ["6 弦 3 品 G -> 5 品 A -> 7 品 B -> 8 品 C。"], ["6 弦 8 品是 C。"]),
          q("5弦6品", "5 弦 6 品是什么音？", "音名", "Eb", ["eb", "D#", "d#"], "反向定位", ["5 弦 3 品是 C，6 品是 Eb。"], ["5 弦 6 品是 Eb，也可等音写作 D#。"]),
          q("6弦4品", "6 弦 4 品是什么音？", "音名", "Ab", ["ab", "G#", "g#"], "反向定位", ["6 弦 3 品 G，4 品 Ab/G#。"], ["6 弦 4 品是 Ab/G#。"]),
        ],
      },
      hell: {
        badge: "根音系统 + 右手",
        description: "给和弦名，同时判断根音系统、品位与 ghost note 落点。",
        questions: [
          q("Cmaj7 六弦系统", "Cmaj7 如果用六弦根音系统，根音在哪？ghost note 更自然拍哪根弦？", "根音与落点", "6弦8品，拍6弦", ["六弦8品拍六弦", "6弦8品拍6弦", "8品6弦"], "右手落点", ["先找根音，再决定右手落点。"], ["六弦根音 C 在 8 品，所以 ghost note 更自然落在六弦区域。"]),
          q("Dm9 五弦系统", "Dm9 常用五弦根音系统时，根音在哪？ghost note 更自然拍哪根弦？", "根音与落点", "5弦5品，拍5弦", ["五弦5品拍五弦", "5弦5品拍5弦"], "右手落点", ["D 在 5 弦 5 品。"], ["五弦根音 D 在 5 品，所以 ghost note 更自然落在五弦区域。"]),
        ],
      },
    },
  },
  {
    id: "diatonic-chords",
    title: "C大调顺阶和弦速算",
    subtitle: "三和弦与七和弦分层记忆",
    description: "把 C 大调的三和弦、七和弦和级数关系练成自动反应。",
    lessonRefs: "第2、3课",
    difficultySeeds: {
      easy: {
        badge: "C 大调三和弦",
        description: "按级数写 C 大调顺阶三和弦：一四六大三，二三六小三，七级减三。",
        questions: buildDiatonicDegreeQuestions("C", "triad"),
      },
      medium: {
        badge: "C 大调七和弦",
        description: "按级数写 C 大调顺阶七和弦：一四大七，二三六小七，五属七，七半减。",
        questions: buildDiatonicDegreeQuestions("C", "seventh"),
      },
      hard: {
        badge: "级数与和弦互推",
        description: "混合三和弦、七和弦、和弦反推级数。",
        questions: [...buildDiatonicReverseQuestions("C", "triad"), ...buildDiatonicReverseQuestions("C", "seventh")],
      },
      hell: {
        badge: "小调 ii-V-i 嵌入",
        description: "用标准罗马数字判断 C 大调中的 ii-V-I 与副属和弦。",
        questions: DIATONIC_SPECIAL_QUESTIONS,
      },
    },
  },
  {
    id: "chord-symbols",
    title: "和弦标记识别",
    subtitle: "看到符号先判断和弦类型",
    description: "训练 maj7、m7、7、m7b5、dim、sus 等常见标记，避免把 C7 看成 Cmaj7。",
    lessonRefs: "第2、3、4、5课",
    difficultySeeds: {
      easy: {
        badge: "三和弦符号",
        description: "识别大三、小三、减三、增三。",
        questions: [
          q("Cm", "Cm 表示什么和弦类型？", "类型", "小三和弦", ["minor", "小三", "m", "C小三和弦"], "三和弦标记", ["m/min/- 都和 minor 相关。"], ["Cm 表示 C 小三和弦。"], ["大三和弦", "小三和弦", "减三和弦", "增三和弦"]),
          q("Cdim", "Cdim / C° 表示什么和弦类型？", "类型", "减三和弦", ["dim", "减三", "C减三和弦"], "三和弦标记", ["dim 是 diminished。"], ["Cdim / C° 表示 C 减三和弦。"], ["大三和弦", "小三和弦", "减三和弦", "增三和弦"]),
          q("Caug", "Caug 表示什么和弦类型？", "类型", "增三和弦", ["aug", "增三", "+", "C+", "C增三和弦"], "三和弦标记", ["aug 是 augmented。"], ["Caug 表示 C 增三和弦。"], ["大三和弦", "小三和弦", "减三和弦", "增三和弦"]),
        ],
      },
      medium: {
        badge: "七和弦符号",
        description: "识别 maj7、m7、7、m7b5。",
        questions: [
          q("C7", "C7 表示大七还是属七？", "类型", "属七", ["dominant7", "dom7", "属七和弦"], "七和弦标记", ["只有根音 + 7 默认是属七。"], ["C7 是 C 属七，不是 Cmaj7。"], ["大七", "属七", "小七", "半减七"]),
          q("Cø7", "Cø7 / Cm7b5 表示什么？", "类型", "半减七", ["m7b5", "半减", "half diminished", "半减七和弦"], "七和弦标记", ["ø 是 half-diminished。"], ["Cø7 和 Cm7b5 都表示 C 半减七。"], ["大七", "属七", "小七", "半减七"]),
          q("Cdim7", "Cdim7 / C°7 和 Cm7b5 是同一种和弦吗？", "判断", "不是", ["否", "不同", "不是同一种"], "减七与半减七", ["dim7 是减七和弦；m7b5/ø7 是半减七和弦。"], ["Cdim7 是 C Eb Gb Bbb；Cm7b5 是 C Eb Gb Bb。它们只差七音，但功能和标记不同。"], ["是", "不是"]),
        ],
      },
      hard: {
        badge: "延伸与 sus",
        description: "识别九、十三、sus、b13。",
        questions: [
          q("G13sus4", "G13sus4 里的 sus4 表示什么？", "含义", "三音被四音替代", ["3被4替代", "四音替代三音", "没有三音"], "sus 标记", ["sus 通常表示 suspended。"], ["G13sus4 中第三音 B 被第四音 C 替代。"], ["三音被四音替代", "五音被四音替代", "加入大七音", "加入降九音"]),
          q("G7(b13)", "G7(b13) 里的 b13 是什么？", "含义", "降十三音", ["b13", "降13", "降十三", "Eb"], "变化延伸音", ["G 的 13 是 E，b13 是 Eb。"], ["G7(b13) 表示 G 属七上加入降十三音 Eb。"], ["九音", "十一音", "降十三音", "根音转位"]),
          q("Cadd9 vs C9", "Cadd9 和 C9 是同一种标记吗？", "判断", "不是", ["否", "不同", "不是同一种"], "add9 与属九", ["add9 通常是在三和弦上加 9；C9 默认含属七 Bb。"], ["Cadd9 常表示 C E G D；C9 表示 C E G Bb D。C9 不是“只加 9”的意思。"], ["是", "不是"]),
          q("C6 vs C13", "C6 和 C13 是同一种标记吗？", "判断", "不是", ["否", "不同", "不是同一种"], "六和弦与十三和弦", ["C6 通常是大三和弦加 6；C13 默认是属十三并包含 b7。"], ["C6 常表示 C E G A；C13 是 C 属七基础上加入 13 色彩，默认包含 Bb。6 和 13 是同一个字母级数，但和弦标记语境不同。"], ["是", "不是"]),
          q("Csus2", "Csus2 表示什么？", "含义", "三音被二音替代", ["3被2替代", "二音替代三音", "没有三音"], "sus2 标记", ["sus2 里通常没有三音 E，而是用 D。"], ["Csus2 常表示 C D G：第三音 E 被第二音 D 替代。"], ["三音被二音替代", "三音被四音替代", "加入属七音", "加入降十三音"]),
          q("C/E", "C/E 这种 slash chord 说明什么？", "含义", "E 在低音", ["E做低音", "低音是E", "第一低音E"], "slash chord", ["斜线后面的音是低音。"], ["C/E 表示 C 和弦，但最低音放 E；它不改变上方和弦仍是 C。"], ["E 在低音", "E 是九音", "C 变成小和弦", "C 是属七"]),
        ],
      },
      hell: {
        badge: "多写法互认",
        description: "同一个和弦类型的多个标记互相识别。",
        questions: [
          q("Bø7", "Bø7 的等价常见写法是什么？", "写法", "Bm7b5", ["Bmin7b5", "B-7b5", "B half diminished"], "多写法", ["ø7 就是 m7b5。"], ["Bø7、Bm7b5、Bmin7b5 都是 B 半减七。"], ["Bm7b5", "Bmaj7", "B7", "Bdim7"]),
          q("C△7", "C△7 / CM7 / Cmaj7 都表示什么？", "类型", "大七和弦", ["maj7", "major7", "大七"], "多写法", ["三角符号常表示 major。"], ["C△7、CM7、Cmaj7 都是 C 大七。"], ["大七和弦", "小七和弦", "属七和弦", "半减七和弦"]),
        ],
      },
    },
  },
  {
    id: "extensions-omissions",
    title: "延伸音与省略音判断",
    subtitle: "9、11、13 与课堂 voicing",
    description: "专门巩固 Dm9、G13、G13sus4、G7(b13) 里的延伸音、省略音和声部解决。",
    lessonRefs: "第4课",
    difficultySeeds: {
      easy: {
        badge: "延伸音来源",
        description: "只问 9、11、13 分别来自哪个基本级数。",
        questions: [
          q("9 的来源", "9 音来自哪个级数？", "级数", "2", ["2级", "二级", "2音"], "延伸音来源", ["超过八度后，2 变成 9。"], ["2 -> 9。"]),
          q("11 的来源", "11 音来自哪个级数？", "级数", "4", ["4级", "四级", "4音"], "延伸音来源", ["超过八度后，4 变成 11。"], ["4 -> 11。"]),
          q("13 的来源", "13 音来自哪个级数？", "级数", "6", ["6级", "六级", "6音"], "延伸音来源", ["超过八度后，6 变成 13。"], ["6 -> 13。"]),
        ],
      },
      medium: {
        badge: "写完整结构",
        description: "给和弦名，写出核心结构。",
        questions: [
          q("Dm9", "Dm9 的完整和弦音是什么？", "音名", "D F A C E", ["D,F,A,C,E", "D F A C E"], "九和弦结构", ["Dm9 = Dm7 + 9。"], ["Dm9 完整结构是 D F A C E；课堂 D F C E 是省略五音 A。"]),
          q("G13", "在爵士/流行 lead-sheet 语境里，G13 最能说明属十三色彩的核心音有哪些？", "音名", "G B F E", ["G B D F E", "G B F E", "G,F,B,E"], "属十三核心音", ["属十三的功能通常靠根音、3音、b7、13音说明；5音常可省略，9音可加入，11音通常因与3音冲突而省略。"], ["G13 在吉他 voicing 中常抓住 G、B、F、E：根音、3音、b7、13音。严格叠三度会涉及 9、11、13，但实际伴奏会按声部与乐器限制省略部分音。"]),
        ],
      },
      hard: {
        badge: "课堂 voicing 省略音",
        description: "给课堂按法音，判断省略了哪个音。",
        questions: [
          q("Dm9 省略辨认", "课堂 Dm9 写成 D F C E，对比完整 D F A C E，少了哪个音？", "省略音", "A", ["五音A", "5音A", "A音"], "省略五音", ["Dm9 完整是 D F A C E。"], ["D F C E 是 Dm9(no5)，省略五音 A。"]),
          q("G13 省略辨认", "课堂 G13 写成 G F B E，对比完整核心 G B D F E，少了哪个音？", "省略音", "D", ["五音D", "5音D", "D音"], "省略五音", ["G 的五音是 D。"], ["G F B E 是常见 G13 吉他 voicing，省略了五音 D；这不影响它表达属十三功能。"]),
          q("属和弦自然11", "G11/G13 这类属和弦里，自然 11 为什么常被省略？", "原因", "11音与3音形成小九度冲突", ["11和3冲突", "C和B冲突", "与3音b9冲突", "小九度冲突"], "属和弦 11 省略", ["G 的 3 音是 B，自然 11 是 C。"], ["在 G 属和弦里，3 音 B 和自然 11 音 C 相差小二度/小九度，容易和属和弦的三音功能打架，所以实际 voicing 常省略自然 11，或改成 sus4。"]),
        ],
      },
      hell: {
        badge: "声部解决",
        description: "给两个和弦，判断哪个音在移动。",
        questions: [
          q("G13sus4 到 G13", "G13sus4 -> G13 中哪个音解决到哪个音？", "声部", "C -> B", ["C到B", "C-B", "4到3", "sus4到3"], "sus 解决", ["sus4 的 C 回到第三音 B。"], ["G13sus4 到 G13 是 C -> B。"]),
          q("G13 到 G7(b13)", "G13 -> G7(b13) 中哪个音下降？", "声部", "E -> Eb", ["E到Eb", "E-Eb", "13到b13"], "变化延伸音", ["G 的 13 是 E，b13 是 Eb。"], ["G13 到 G7(b13) 是 E -> Eb。"]),
        ],
      },
    },
  },
  {
    id: "progression-transpose",
    title: "级数进行转调",
    subtitle: "把 1-6-2-5 落到具体调",
    description: "训练把级数谱翻译成真实和弦名，避免只会移动把位形状却写错升降号。",
    lessonRefs: "第3、4、7课",
    difficultySeeds: {
      easy: {
        badge: "C 大调级数",
        description: "先在 C 大调内练级数和七和弦属性。",
        questions: [
          ...buildProgressionQuestions(["C"], ["1-6-2-5", "ii-V-I", "iii-vi-ii-V", "IV-iii-ii-I"]),
          buildProgressionMappingQuestion(),
        ],
      },
      medium: {
        badge: "常见调",
        description: "转到 G、D、F、Bb 等常见调。",
        questions: buildProgressionQuestions(["G", "D", "F", "Bb"], ["1-6-2-5", "ii-V-I", "iii-vi-ii-V", "IV-iii-ii-I"]),
      },
      hard: {
        badge: "升降号较多的调",
        description: "练 A、E、Ab、Db 等更容易拼错的调。",
        questions: buildProgressionQuestions(["A", "E", "B", "F#", "Eb", "Ab", "Db"], ["1-6-2-5", "ii-V-I", "iii-vi-ii-V", "IV-iii-ii-I"]),
      },
      hell: {
        badge: "反推调与级数",
        description: "给具体和弦，反推调和级数。",
        questions: buildReverseProgressionQuestions(["C", "G", "D", "A", "E", "B", "F#", "F", "Bb", "Eb", "Ab", "Db"], ["1-6-2-5", "ii-V-I"]),
      },
    },
  },
  {
    id: "key-signatures",
    title: "调号与五度圈速算",
    subtitle: "升降号顺序与关系小调",
    description: "训练调、调号、五度圈和关系小调，解决会移动把位形状但写不对调的问题。",
    lessonRefs: "第7课",
    difficultySeeds: {
      easy: {
        badge: "基础调号",
        description: "C、G、D、F、Bb 等入门调。",
        questions: [
          ...buildKeySignatureQuestions(["C", "G", "D", "F", "Bb"]),
          ...buildCircleNeighborQuestions(["C", "G"], "sharp"),
          ...buildCircleNeighborQuestions(["C", "F"], "flat"),
        ],
      },
      medium: {
        badge: "中等调号",
        description: "A、E、Eb、Ab 等常见但更容易错的调。",
        questions: [
          ...buildKeySignatureQuestions(["A", "E", "Eb", "Ab"]),
          ...buildReverseKeySignatureQuestions(["A", "E", "Eb", "Ab"]),
          ...buildCircleNeighborQuestions(["D", "A"], "sharp"),
          ...buildCircleNeighborQuestions(["Bb", "Eb"], "flat"),
        ],
      },
      hard: {
        badge: "复杂调号",
        description: "B、F#、Db、Gb 等升降号较多的调。",
        questions: [
          ...buildKeySignatureQuestions(["B", "F#", "C#", "Db", "Gb", "Cb"]),
          ...buildReverseKeySignatureQuestions(["B", "F#", "Db", "Gb"]),
          ...buildCircleNeighborQuestions(["E", "B"], "sharp"),
          ...buildCircleNeighborQuestions(["Ab", "Db"], "flat"),
        ],
      },
      hell: {
        badge: "反推与关系小调",
        description: "给调号或关系小调，反推大调并保证拼写正确。",
        questions: [
          ...buildRelativeMinorQuestions(["C", "G", "D", "F", "Bb", "Eb", "A", "E", "Ab", "Db"]),
          ...buildReverseKeySignatureQuestions(["C", "D", "A", "E", "F", "Bb", "Eb", "Ab", "Db", "B", "F#", "Gb"]),
        ],
      },
    },
  },
  {
    id: "relative-pentatonic",
    title: "关系大小调与五声音阶",
    subtitle: "同一批音，不同中心",
    description: "训练关系大小调、同主音大小调，以及大小调五声音阶的音名和中心感。",
    lessonRefs: "第5、7课",
    difficultySeeds: {
      easy: {
        badge: "常见关系大小调",
        description: "C/A、G/E、F/D 等关系大小调。",
        questions: [
          ...buildRelativeMinorQuestions(["C", "G", "F"]),
          ...buildRelativeMajorQuestions(["A", "E", "D"]),
        ],
      },
      medium: {
        badge: "自然音调五声",
        description: "写自然音调的大/小调五声音阶。",
        questions: [
          ...buildMinorPentatonicQuestions(["A", "E", "D"]),
          ...buildMajorPentatonicQuestions(["C", "G", "F"]),
        ],
      },
      hard: {
        badge: "带升降号调",
        description: "加入 A/F#、Bb/G 等带升降号关系。",
        questions: [
          ...buildRelativeMinorQuestions(["A", "E", "Bb", "Eb"]),
          ...buildMajorPentatonicQuestions(["A", "E", "Bb", "Eb"]),
          ...buildMinorPentatonicQuestions(["F#", "C#", "G", "C"]),
        ],
      },
      hell: {
        badge: "五音反推中心",
        description: "给五个音，判断可能的大调五声和小调五声中心。",
        questions: buildPentatonicCenterQuestions(["C", "G", "F", "Bb", "Eb", "A"]),
      },
    },
  },
  {
    id: "minor-function",
    title: "自然小调与和声小调功能",
    subtitle: "V7 回 i 与减七替代",
    description: "理解和声小调为何升高 7 级，以及 E7/G#°7 为什么更想回 Am。",
    lessonRefs: "第5、6课",
    difficultySeeds: {
      easy: {
        badge: "音阶差异",
        description: "对比 A、D、E 自然小调与和声小调。",
        questions: buildMinorScaleQuestions(["A", "D", "E"]),
      },
      medium: {
        badge: "v7 / V7 / vii°7",
        description: "写 A 小调里的 v7、V7、vii°7。",
        questions: [
          ...buildMinorDominantQuestions(["A"]),
          ...buildHarmonicMinorReasonQuestions(["A"]),
        ],
      },
      hard: {
        badge: "换小调",
        description: "换到 Dm、Em、Cm 等小调。",
        questions: buildMinorDominantQuestions(["D", "E", "C", "G"]),
      },
      hell: {
        badge: "减七替代",
        description: "由导音减七判断它对应哪个省略根音的属七降九。",
        questions: buildLeadingToneDiminishedQuestions(["A", "D", "E", "C", "G"]),
      },
    },
  },
  {
    id: "borrowed-chords",
    title: "借用和弦判断",
    subtitle: "同主音大小调借用",
    description: "判断和弦来自主调还是同主音小调，理解 modal mixture / borrowed chords。",
    lessonRefs: "第4课",
    difficultySeeds: {
      easy: {
        badge: "C 内外判断",
        description: "判断和弦是否属于 C major。",
        questions: [
          q("Ebmaj7", "Ebmaj7 属于 C major 顺阶和弦吗？", "判断", "不属于", ["不是", "否", "不在C大调"], "C 内外", ["C major 没有 Eb。"], ["Ebmaj7 不属于 C major，常可借自 C minor。"], ["属于", "不属于"]),
          q("Fmaj7", "Fmaj7 属于 C major 顺阶和弦吗？", "判断", "属于", ["是", "属于", "在C大调"], "C 内外", ["C 大调 4 级是 Fmaj7。"], ["Fmaj7 属于 C major。"], ["属于", "不属于"]),
        ],
      },
      medium: {
        badge: "C minor 借用",
        description: "识别 bIIImaj7、bVImaj7、bVII7、iv、bVII。",
        questions: buildBorrowedDegreeQuestions(["C"], ["bIIImaj7", "bVImaj7", "bVII7", "iv", "bVII"]),
      },
      hard: {
        badge: "进行标注",
        description: "给课堂进行，标出借用和弦。",
        questions: [
          ...buildBorrowedProgressionQuestions(["C", "G", "F"]),
          buildBorrowedIvSongAnchorQuestion(),
        ],
      },
      hell: {
        badge: "换调借用",
        description: "换到 G、F、Bb 等调做同主音借用判断。",
        questions: buildBorrowedDegreeQuestions(["G", "F", "Bb", "Eb"], ["bIIImaj7", "bVImaj7", "bVII7", "iv", "bVII"]),
      },
    },
  },
  {
    id: "rhythm-grid",
    title: "16分网格与重音移位",
    subtitle: "3+3+3+3+4 回到第一拍",
    description: "把律动理论做成可检查的节奏脑内训练：十六分音符细分、重音移位、ghost note 固定位置。",
    lessonRefs: "第6、7课",
    difficultySeeds: {
      easy: {
        badge: "16 分基础",
        description: "确认一小节里有多少格，以及每拍如何数。",
        questions: [
          q("4/4 的 16 分格", "4/4 一小节有几个 16 分音符格？", "数量", "16", ["16个", "十六个"], "16 分网格", ["每拍 4 个 16 分，4 拍共 16 个。"], ["4/4 一小节有 16 个 16 分格。"]),
          q("每拍口令", "每拍四个 16 分常念成什么？", "口令", "1 e & a", ["1e&a", "one e and a", "1 e and a"], "16 分口令", ["老师希望心里有小拍子。"], ["每拍可念 1 e & a。"]),
        ],
      },
      medium: {
        badge: "重音位置判断",
        description: "给 pattern，判断是否是三个十六分音符一组的重音移位。",
        questions: [
          q("X..X..X..X..X...", "X..X..X..X..X... 表示哪种 16 格重音分组？", "分组", "3+3+3+3+4", ["3 3 3 3 4", "三三三三四"], "重音移位", ["前四组都是 X..，每组 3 个十六分格；最后一组 X...，共 4 个十六分格。"], ["X..X..X..X..X... 一共 16 格，对应 3+3+3+3+4。"]),
          q("三个十六分一组", "课堂里的“三个十六分音符一组”是三连音吗？", "判断", "不是", ["否", "不是三连音"], "概念区分", ["它是在 16 分网格里每三个格子一组。"], ["这里不是三连音，而是在十六分音符网格中做 3+3+3+3+4 的重音移位。"], ["是", "不是"]),
        ],
      },
      hard: {
        badge: "排 16 格",
        description: "用文本排出一小节重音网格。",
        questions: [
          q("排出 3+3+3+3+4", "用 X 和 . 写出 3+3+3+3+4 的 16 格重音 pattern。", "pattern", "X..X..X..X..X...", ["X..X..X..X..X...", "X.. X.. X.. X.. X..."], "网格输入", ["X 是重音，. 是经过的 16 分格。"], ["3+3+3+3+4 可写成 X..X..X..X..X...，总长度正好 16 格。"]),
          q("排出 3+3+2+3+3+2", "用 X 和 . 写出 3+3+2+3+3+2 的 16 格重音 pattern。", "pattern", "X..X..X.X..X..X.", ["X..X..X.X..X..X.", "X.. X.. X. X.. X.. X."], "网格输入", ["把每组开头写成 X，其余格写成 .。"], ["3+3+2+3+3+2 可写成 X..X..X.X..X..X.，总长度 16 格。"]),
          q("排出 6+6+4", "用 X 和 . 写出 6+6+4 的 16 格重音 pattern。", "pattern", "X.....X.....X...", ["X.....X.....X...", "X..... X..... X..."], "网格输入", ["6 格一组就是 X 后面跟 5 个点。"], ["6+6+4 可写成 X.....X.....X...，重音落在第 1、7、13 格，总长度 16 格。"]),
          q("第2格起 3+3+3+3+4", "如果 3+3+3+3+4 从第 2 个十六分格开始，16 格 pattern 怎么写？", "pattern", ".X..X..X..X..X..", [".X..X..X..X..X..", ". X.. X.. X.. X.. X.."], "起点偏移", ["第 1 格先空出来，第 2 格开始点亮第一个重音。"], ["从第 2 格开始的 3+3+3+3+4 可写成 .X..X..X..X..X..。这能训练重音不一定总在 one 上，但心里仍要知道 one 在哪里。"]),
          q("ghost note 落点", "五弦根音系统里，ghost note 更自然拍哪根弦的区域？", "弦区", "5弦", ["五弦", "5弦", "五弦区域"], "ghost note 落点", ["老师反复强调：根音系统决定右手落点。"], ["五弦根音系统里，ghost note 更自然落在五弦区域；六弦根音系统则更自然落在六弦区域。"]),
        ],
      },
      hell: {
        badge: "能否回到第一拍",
        description: "判断错位 pattern 是否能在小节末回到下一小节第一拍。",
        questions: [
          q("四组三音加四格", "3+3+3+3+4 能在一小节末回到下一小节第一拍吗？", "判断", "能", ["可以", "能回到one", "能"], "回到第一拍", ["总数 16。"], ["3+3+3+3+4 正好等于 16 个十六分音符，所以能回到下一小节第一拍（one）。"], ["能", "不能"]),
          q("五组三音", "如果一小节只排 3+3+3+3+3，会不会完整回到下一小节第一拍？", "判断", "不能", ["不会", "不能回到one", "不能"], "回到第一拍", ["总数只有 15。"], ["3+3+3+3+3 只有 15 格，少 1 格，不能完整回到下一小节第一拍。"], ["能", "不能"]),
        ],
      },
    },
  },
];

export const THEORY_CHAPTERS: TheoryChapter[] = COURSE_DEFINITIONS.map((chapter) => ({
  id: chapter.id,
  title: chapter.title,
  subtitle: chapter.subtitle,
  description: chapter.description,
  lessonRefs: chapter.lessonRefs,
  difficulties: (Object.keys(chapter.difficultySeeds) as TheoryDifficultyId[]).map((difficultyId) => ({
    id: difficultyId,
    title: DIFFICULTY_TITLES[difficultyId],
    badge: chapter.difficultySeeds[difficultyId].badge,
    description: chapter.difficultySeeds[difficultyId].description,
    questions: chapter.difficultySeeds[difficultyId].questions.map((question, index) => ({
      ...question,
      id: `${chapter.id}-${difficultyId}-${index}`,
      chapterId: chapter.id,
      difficultyId,
      acceptedAnswers: [question.expectedAnswer, ...(question.acceptedAnswers ?? [])],
    })),
  })),
}));

export function getTheoryChapter(chapterId: string): TheoryChapter {
  return THEORY_CHAPTERS.find((chapter) => chapter.id === chapterId) ?? THEORY_CHAPTERS[0];
}

export function getTheoryDifficulty(chapterId: string, difficultyId: TheoryDifficultyId): TheoryDifficultyConfig {
  const chapter = getTheoryChapter(chapterId);
  return chapter.difficulties.find((difficulty) => difficulty.id === difficultyId) ?? chapter.difficulties[0];
}

export function createRandomTheoryQuestion(config: TheoryDifficultyConfig, previousOrOptions?: TheoryQuestion | QuestionPickOptions<TheoryQuestion>): TheoryQuestion {
  return pickQuestionCandidate(config.questions, normalizeQuestionPickOptions(previousOrOptions));
}

export function evaluateTheoryAnswer(question: TheoryQuestion, answer: string): TheoryEvaluationResult {
  const preserveRomanCase = question.acceptedAnswers.some(containsRomanToken);
  const normalizedUserAnswer = normalizeAnswer(answer, { preserveRomanCase });
  const isFullyCorrect = question.acceptedAnswers.some((accepted) => answersMatch(normalizedUserAnswer, normalizeAnswer(accepted, { preserveRomanCase })));

  return {
    isFullyCorrect,
    expectedFinal: question.expectedAnswer,
    typeLabel: question.typeLabel,
    explanation: question.explanation,
    normalizedUserAnswer,
  };
}

function buildDiatonicDegreeQuestions(key: string, chordSize: "triad" | "seventh"): QuestionSeed[] {
  return Array.from({ length: 7 }, (_, index) => {
    const degree = index + 1;
    const chord = getDiatonicChord(key, degree, chordSize);
    const quality = chordSize === "triad" ? TRIAD_QUALITY_NAMES[index] : SEVENTH_QUALITY_NAMES[index];
    const roman = chordSize === "triad" ? TRIAD_ROMANS[index] : SEVENTH_ROMANS[index];
    const chordSizeName = chordSize === "triad" ? "三和弦" : "七和弦";
    const formulaHint =
      chordSize === "triad"
        ? "三和弦口诀：一四六大三，二三六小三，七级减三。"
        : "七和弦口诀：一四大七，二三六小七，五属七，七半减。";

    return q(
      `${degree}级${chordSizeName}`,
      `${key} 大调 ${degree} 级${chordSizeName}是什么？`,
      "和弦",
      chord,
      getChordAliases(chord),
      `${chordSizeName}级数`,
      [`${key} 大调音阶是 ${getMajorScale(key).join(" ")}。`, formulaHint],
      [`${key} 大调 ${degree} 级是 ${getMajorScale(key)[index]}，${chordSizeName}质量是 ${quality}，所以答案是 ${chord}。标准罗马数字是 ${roman}。`],
    );
  });
}

function buildDiatonicReverseQuestions(key: string, chordSize: "triad" | "seventh"): QuestionSeed[] {
  return Array.from({ length: 7 }, (_, index) => {
    const degree = index + 1;
    const chord = getDiatonicChord(key, degree, chordSize);
    const quality = chordSize === "triad" ? TRIAD_QUALITY_NAMES[index] : SEVENTH_QUALITY_NAMES[index];
    const roman = chordSize === "triad" ? TRIAD_ROMANS[index] : SEVENTH_ROMANS[index];
    const chordSizeName = chordSize === "triad" ? "三和弦" : "七和弦";

    return q(
      `${chord} 级数`,
      `${chord} 在 ${key} 大调里是几级${chordSizeName}？`,
      "级数",
      `${degree}级${quality}`,
      [`${degree}`, `${degree}级`, toChineseDegree(degree), `${toChineseDegree(degree)}级`, roman],
      "反推级数",
      [`先写出 ${key} 大调音阶：${getMajorScale(key).join(" ")}。`, `${chord} 的根音是 ${getMajorScale(key)[index]}，对应第 ${degree} 级。`],
      [`${chord} 是 ${key} 大调的 ${degree} 级${quality}${chordSizeName}，标准罗马数字是 ${roman}。`],
    );
  });
}

function buildProgressionQuestions(keys: string[], progressionIds: string[]): QuestionSeed[] {
  return keys.flatMap((key) =>
    getProgressions(progressionIds).map((progression) => {
      const chords = progression.degrees.map((degree) => getDiatonicChord(key, degree, "seventh"));
      const answer = chords.join(" ");

      return q(
        `${key} 的 ${progression.display}`,
        `${key} 大调 ${progression.display} 七和弦是什么？`,
        "和弦进行",
        answer,
        [chords.join("-"), chords.join(","), `${key} ${progression.display}`],
        "级数转调",
        [`${key} 大调音阶是 ${getMajorScale(key).join(" ")}。`, `${progression.display} 对应 ${progression.roman}。`],
        [`${key} 大调 ${progression.display} = ${answer}。这就是把 ${progression.roman} 落到 ${key} 大调的真实和弦名。`],
      );
    }),
  );
}

function buildReverseProgressionQuestions(keys: string[], progressionIds: string[]): QuestionSeed[] {
  return keys.flatMap((key) =>
    getProgressions(progressionIds).map((progression) => {
      const chords = progression.degrees.map((degree) => getDiatonicChord(key, degree, "seventh"));
      const answer = `${key}大调 ${progression.display}`;

      return q(
        chords.join(" "),
        `${chords.join(" ")} 是哪个调的什么级数进行？`,
        "调与级数",
        answer,
        [
          `${key} ${progression.display}`,
          `${key}大调${progression.display}`,
          `${key} major ${progression.display}`,
          `${key}大调 ${progression.roman}`,
          ...getProgressionAliases(progression).flatMap((alias) => [`${key} ${alias}`, `${key}大调${alias}`]),
        ],
        "反推级数",
        [`先看最后的解决目标或第一个大七和弦。`, `${chords.join(" ")} 对应 ${progression.roman}。`],
        [`这是 ${key} 大调 ${progression.display}，也就是 ${progression.roman}。`],
      );
    }),
  );
}

function buildProgressionMappingQuestion(): QuestionSeed {
  return q(
    "1-6-2-5 映射",
    "在大调七和弦里，1-6-2-5 对应哪组罗马数字与和弦属性？",
    "映射",
    "Imaj7 vi7 ii7 V7",
    ["Imaj7-vi7-ii7-V7", "Imaj7 vi7 ii7 V7"],
    "数字级数与罗马数字",
    ["1 是 Imaj7，6 是 vi7，2 是 ii7，5 是 V7。"],
    ["1-6-2-5 不是另一套神秘体系；在大调七和弦里就是 Imaj7 - vi7 - ii7 - V7。"],
  );
}

function buildKeySignatureQuestions(keys: string[]): QuestionSeed[] {
  return keys.map((key) => {
    const signature = getKeySignature(key);
    const expected = formatAccidentals(signature);
    const typeLabel = signature.kind === "sharp" ? "升号调" : signature.kind === "flat" ? "降号调" : "无升降号调";

    return q(
      `${key} major 调号`,
      `${key} major 的调号是什么？`,
      "调号",
      expected,
      getAccidentalAliases(signature),
      typeLabel,
      getKeySignatureHint(signature),
      getKeySignatureExplanation(signature),
    );
  });
}

function buildReverseKeySignatureQuestions(keys: string[]): QuestionSeed[] {
  return keys.map((key) => {
    const signature = getKeySignature(key);
    const accidentals = formatAccidentals(signature);

    return q(
      `${accidentals} -> major`,
      `调号 ${accidentals} 对应哪个大调？`,
      "调",
      `${key} major`,
      [key, `${key}大调`],
      "调号反推",
      getKeySignatureReverseHint(signature),
      [`${accidentals} 是 ${key} major 的调号。${getKeySignatureRuleText(signature)}`],
    );
  });
}

function buildCircleNeighborQuestions(keys: string[], direction: "sharp" | "flat"): QuestionSeed[] {
  const order = direction === "sharp" ? SHARP_KEY_ORDER : FLAT_KEY_ORDER;
  const directionText = direction === "sharp" ? "顺时针" : "逆时针";
  const typeLabel = direction === "sharp" ? "五度圈相邻升号调" : "五度圈相邻降号调";

  return keys
    .map((key) => {
      const index = order.indexOf(key);
      const nextKey = order[index + 1];

      if (index < 0 || !nextKey) {
        return null;
      }

      return q(
        `五度圈 ${key} -> ${nextKey}`,
        `五度圈上 ${key} major 往${directionText}走一个调是什么？`,
        "调",
        `${nextKey} major`,
        [nextKey, `${nextKey}大调`],
        typeLabel,
        [direction === "sharp" ? "顺时针每走一步多一个升号。" : "逆时针每走一步多一个降号。"],
        [`五度圈${directionText}从 ${key} 到 ${nextKey}，所以答案是 ${nextKey} major。`],
      );
    })
    .filter((question): question is QuestionSeed => Boolean(question));
}

function buildRelativeMinorQuestions(keys: string[]): QuestionSeed[] {
  return keys.map((key) => {
    const signature = getKeySignature(key);
    const minorRoot = signature.relativeMinor.replace(" minor", "");

    return q(
      `${key} major 关系小调`,
      `${key} major 的关系小调是什么？`,
      "小调",
      signature.relativeMinor,
      [`${minorRoot}m`, `${minorRoot}minor`, `${minorRoot}小调`],
      "关系大小调",
      ["大调第 6 级是关系小调；关系大小调共用同一组调号。"],
      [`${key} major 的关系小调是 ${signature.relativeMinor}，它们共用 ${formatAccidentals(signature)} 这组调号。`],
    );
  });
}

function buildRelativeMajorQuestions(minorRoots: string[]): QuestionSeed[] {
  return minorRoots.map((minorRoot) => {
    const signature = getKeySignatureByRelativeMinor(minorRoot);

    return q(
      `${minorRoot} minor 关系大调`,
      `${minorRoot} minor 的关系大调是什么？`,
      "大调",
      `${signature.key} major`,
      [signature.key, `${signature.key}大调`],
      "关系大小调",
      ["小调上方小三度找关系大调；关系大小调共用同一组调号。"],
      [`${minorRoot} minor 的关系大调是 ${signature.key} major，它们共用 ${formatAccidentals(signature)} 这组调号。`],
    );
  });
}

function buildMajorPentatonicQuestions(keys: string[]): QuestionSeed[] {
  return keys.map((key) => {
    const notes = getMajorPentatonic(key);

    return q(
      `${key} 大调五声`,
      `${key} major pentatonic 是哪五个音？`,
      "音名",
      notes.join(" "),
      [notes.join(","), notes.join(" ")],
      "大调五声",
      ["大调五声公式是 1 2 3 5 6。"],
      [`${key} major pentatonic = ${notes.join(" ")}，来自大调音阶的 1、2、3、5、6。`],
    );
  });
}

function buildMinorPentatonicQuestions(minorRoots: string[]): QuestionSeed[] {
  return minorRoots.map((minorRoot) => {
    const notes = getMinorPentatonic(minorRoot);
    const relativeMajor = getKeySignatureByRelativeMinor(minorRoot).key;

    return q(
      `${minorRoot} 小调五声`,
      `${minorRoot} minor pentatonic 是哪五个音？`,
      "音名",
      notes.join(" "),
      [notes.join(","), notes.join(" ")],
      "小调五声",
      ["小调五声公式是 1 b3 4 5 b7。"],
      [`${minorRoot} minor pentatonic = ${notes.join(" ")}。它和 ${relativeMajor} major pentatonic 共用同一批音，但中心落在 ${minorRoot}。`],
    );
  });
}

function buildPentatonicCenterQuestions(majorKeys: string[]): QuestionSeed[] {
  return majorKeys.map((majorKey) => {
    const signature = getKeySignature(majorKey);
    const minorRoot = signature.relativeMinor.replace(" minor", "");
    const notes = getMinorPentatonic(minorRoot);

    return q(
      notes.join(" "),
      `${notes.join(" ")} 可以是哪组关系大小调五声？`,
      "中心",
      `${minorRoot} minor / ${majorKey} major`,
      [`${minorRoot}m/${majorKey}`, `${minorRoot} minor ${majorKey} major`, `${minorRoot}小调/${majorKey}大调`],
      "五声中心",
      ["同一批音，中心不同；先找小调 1，再找上方小三度的关系大调中心。"],
      [`${notes.join(" ")} 是 ${minorRoot} 小调五声，也可看作 ${majorKey} 大调五声。吉他上同一盒子可以因为落点中心不同而听成不同调性。`],
    );
  });
}

function buildBorrowedDegreeQuestions(keys: string[], degreeIds: BorrowedDegreeId[]): QuestionSeed[] {
  return keys.flatMap((key) =>
    degreeIds.map((degreeId) => {
      const chord = getBorrowedChord(key, degreeId);
      const degree = BORROWED_DEGREES[degreeId];
      const naturalMinor = getMinorScale(key, "natural");
      const borrowedRoot = naturalMinor[degree.scaleIndex];

      return q(
        `${key} 的 ${degreeId}`,
        `${key} major 从同主音 ${key} minor 借来的 ${degreeId} 是哪个和弦？`,
        "和弦",
        chord,
        getChordAliases(chord),
        degree.typeLabel,
        [`${key} natural minor 是 ${naturalMinor.join(" ")}。`, degree.hint],
        [
          `${key} major 从同主音 ${key} minor 借来的 ${degreeId} 是 ${chord}。根音来自 ${key} natural minor 的 ${borrowedRoot}，和弦质量沿用同主音小调里的级数性质。`,
          degree.explanation,
        ],
      );
    }),
  );
}

function buildBorrowedProgressionQuestions(keys: string[]): QuestionSeed[] {
  return keys.flatMap((key) => {
    const tonicMaj7 = `${key}maj7`;
    const tonicTriad = key;
    const majorScale = getMajorScale(key);
    const minorScale = getMinorScale(key, "natural");
    const bIIImaj7 = getBorrowedChord(key, "bIIImaj7");
    const bVImaj7 = getBorrowedChord(key, "bVImaj7");
    const v7 = `${minorScale[4]}m7`;
    const iv = getBorrowedChord(key, "iv");
    const bVII = getBorrowedChord(key, "bVII");
    const ivSource = `${majorScale[3]} -> ${iv}`;
    const bVIISource = `${majorScale[6]} -> ${bVII}`;

    return [
      q(
        `${key}maj7 ${bIIImaj7} ${bVImaj7} ${v7}`,
        `${tonicMaj7} ${bIIImaj7} ${bVImaj7} ${v7} 中哪些是从 ${key} minor 借来的？`,
        "借用和弦",
        `${bIIImaj7} ${bVImaj7} ${v7}`,
        [`${bIIImaj7},${bVImaj7},${v7}`, `${bIIImaj7}-${bVImaj7}-${v7}`],
        "借用进行",
        [`${key} major 是主中心；${key} natural minor 是 ${minorScale.join(" ")}。`],
        [`${bIIImaj7}、${bVImaj7}、${v7} 都可从同主音 ${key} minor 借来；${tonicMaj7} 仍是 ${key} major 的主和弦。`],
      ),
      q(
        `${key} IV-iv`,
        `${tonicTriad} - ${majorScale[3]} - ${iv} - ${tonicTriad} 里哪个和弦是 borrowed iv？`,
        "借用和弦",
        iv,
        getChordAliases(iv),
        "borrowed iv",
        [`${key} major 里的 IV 是 ${majorScale[3]}，同主音 ${key} minor 里的 iv 是 ${iv}。`],
        [`${iv} 是 borrowed iv。它来自 ${key} minor，让 ${ivSource} 的变化听起来像大调里突然暗下来一点。`],
      ),
      q(
        `${key} bVII`,
        `${tonicTriad} - ${bVII} - ${majorScale[3]} - ${tonicTriad} 里哪个和弦最像从 ${key} minor / mixolydian 色彩借来的 bVII？`,
        "借用和弦",
        bVII,
        getChordAliases(bVII),
        "借用 bVII",
        [`${key} major 的七级是 ${majorScale[6]}，bVII 会把七级降到 ${minorScale[6]}。`],
        [`${bVII} 是 ${key} major 外来的 bVII。可先理解为从同主音 ${key} minor 借来；在流行/摇滚里也常带 mixolydian 色彩。${bVIISource} 是这题的关键变化。`],
      ),
    ];
  });
}

function buildBorrowedIvSongAnchorQuestion(): QuestionSeed {
  return q(
    "G-B-C-Cm",
    "常见歌曲分析里，G - B - C - Cm 这个进行中哪个和弦是 G major 里的 borrowed iv？",
    "借用和弦",
    "Cm",
    ["C minor", "C小三和弦"],
    "borrowed iv",
    ["G major 的 IV 是 C；同主音 G minor 的 iv 是 Cm。", "这类 I - III - IV - iv 色彩常被用来训练 borrowed iv 的听觉记忆。"],
    ["Cm 是 G major 里的 borrowed iv。它来自同主音 G minor，让 C -> Cm 的变化听起来像大调里突然暗下来一点。"],
  );
}

function buildMinorScaleQuestions(minorRoots: string[]): QuestionSeed[] {
  return minorRoots.flatMap((minorRoot) => {
    const natural = getMinorScale(minorRoot, "natural");
    const harmonic = getMinorScale(minorRoot, "harmonic");
    const naturalSeventh = natural[6];
    const harmonicSeventh = harmonic[6];

    return [
      q(
        `${minorRoot}自然小调`,
        `${minorRoot} 自然小调是哪七个音？`,
        "音名",
        natural.join(" "),
        [natural.join(","), natural.join(" ")],
        "自然小调",
        [`${minorRoot} 自然小调公式是 1 2 b3 4 5 b6 b7。`],
        [`${minorRoot} 自然小调是 ${natural.join(" ")}。`],
      ),
      q(
        `${minorRoot}和声小调`,
        `${minorRoot} 和声小调是哪七个音？`,
        "音名",
        harmonic.join(" "),
        [harmonic.join(","), harmonic.join(" ")],
        "和声小调",
        [`和声小调把自然小调的 b7 升高为 7：${naturalSeventh} -> ${harmonicSeventh}。`],
        [`${minorRoot} 和声小调是 ${harmonic.join(" ")}。升高第 7 级是为了制造导音，让 V7 更想回 i。`],
      ),
    ];
  });
}

function buildMinorDominantQuestions(minorRoots: string[]): QuestionSeed[] {
  return minorRoots.flatMap((minorRoot) => {
    const natural = getMinorScale(minorRoot, "natural");
    const harmonic = getMinorScale(minorRoot, "harmonic");
    const dominantRoot = natural[4];
    const naturalThird = natural[6];
    const leadingTone = harmonic[6];
    const naturalV = `${dominantRoot}m7`;
    const dominantV = `${dominantRoot}7`;
    const leadingToneChord = `${leadingTone}°7`;

    return [
      q(
        `${minorRoot}小调 v7`,
        `${minorRoot} 自然小调里的 v7 是什么？`,
        "和弦",
        naturalV,
        getChordAliases(naturalV),
        "自然小调 v7",
        [`${minorRoot} 自然小调第 5 级是 ${dominantRoot}；自然第 7 级是 ${naturalThird}，不会形成导音。`],
        [`${minorRoot} 自然小调的 v7 是 ${naturalV}。因为第三音来自自然小调，没有升高成导音，所以回 i 的力量较弱。`],
      ),
      q(
        `${minorRoot}小调 V7`,
        `${minorRoot} 和声小调里的 V7 是什么？`,
        "和弦",
        dominantV,
        getChordAliases(dominantV),
        "小调属功能",
        [`${minorRoot} 的五级是 ${dominantRoot}；和声小调把 ${naturalThird} 升成 ${leadingTone}。`],
        [`${minorRoot} 和声小调的 V7 是 ${dominantV}。${leadingTone} 是导音，会强烈想解决到 ${minorRoot}。`],
      ),
      q(
        `${minorRoot}小调 vii°7`,
        `${minorRoot} 和声小调里的 vii°7 是什么？`,
        "和弦",
        leadingToneChord,
        [`${leadingTone}dim7`, `${leadingTone} diminished7`, `${leadingTone}o7`],
        "导音减七",
        [`导音是 ${leadingTone}，从导音上叠减七和弦形成 vii°7。`],
        [`${minorRoot} 和声小调的 vii°7 是 ${leadingToneChord}，它会强烈导向 ${minorRoot}m。`],
      ),
    ];
  });
}

function buildHarmonicMinorReasonQuestions(minorRoots: string[]): QuestionSeed[] {
  return minorRoots.map((minorRoot) => {
    const natural = getMinorScale(minorRoot, "natural");
    const harmonic = getMinorScale(minorRoot, "harmonic");
    const naturalSeventh = natural[6];
    const leadingTone = harmonic[6];
    const dominantRoot = natural[4];

    return q(
      `${minorRoot}小调为何升7级`,
      `${minorRoot} 小调里为什么常把 ${naturalSeventh} 升成 ${leadingTone} 来形成和声小调？`,
      "原因",
      "制造导音让V7更强地回到i",
      ["制造导音", `让${dominantRoot}7回${minorRoot}m更强`, "形成V7回i", "导音回主音"],
      "和声小调功能",
      [`${leadingTone} 离 ${minorRoot} 只有半音。`, `升高第 7 级后，${dominantRoot}m7 会变成 ${dominantRoot}7。`],
      [`${leadingTone} 是 ${minorRoot} 的导音，会强烈想解决到 ${minorRoot}；因此 ${dominantRoot}7 比 ${dominantRoot}m7 更能制造 V7 -> i 的回家感。`],
    );
  });
}

function buildLeadingToneDiminishedQuestions(minorRoots: string[]): QuestionSeed[] {
  return minorRoots.map((minorRoot) => {
    const natural = getMinorScale(minorRoot, "natural");
    const harmonic = getMinorScale(minorRoot, "harmonic");
    const dominantRoot = natural[4];
    const leadingTone = harmonic[6];
    const diminishedNotes = getDiminishedSeventhChord(leadingTone);
    const dominantFlatNineNotes = getDominantFlatNineChord(dominantRoot);

    return q(
      `${leadingTone}°7 功能`,
      `${leadingTone}°7 导向 ${minorRoot}m 时，可理解成哪个省略根音的属七降九？`,
      "导音减七与属七降九",
      `省略根音的 ${dominantRoot}7(b9)`,
      [`${dominantRoot}7(b9)`, `${dominantRoot}7b9`, `${dominantRoot}属七降九`, `无根${dominantRoot}7b9`],
      "导音减七",
      [`${dominantRoot}7(b9)=${dominantFlatNineNotes.join(" ")}；省略根音 ${dominantRoot} 后得到 ${diminishedNotes.join(" ")}。`],
      [`${leadingTone}°7 = ${diminishedNotes.join(" ")}。正统功能和声中，它是 ${minorRoot} 小调的导音减七和弦 vii°7；在爵士/吉他语境里，也常理解为省略根音的 ${dominantRoot}7(b9)。`],
    );
  });
}

function getMinorScale(minorRoot: string, kind: "natural" | "harmonic"): string[] {
  const root = parseNote(minorRoot);
  const rootLetterIndex = NOTE_LETTERS.indexOf(root.letter);
  const intervals = kind === "natural" ? NATURAL_MINOR_INTERVALS : HARMONIC_MINOR_INTERVALS;

  return intervals.map((interval, index) => {
    const letter = NOTE_LETTERS[(rootLetterIndex + index) % NOTE_LETTERS.length];
    return spellPitchForLetter(letter, mod12(root.pitch + interval));
  });
}

function getBorrowedChord(key: string, degreeId: BorrowedDegreeId): string {
  const degree = BORROWED_DEGREES[degreeId];
  const root = getMinorScale(key, "natural")[degree.scaleIndex];
  return `${root}${degree.suffix}`;
}

function getDiminishedSeventhChord(root: string): string[] {
  const parsed = parseNote(root);
  const rootLetterIndex = NOTE_LETTERS.indexOf(parsed.letter);
  const intervals = [0, 3, 6, 9];

  return intervals.map((interval, index) => {
    const letter = NOTE_LETTERS[(rootLetterIndex + index * 2) % NOTE_LETTERS.length];
    return spellPitchForLetter(letter, mod12(parsed.pitch + interval));
  });
}

function getDominantFlatNineChord(root: string): string[] {
  const parsed = parseNote(root);
  const rootLetterIndex = NOTE_LETTERS.indexOf(parsed.letter);
  const degrees = [
    { letterOffset: 0, semitones: 0 },
    { letterOffset: 2, semitones: 4 },
    { letterOffset: 4, semitones: 7 },
    { letterOffset: 6, semitones: 10 },
    { letterOffset: 1, semitones: 13 },
  ];

  return degrees.map(({ letterOffset, semitones }) => {
    const letter = NOTE_LETTERS[(rootLetterIndex + letterOffset) % NOTE_LETTERS.length];
    return spellPitchForLetter(letter, mod12(parsed.pitch + semitones));
  });
}

function getMajorPentatonic(key: string): string[] {
  const scale = getMajorScale(key);
  return [scale[0], scale[1], scale[2], scale[4], scale[5]];
}

function getMinorPentatonic(minorRoot: string): string[] {
  const root = parseNote(minorRoot);
  const rootLetterIndex = NOTE_LETTERS.indexOf(root.letter);
  const degreeOffsets = [
    { degree: 1, semitones: 0 },
    { degree: 3, semitones: 3 },
    { degree: 4, semitones: 5 },
    { degree: 5, semitones: 7 },
    { degree: 7, semitones: 10 },
  ];

  return degreeOffsets.map(({ degree, semitones }) => {
    const letter = NOTE_LETTERS[(rootLetterIndex + degree - 1) % NOTE_LETTERS.length];
    return spellPitchForLetter(letter, mod12(root.pitch + semitones));
  });
}

function getKeySignature(key: string): KeySignatureDefinition {
  const signature = KEY_SIGNATURES.find((item) => item.key === key);

  if (!signature) {
    throw new Error(`Unsupported key signature: ${key}`);
  }

  return signature;
}

function getKeySignatureByRelativeMinor(minorRoot: string): KeySignatureDefinition {
  const signature = KEY_SIGNATURES.find((item) => item.relativeMinor === `${minorRoot} minor`);

  if (!signature) {
    throw new Error(`Unsupported relative minor: ${minorRoot}`);
  }

  return signature;
}

function formatAccidentals(signature: KeySignatureDefinition): string {
  return signature.accidentals.length > 0 ? signature.accidentals.join(" ") : "无升降号";
}

function getAccidentalAliases(signature: KeySignatureDefinition): string[] {
  if (signature.accidentals.length === 0) {
    return ["无", "没有", "0", "none"];
  }

  const accidentals = signature.accidentals.join(" ");
  return [
    accidentals,
    accidentals.replace(/#/g, "♯").replace(/b/g, "♭"),
    accidentals.replace(/\s+/g, ","),
  ];
}

function getKeySignatureHint(signature: KeySignatureDefinition): string[] {
  if (signature.kind === "none") {
    return ["C major 是五度圈中心，没有升号也没有降号。"];
  }

  if (signature.kind === "sharp") {
    const lastSharp = signature.accidentals[signature.accidentals.length - 1];
    return [`升号顺序是 F C G D A E B；${signature.key} major 的最后一个升号是 ${lastSharp}，${lastSharp} 往上半音就是 ${signature.key}。`];
  }

  if (signature.accidentals.length === 1) {
    return ["F major 只有一个降号 Bb；倒数第二个降号规则从两个以上降号开始用。"];
  }

  const secondLastFlat = signature.accidentals[signature.accidentals.length - 2];
  return [`降号顺序是 B E A D G C F；两个以上降号时，倒数第二个降号 ${secondLastFlat} 就是调名。`];
}

function getKeySignatureReverseHint(signature: KeySignatureDefinition): string[] {
  if (signature.kind === "none") {
    return ["没有升降号时，对应 C major 或 A minor；本题问大调，所以是 C major。"];
  }

  return [getKeySignatureRuleText(signature)];
}

function getKeySignatureExplanation(signature: KeySignatureDefinition): string[] {
  return [`${signature.key} major 的调号是 ${formatAccidentals(signature)}。${getKeySignatureRuleText(signature)}`];
}

function getKeySignatureRuleText(signature: KeySignatureDefinition): string {
  if (signature.kind === "none") {
    return "C major 位于五度圈中心，没有升降号。";
  }

  if (signature.kind === "sharp") {
    const lastSharp = signature.accidentals[signature.accidentals.length - 1];
    return `升号调反推时，用“最后一个升号 + 半音 = 调名”：${lastSharp} 上行半音到 ${signature.key}。`;
  }

  if (signature.accidentals.length === 1) {
    return "F major 是一个特殊基础调，只有 Bb 这一个降号。";
  }

  const secondLastFlat = signature.accidentals[signature.accidentals.length - 2];
  return `降号调反推时，倒数第二个降号 = 调名：${secondLastFlat} 就是 ${signature.key}。`;
}

function getProgressions(ids: string[]) {
  return MAJOR_PROGRESSIONS.filter((progression) => ids.includes(progression.id));
}

function getProgressionAliases(progression: (typeof MAJOR_PROGRESSIONS)[number]): string[] {
  const numeric = progression.degrees.join("-");
  const romanWithoutSevenths = progression.roman
    .replace(/maj7/g, "")
    .replace(/7/g, "")
    .replace(/\s+/g, "-");

  return Array.from(new Set([numeric, romanWithoutSevenths, progression.roman]));
}

function getDiatonicChord(key: string, degree: number, chordSize: "triad" | "seventh"): string {
  const root = getMajorScale(key)[degree - 1];
  const suffix = chordSize === "triad" ? TRIAD_SUFFIXES[degree - 1] : SEVENTH_SUFFIXES[degree - 1];
  return `${root}${suffix}`;
}

function getMajorScale(key: string): string[] {
  const root = parseNote(key);
  const rootLetterIndex = NOTE_LETTERS.indexOf(root.letter);

  return MAJOR_SCALE_INTERVALS.map((interval, index) => {
    const letter = NOTE_LETTERS[(rootLetterIndex + index) % NOTE_LETTERS.length];
    return spellPitchForLetter(letter, mod12(root.pitch + interval));
  });
}

function getChordAliases(chord: string): string[] {
  const match = chord.match(/^([A-G](?:#|b)*)(.*)$/);
  if (!match) return [];

  const [, root, suffix] = match;
  const aliases: Record<string, string[]> = {
    "": [`${root}maj`, `${root} major`],
    m: [`${root}min`, `${root}-`, `${root} minor`],
    dim: [`${root}°`, `${root} diminished`],
    maj7: [`${root}M7`, `${root}△7`, `${root} major7`],
    m7: [`${root}min7`, `${root}-7`, `${root} minor7`],
    "7": [`${root}dom7`, `${root} dominant7`],
    m7b5: [`${root}ø7`, `${root}min7b5`, `${root}-7b5`, `${root} half diminished`],
  };

  return aliases[suffix] ?? [];
}

function toChineseDegree(degree: number): string {
  return ["一", "二", "三", "四", "五", "六", "七"][degree - 1] ?? String(degree);
}

function parseNote(note: string): { letter: string; pitch: number } {
  const normalized = note.trim().replace(/♯/g, "#").replace(/♭/g, "b");
  const letter = normalized.charAt(0).toUpperCase();
  const offset = normalized
    .slice(1)
    .split("")
    .reduce((sum, accidental) => {
      if (accidental === "#") return sum + 1;
      if (accidental === "b") return sum - 1;
      return sum;
    }, 0);

  return {
    letter,
    pitch: mod12(NATURAL_PITCH[letter] + offset),
  };
}

function spellPitchForLetter(letter: string, targetPitch: number): string {
  const naturalPitch = NATURAL_PITCH[letter];
  let diff = targetPitch - naturalPitch;

  while (diff > 6) diff -= 12;
  while (diff < -6) diff += 12;

  if (diff === 0) return letter;
  if (diff > 0) return `${letter}${"#".repeat(diff)}`;
  return `${letter}${"b".repeat(Math.abs(diff))}`;
}

function mod12(value: number): number {
  return ((value % 12) + 12) % 12;
}

function q(
  label: string,
  prompt: string,
  answerLabel: string,
  expectedAnswer: string,
  acceptedAnswers: string[] | undefined,
  typeLabel: string,
  hint: string[],
  explanation: string[],
  options?: string[],
): QuestionSeed {
  return {
    label,
    prompt,
    answerLabel,
    expectedAnswer,
    acceptedAnswers,
    typeLabel,
    hint,
    explanation,
    options,
  };
}

function normalizeAnswer(value: string, options: { preserveRomanCase?: boolean } = {}): string {
  const normalized = replaceChineseNumbers(value)
    .trim()
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .replace(/，|、|\/|\||→|->|—|–|-/g, " ")
    .replace(/\s+/g, " ");

  if (!options.preserveRomanCase) {
    return normalized.toLowerCase();
  }

  return normalized
    .split(" ")
    .map((token) => (isRomanToken(token) ? token : token.toLowerCase()))
    .join(" ");
}

function answersMatch(userAnswer: string, acceptedAnswer: string): boolean {
  return userAnswer === acceptedAnswer || compact(userAnswer) === compact(acceptedAnswer);
}

function containsRomanToken(value: string): boolean {
  return value
    .replace(/，|、|\/|\||→|->|—|–|-/g, " ")
    .split(/\s+/)
    .some(isRomanToken);
}

// Roman numerals are case-sensitive in music theory: IV is major, iv is minor.
function isRomanToken(token: string): boolean {
  return /^[#b]?(?:I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii)(?:maj|m|dim|ø|°|o)?[0-9]*$/.test(token);
}

function compact(value: string): string {
  return value.replace(/\s+/g, "");
}

function replaceChineseNumbers(value: string): string {
  const phraseNumbers: Record<string, string> = {
    十三: "13",
    十二: "12",
    十一: "11",
    十: "10",
    九: "9",
    八: "8",
    七: "7",
    六: "6",
    五: "5",
    四: "4",
    三: "3",
    二: "2",
    一: "1",
  };

  return Object.entries(phraseNumbers).reduce((text, [chinese, digit]) => text.split(chinese).join(digit), value);
}
