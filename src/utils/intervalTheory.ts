export type IntervalDifficultyId = "easy" | "medium" | "hard" | "hell";
export type IntervalQuestionMode = "identify" | "spell";
export type IntervalFeel = "完全协和" | "不完全协和" | "不协和";

export interface IntervalChapter {
  id: "interval";
  title: string;
  subtitle: string;
  description: string;
  status: "available";
}

export interface IntervalDifficultyConfig {
  id: IntervalDifficultyId;
  title: string;
  badge: string;
  description: string;
  mode: IntervalQuestionMode;
  roots: string[];
  targets?: string[];
  intervalIds?: IntervalId[];
}

export type IntervalId =
  | "P1"
  | "m2"
  | "M2"
  | "m3"
  | "M3"
  | "P4"
  | "A4"
  | "d5"
  | "P5"
  | "m6"
  | "M6"
  | "m7"
  | "M7"
  | "P8";

export interface IntervalDefinition {
  id: IntervalId;
  degreeNumber: number;
  degreeName: string;
  qualityName: string;
  fullName: string;
  semitones: number;
  feel: IntervalFeel;
  audioExample: string;
  aliases: string[];
}

export interface IntervalQuestion {
  mode: IntervalQuestionMode;
  root: string;
  target: string;
  rootFrequency: number;
  targetFrequency: number;
  interval: IntervalDefinition;
  label: string;
}

export interface IntervalEvaluationResult {
  degreeCorrect: boolean;
  semitoneCorrect: boolean;
  qualityCorrect: boolean;
  feelCorrect: boolean;
  targetCorrect: boolean;
  isFullyCorrect: boolean;
  expectedDegree: string;
  expectedSemitones: number;
  expectedQuality: string;
  expectedFeel: IntervalFeel;
  expectedTarget: string;
  expectedIntervalName: string;
  explanation: string[];
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
const NATURAL_PITCH: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const INTERVAL_CHAPTER: IntervalChapter = {
  id: "interval",
  title: "音程距离速算",
  subtitle: "度数、半音、协和感训练",
  description: "看到根音和目标音，判断它们是几度、几个半音，并分清完全协和、不完全协和与不协和。",
  status: "available",
};

export const INTERVALS: IntervalDefinition[] = [
  { id: "m2", degreeNumber: 2, degreeName: "二度", qualityName: "小", fullName: "小二度", semitones: 1, feel: "不协和", audioExample: "C -> Db 很挤、很冲突，属于不协和音程", aliases: ["小2度", "m2"] },
  { id: "P1", degreeNumber: 1, degreeName: "一度", qualityName: "纯", fullName: "纯一度", semitones: 0, feel: "完全协和", audioExample: "C -> C 是同一个音，属于完全协和", aliases: ["纯1度", "P1", "同度"] },
  { id: "M2", degreeNumber: 2, degreeName: "二度", qualityName: "大", fullName: "大二度", semitones: 2, feel: "不协和", audioExample: "C -> D 有摩擦但能过渡，属于不协和音程", aliases: ["大2度", "M2"] },
  { id: "m3", degreeNumber: 3, degreeName: "三度", qualityName: "小", fullName: "小三度", semitones: 3, feel: "不完全协和", audioExample: "C -> Eb 偏暗、蓝调感，属于不完全协和", aliases: ["小3度", "m3"] },
  { id: "M3", degreeNumber: 3, degreeName: "三度", qualityName: "大", fullName: "大三度", semitones: 4, feel: "不完全协和", audioExample: "C -> E 明亮、开朗，属于不完全协和", aliases: ["大3度", "M3"] },
  { id: "P4", degreeNumber: 4, degreeName: "四度", qualityName: "纯", fullName: "纯四度", semitones: 5, feel: "完全协和", audioExample: "C -> F 开阔、稳定，属于完全协和", aliases: ["纯4度", "P4"] },
  { id: "A4", degreeNumber: 4, degreeName: "四度", qualityName: "增", fullName: "增四度", semitones: 6, feel: "不协和", audioExample: "C -> F# 很不稳定，属于三全音/不协和", aliases: ["增4度", "A4", "#4"] },
  { id: "d5", degreeNumber: 5, degreeName: "五度", qualityName: "减", fullName: "减五度", semitones: 6, feel: "不协和", audioExample: "C -> Gb 很不稳定，属于三全音/不协和", aliases: ["减5度", "d5", "b5"] },
  { id: "P5", degreeNumber: 5, degreeName: "五度", qualityName: "纯", fullName: "纯五度", semitones: 7, feel: "完全协和", audioExample: "C -> G 稳定、有力，属于完全协和", aliases: ["纯5度", "P5"] },
  { id: "m6", degreeNumber: 6, degreeName: "六度", qualityName: "小", fullName: "小六度", semitones: 8, feel: "不完全协和", audioExample: "C -> Ab 悲伤、戏剧，属于不完全协和", aliases: ["小6度", "m6"] },
  { id: "M6", degreeNumber: 6, degreeName: "六度", qualityName: "大", fullName: "大六度", semitones: 9, feel: "不完全协和", audioExample: "C -> A 温暖、甜美，属于不完全协和", aliases: ["大6度", "M6"] },
  { id: "m7", degreeNumber: 7, degreeName: "七度", qualityName: "小", fullName: "小七度", semitones: 10, feel: "不协和", audioExample: "C -> Bb 有爵士/布鲁斯张力，属于不协和", aliases: ["小7度", "m7"] },
  { id: "M7", degreeNumber: 7, degreeName: "七度", qualityName: "大", fullName: "大七度", semitones: 11, feel: "不协和", audioExample: "C -> B 明亮但悬着，属于不协和", aliases: ["大7度", "M7"] },
  { id: "P8", degreeNumber: 8, degreeName: "八度", qualityName: "纯", fullName: "八度", semitones: 12, feel: "完全协和", audioExample: "C -> C 最稳定，像同一个音升高一组，属于完全协和", aliases: ["纯八度", "纯8度", "P8"] },
];

export const INTERVAL_DIFFICULTIES: IntervalDifficultyConfig[] = [
  {
    id: "easy",
    title: "简单",
    badge: "C 根音自然目标音",
    description: "固定 C 为根音，只练自然目标音，先建立第一张音程地图。",
    mode: "identify",
    roots: ["C"],
    targets: ["D", "E", "F", "G", "A", "B", "C"],
  },
  {
    id: "medium",
    title: "中等",
    badge: "C 根音含升降号",
    description: "仍固定 C 为根音，加入 Eb、F#、Gb 等目标音，重点练“度数看字母，性质看半音”。",
    mode: "identify",
    roots: ["C"],
    targets: ["Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "C"],
  },
  {
    id: "hard",
    title: "困难",
    badge: "自然根音随机",
    description: "根音换成 C D E F G A B，不能只背 C 表，要用规则推出来。",
    mode: "identify",
    roots: ["C", "D", "E", "F", "G", "A", "B"],
    intervalIds: ["P1", "m2", "M2", "m3", "M3", "P4", "A4", "d5", "P5", "m6", "M6", "m7", "M7", "P8"],
  },
  {
    id: "hell",
    title: "地狱",
    badge: "反向拼写",
    description: "给根音和音程名，写出目标音。重点分清 C 的增四度是 F#，减五度是 Gb。",
    mode: "spell",
    roots: ["C", "D", "E", "F", "G", "A", "B"],
    intervalIds: ["P1", "m2", "M2", "m3", "M3", "P4", "A4", "d5", "P5", "m6", "M6", "m7", "M7", "P8"],
  },
];

export function getIntervalDifficulty(id: IntervalDifficultyId): IntervalDifficultyConfig {
  return INTERVAL_DIFFICULTIES.find((difficulty) => difficulty.id === id) ?? INTERVAL_DIFFICULTIES[0];
}

export function createRandomIntervalQuestion(config: IntervalDifficultyConfig, previous?: IntervalQuestion): IntervalQuestion {
  let question = buildRandomQuestion(config);

  if (previous && question.label === previous.label) {
    question = buildRandomQuestion(config);
  }

  return question;
}

export function evaluateIntervalAnswer(
  question: IntervalQuestion,
  answers: { degree: string; semitones: string; quality: string; feel: string; target: string },
): IntervalEvaluationResult {
  const degreeCorrect = normalizeDegreeAnswer(answers.degree) === String(question.interval.degreeNumber);
  const semitoneCorrect = Number(answers.semitones.trim()) === question.interval.semitones;
  const qualityCorrect = normalizeQualityAnswer(answers.quality, question.interval);
  const feelCorrect = normalizeFeelAnswer(answers.feel) === question.interval.feel;
  const targetCorrect = normalizeNote(answers.target) === normalizeNote(question.target);
  const isFullyCorrect =
    question.mode === "spell"
      ? targetCorrect
      : degreeCorrect && semitoneCorrect && qualityCorrect && feelCorrect;

  return {
    degreeCorrect,
    semitoneCorrect,
    qualityCorrect,
    feelCorrect,
    targetCorrect,
    isFullyCorrect,
    expectedDegree: question.interval.degreeName,
    expectedSemitones: question.interval.semitones,
    expectedQuality: question.interval.fullName,
    expectedFeel: question.interval.feel,
    expectedTarget: question.target,
    expectedIntervalName: question.interval.fullName,
    explanation: buildIntervalExplanation(question),
  };
}

export function normalizeNote(raw: string): string {
  const compact = raw.trim().replace(/♯/g, "#").replace(/♭/g, "b").replace(/\s+/g, "");
  if (!compact) return "";

  return `${compact.charAt(0).toUpperCase()}${compact.slice(1).replace(/B/g, "b")}`;
}

function buildRandomQuestion(config: IntervalDifficultyConfig): IntervalQuestion {
  const root = randomItem(config.roots);

  if (config.mode === "spell") {
    const interval = findInterval(randomItem(config.intervalIds ?? ["M3"]));
    const target = spellTarget(root, interval);
    return {
      mode: "spell",
      root,
      target,
      rootFrequency: noteToFrequency(root),
      targetFrequency: getTargetFrequency(target, interval),
      interval,
      label: `${root} 的 ${interval.fullName}`,
    };
  }

  if (config.targets) {
    const target = randomItem(config.targets);
    const interval = getIntervalBetween(root, target);
    return {
      mode: "identify",
      root,
      target,
      rootFrequency: noteToFrequency(root),
      targetFrequency: noteToFrequency(target),
      interval,
      label: `${root} -> ${target}`,
    };
  }

  const interval = findInterval(randomItem(config.intervalIds ?? ["M3"]));
  const target = spellTarget(root, interval);
  return {
    mode: "identify",
    root,
    target,
    rootFrequency: noteToFrequency(root),
    targetFrequency: getTargetFrequency(target, interval),
    interval,
    label: `${root} -> ${formatTargetForLabel(target, interval)}`,
  };
}

function getIntervalBetween(root: string, target: string): IntervalDefinition {
  const rootNote = parseNote(root);
  const targetNote = parseNote(target);
  const semitones = targetNote.pitch >= rootNote.pitch ? targetNote.pitch - rootNote.pitch : targetNote.pitch - rootNote.pitch + 12;
  const normalizedSemitones = semitones;
  const degreeNumber = targetNote.letter === rootNote.letter && normalizedSemitones === 0 ? 1 : getDegreeNumber(rootNote.letter, targetNote.letter);
  const match = INTERVALS.find((interval) => interval.degreeNumber === degreeNumber && interval.semitones === normalizedSemitones);

  if (!match) {
    throw new Error(`Unsupported interval: ${root} -> ${target}`);
  }

  return match;
}

function spellTarget(root: string, interval: IntervalDefinition): string {
  const rootNote = parseNote(root);
  const rootIndex = LETTERS.indexOf(rootNote.letter);
  const targetLetter = LETTERS[(rootIndex + interval.degreeNumber - 1) % LETTERS.length];
  const targetPitch = mod12(rootNote.pitch + interval.semitones);
  return spellPitchForLetter(targetLetter, targetPitch);
}

function buildIntervalExplanation(question: IntervalQuestion): string[] {
  const interval = question.interval;
  const lines = [
    `${question.root} 到 ${question.target} 的度数先看字母：数到 ${question.target.charAt(0).toUpperCase()} 是 ${interval.degreeName}。`,
    `再数半音：一共 ${interval.semitones} 个半音，所以性质是 ${interval.qualityName}，完整名称是 ${interval.fullName}。`,
    `协和分类：${interval.feel}。`,
  ];

  if (interval.id === "A4" || interval.id === "d5") {
    lines.push("增四度和减五度都是 6 个半音，也都叫三全音；区别在于目标音字母不同。");
  }

  if (question.mode === "spell") {
    lines.push(`${question.root} 的 ${interval.fullName} 要写成 ${question.target}，因为度数先决定目标字母，再用升降号补足半音距离。`);
  }

  lines.push("练习顺序：弹根音 -> 弹目标音 -> 听感觉 -> 说出音程名。");
  return lines;
}

function normalizeDegreeAnswer(answer: string): string {
  const text = answer.trim().toLowerCase();
  const chineseDigits: Record<string, string> = {
    一: "1",
    二: "2",
    三: "3",
    四: "4",
    五: "5",
    六: "6",
    七: "7",
    八: "8",
  };

  for (const [chinese, digit] of Object.entries(chineseDigits)) {
    if (text.includes(chinese) || text.includes(digit)) {
      return digit;
    }
  }

  return text.replace(/\D/g, "");
}

function normalizeQualityAnswer(answer: string, interval: IntervalDefinition): boolean {
  const text = answer.trim().replace(/\s+/g, "").toLowerCase();
  const accepted = [interval.fullName, interval.qualityName, ...interval.aliases].map((value) => value.toLowerCase());
  return accepted.some((value) => text === value || text.includes(value));
}

function normalizeFeelAnswer(answer: string): string {
  const text = answer.trim();
  if (text.includes("不完全") || text.includes("三度") || text.includes("六度") || text.includes("柔") || text.includes("顺")) return "不完全协和";
  if (text.includes("不协") || text.includes("刺") || text.includes("紧") || text.includes("张") || text.includes("摩擦")) return "不协和";
  if (text.includes("完全") || text.includes("稳") || text.includes("融合") || text.includes("纯四") || text.includes("纯五") || text.includes("八度")) return "完全协和";
  return text;
}

function findInterval(id: IntervalId): IntervalDefinition {
  return INTERVALS.find((interval) => interval.id === id) ?? INTERVALS[0];
}

function getDegreeNumber(rootLetter: string, targetLetter: string): number {
  const rootIndex = LETTERS.indexOf(rootLetter);
  const targetIndex = LETTERS.indexOf(targetLetter);
  return ((targetIndex - rootIndex + LETTERS.length) % LETTERS.length) + 1;
}

function parseNote(note: string): { letter: string; pitch: number } {
  const normalized = normalizeNote(note);
  const letter = normalized.charAt(0);
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

function noteToFrequency(note: string, octave = 4): number {
  const parsed = parseNote(note);
  const midi = (octave + 1) * 12 + parsed.pitch;
  return 440 * 2 ** ((midi - 69) / 12);
}

function getTargetFrequency(target: string, interval: IntervalDefinition): number {
  return noteToFrequency(target, interval.id === "P8" ? 5 : 4);
}

function formatTargetForLabel(target: string, interval: IntervalDefinition): string {
  return interval.id === "P8" ? `${target}(高八度)` : target;
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

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
