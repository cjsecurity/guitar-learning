import { QuestionPickOptions, normalizeQuestionPickOptions, pickQuestionCandidate } from "./reviewQueue";

export type DifficultyId = "easy" | "medium" | "hard" | "hell";

export type ChordType =
  | "maj"
  | "m"
  | "dim"
  | "aug"
  | "maj7"
  | "7"
  | "m7"
  | "m7b5"
  | "m9"
  | "9"
  | "maj9";

export type ScaleDegree = "1" | "3" | "5" | "7" | "9";
export type FormulaDegree = ScaleDegree | "b3" | "b5" | "b7" | "#5";

export interface ChallengeChapter {
  id: "chord-construction";
  title: string;
  subtitle: string;
  description: string;
  status: "available";
}

export interface DifficultyConfig {
  id: DifficultyId;
  title: string;
  badge: string;
  description: string;
  roots: string[];
  chordTypes: ChordType[];
}

export interface Question {
  root: string;
  type: ChordType;
  label: string;
}

export interface EvaluationResult {
  skeletonCorrect: boolean;
  finalCorrect: boolean;
  omittedFifthRecognized: boolean;
  omittedFifthAnswer: boolean;
  isFullyCorrect: boolean;
  expectedSkeleton: string[];
  expectedFinal: string[];
  expectedOmittedFinal: string[];
  formula: FormulaDegree[];
  explanation: string[];
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
const NATURAL_ROOTS = ["C", "D", "E", "F", "G", "A", "B"];
const ALTERED_ROOTS = ["C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"];

const NATURAL_PITCH: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const DEGREE_INTERVALS: Record<FormulaDegree, number> = {
  "1": 0,
  b3: 3,
  "3": 4,
  b5: 6,
  "5": 7,
  "#5": 8,
  b7: 10,
  "7": 11,
  "9": 14,
};

export const CHORD_CHAPTER: ChallengeChapter = {
  id: "chord-construction",
  title: "和弦音构成速算",
  subtitle: "三和弦、七和弦、九和弦分级训练",
  description: "看到根音和和弦标记，写出 1、3、5、7、9 的字母骨架与完整音名。",
  status: "available",
};

export const DIFFICULTIES: DifficultyConfig[] = [
  {
    id: "easy",
    title: "简单",
    badge: "自然音三和弦",
    description: "只用 C D E F G A B，练大三、小三、减三、增三。",
    roots: NATURAL_ROOTS,
    chordTypes: ["maj", "m", "dim", "aug"],
  },
  {
    id: "medium",
    title: "中等",
    badge: "自然音七和弦",
    description: "只用 C D E F G A B，练 maj7、7、m7、m7b5。",
    roots: NATURAL_ROOTS,
    chordTypes: ["maj7", "7", "m7", "m7b5"],
  },
  {
    id: "hard",
    title: "困难",
    badge: "自然音九和弦",
    description: "只用 C D E F G A B，练 maj9、9、m9，并理解九和弦可省略五音。",
    roots: NATURAL_ROOTS,
    chordTypes: ["maj9", "9", "m9"],
  },
  {
    id: "hell",
    title: "综合",
    badge: "升降号九和弦",
    description: "根音加入升降号，继续只练九和弦，重点识别 Fb、Cb、E#、B# 等等音拼写。",
    roots: [...NATURAL_ROOTS, ...ALTERED_ROOTS],
    chordTypes: ["maj9", "9", "m9"],
  },
];

export const CHORD_FORMULAS: Record<ChordType, FormulaDegree[]> = {
  maj: ["1", "3", "5"],
  m: ["1", "b3", "5"],
  dim: ["1", "b3", "b5"],
  aug: ["1", "3", "#5"],
  maj7: ["1", "3", "5", "7"],
  "7": ["1", "3", "5", "b7"],
  m7: ["1", "b3", "5", "b7"],
  m7b5: ["1", "b3", "b5", "b7"],
  m9: ["1", "b3", "5", "b7", "9"],
  "9": ["1", "3", "5", "b7", "9"],
  maj9: ["1", "3", "5", "7", "9"],
};

export function getDifficulty(id: DifficultyId): DifficultyConfig {
  return DIFFICULTIES.find((difficulty) => difficulty.id === id) ?? DIFFICULTIES[0];
}

export function createRandomQuestion(config: DifficultyConfig, previousOrOptions?: Question | QuestionPickOptions<Question>): Question {
  const options = normalizeQuestionPickOptions(previousOrOptions);
  const pool = config.roots.flatMap((root) => config.chordTypes.map((type) => buildQuestion(root, type)));
  return pickQuestionCandidate(pool, options);
}

export function buildQuestion(root: string, type: ChordType): Question {
  return {
    root,
    type,
    label: formatChordLabel(root, type),
  };
}

export function getRootChineseName(root: string): string {
  const normalized = normalizeNote(root);
  const letter = normalized.charAt(0);
  const accidental = normalized.slice(1);

  if (accidental === "#") {
    return `升${letter}`;
  }

  if (accidental === "b") {
    return `降${letter}`;
  }

  return letter;
}

export function getChordTypeChineseName(type: ChordType): string {
  const names: Record<ChordType, string> = {
    maj: "大三和弦",
    m: "小三和弦",
    dim: "减三和弦",
    aug: "增三和弦",
    maj7: "大七和弦",
    "7": "属七和弦",
    m7: "小七和弦",
    m7b5: "半减七和弦",
    m9: "小九和弦",
    "9": "属九和弦",
    maj9: "大九和弦",
  };

  return names[type];
}

export function getQuestionReading(question: Question): string {
  return `${question.label} = ${getRootChineseName(question.root)}${getChordTypeChineseName(question.type)}`;
}

export function getSkeletonTaskLabel(question: Question): string {
  const degrees = getSkeletonDegreeLabels(question).join("、");
  return `请把 ${question.root} 对应的 ${degrees} 字母骨架写出来`;
}

export function getFormulaTaskLabel(question: Question): string {
  return `再按 ${getChordTypeChineseName(question.type)}公式写出 ${question.label} 的完整和弦音`;
}

export function getSkeletonDegreeLabels(question: Question): ScaleDegree[] {
  if (isNinthChord(question.type)) {
    return ["1", "3", "5", "7", "9"];
  }

  if (isSeventhChord(question.type)) {
    return ["1", "3", "5", "7"];
  }

  return ["1", "3", "5"];
}

export function getLetterSkeleton(root: string, degreeCountOrIncludeNine: number | boolean): string[] {
  const rootLetter = normalizeNote(root).charAt(0);
  const rootIndex = LETTERS.indexOf(rootLetter);
  const length = typeof degreeCountOrIncludeNine === "boolean" ? (degreeCountOrIncludeNine ? 5 : 4) : degreeCountOrIncludeNine;

  return Array.from({ length }, (_, index) => LETTERS[(rootIndex + index * 2) % LETTERS.length]);
}

export function getChordFormula(type: ChordType): FormulaDegree[] {
  return CHORD_FORMULAS[type];
}

export function getChordNotes(question: Question): string[] {
  const formula = getChordFormula(question.type);
  const rootPitch = parseNote(question.root).pitch;

  return formula.map((degree) => {
    const targetPitch = mod12(rootPitch + DEGREE_INTERVALS[degree]);
    const letter = getLetterForDegree(question.root, baseDegree(degree));
    return spellPitchForLetter(letter, targetPitch);
  });
}

export function getOmittedFifthNotes(question: Question): string[] {
  const notes = getChordNotes(question);
  const formula = getChordFormula(question.type);
  const fifthIndex = formula.findIndex((degree) => baseDegree(degree) === "5");

  if (fifthIndex === -1 || !isNinthChord(question.type)) {
    return notes;
  }

  return notes.filter((_, index) => index !== fifthIndex);
}

export function evaluateAnswer(
  question: Question,
  skeletonInput: string,
  finalInput: string,
  omittedFifthChecked: boolean,
): EvaluationResult {
  const expectedSkeleton = getLetterSkeleton(question.root, getSkeletonDegreeLabels(question).length);
  const formula = getChordFormula(question.type);
  const expectedFinal = getChordNotes(question);
  const expectedOmittedFinal = getOmittedFifthNotes(question);
  const userSkeleton = parseAnswer(skeletonInput).map((note) => note.charAt(0));
  const userFinal = parseAnswer(finalInput);

  // 字母骨架只看音名字母，不看升降号。这里训练的是“隔一个字母叠三度”的第一步。
  const skeletonCorrect = arraysEqual(userSkeleton, expectedSkeleton);

  // 最终音必须按字母骨架正确拼写，所以 Abb 与 G、E# 与 F 不互相替代。
  const finalCorrect = arraysEqual(userFinal, expectedFinal.map(normalizeNote));
  const omittedFifthAnswer = isNinthChord(question.type) && arraysEqual(userFinal, expectedOmittedFinal.map(normalizeNote));
  const omittedFifthRecognized = omittedFifthChecked && omittedFifthAnswer;
  const isFullyCorrect = skeletonCorrect && finalCorrect;

  return {
    skeletonCorrect,
    finalCorrect,
    omittedFifthRecognized,
    omittedFifthAnswer,
    isFullyCorrect,
    expectedSkeleton,
    expectedFinal,
    expectedOmittedFinal,
    formula,
    explanation: buildExplanation(question, expectedSkeleton, formula, expectedFinal, expectedOmittedFinal, omittedFifthRecognized),
  };
}

export function buildHint(question: Question): string[] {
  const skeletonDegrees = getSkeletonDegreeLabels(question);
  const skeleton = getLetterSkeleton(question.root, skeletonDegrees.length);
  const formula = getChordFormula(question.type);
  const altered = formula.filter((degree) => degree.startsWith("b") || degree.startsWith("#"));
  const answer = getChordNotes(question);

  const hint = [
    `${question.root} 的 ${skeletonDegrees.join("、")} 字母骨架是 ${skeleton.join(" ")}。`,
    "字母骨架只决定用哪些字母，不决定有没有升降号。",
    `${question.type}（${getChordTypeChineseName(question.type)}）公式是 ${formula.join(" ")}。`,
  ];

  if (altered.length > 0) {
    hint.push(`所以要把 ${altered.map(formatAlteredDegree).join("、")}。`);
  } else {
    hint.push("公式里的 3、5、7 表示大三度、纯五度、大七度等标准距离；如果骨架字母的自然音距离不够，就要补 # 或 b。");
  }

  hint.push(...buildSpellingAdjustmentTips(question, skeleton, answer, formula));
  hint.push(`完整答案是 ${answer.join(" ")}。`);
  hint.push(...buildEnharmonicTips(answer));
  hint.push(...buildPracticalNotationTips(question, answer));

  if (isNinthChord(question.type)) {
    const omitted = getOmittedFifthNotes(question);
    hint.push(`九和弦练习时可以认识省略五音的写法：${omitted.join(" ")}，但完整结构仍然包含 ${answer[2]}。`);
  }

  return hint;
}

export function isTriadChord(type: ChordType): boolean {
  return type === "maj" || type === "m" || type === "dim" || type === "aug";
}

export function isSeventhChord(type: ChordType): boolean {
  return type === "maj7" || type === "7" || type === "m7" || type === "m7b5";
}

export function isNinthChord(type: ChordType): boolean {
  return type === "m9" || type === "9" || type === "maj9";
}

export function formatFormula(formula: FormulaDegree[]): string {
  return formula.join(" ");
}

export function normalizeNote(raw: string): string {
  const compact = raw.trim().replace(/♯/g, "#").replace(/♭/g, "b").replace(/\s+/g, "");
  if (!compact) {
    return "";
  }

  const letter = compact.charAt(0).toUpperCase();
  const accidental = compact
    .slice(1)
    .replace(/B/g, "b")
    .replace(/#/g, "#")
    .replace(/b/g, "b");

  return `${letter}${accidental}`;
}

export function parseAnswer(input: string): string[] {
  return input
    .replace(/[，、]/g, ",")
    .split(/[,\s]+/)
    .map(normalizeNote)
    .filter(Boolean);
}

function buildExplanation(
  question: Question,
  skeleton: string[],
  formula: FormulaDegree[],
  finalNotes: string[],
  omittedNotes: string[],
  omittedFifthRecognized: boolean,
): string[] {
  const lines = [
    `${question.root} 的 ${getSkeletonDegreeLabels(question).join("、")} 字母骨架是 ${skeleton.join(" ")}。`,
    "注意：字母骨架只是在说 1、3、5、7、9 应该分别用哪些字母，不是在说最终音一定没有升降号。",
    `${question.type} 的公式是 ${formula.join(" ")}。`,
  ];

  lines.push(...buildSpellingAdjustmentTips(question, skeleton, finalNotes, formula));
  lines.push(`所以 ${question.label} = ${finalNotes.join(" ")}。`);
  lines.push(...buildEnharmonicTips(finalNotes));
  lines.push(...buildPracticalNotationTips(question, finalNotes));

  if (isNinthChord(question.type)) {
    lines.push(`如果课堂写成 ${omittedNotes.join(" ")}，这是省略了五音 ${finalNotes[2]}，不代表 ${finalNotes[2]} 不属于 ${question.label}。`);
  }

  if (omittedFifthRecognized) {
    lines.push("你已经识别出省略五音的写法；考试完整答案仍建议把五音写出来。");
  }

  return lines;
}

function formatChordLabel(root: string, type: ChordType): string {
  if (type === "maj") {
    return root;
  }

  return `${root}${type}`;
}

function formatAlteredDegree(degree: FormulaDegree): string {
  if (degree.startsWith("b")) {
    return `${degree.replace("b", "")} 降半音`;
  }

  if (degree.startsWith("#")) {
    return `${degree.replace("#", "")} 升半音`;
  }

  return degree;
}

function buildSpellingAdjustmentTips(
  question: Question,
  skeleton: string[],
  finalNotes: string[],
  formula: FormulaDegree[],
): string[] {
  return formula
    .map((degree, index) => {
      const skeletonLetter = skeleton[index];
      const finalNote = finalNotes[index];

      if (!skeletonLetter || !finalNote || skeletonLetter === finalNote) {
        return "";
      }

      const degreeName = baseDegree(degree);
      const distanceName = getDegreeDistanceName(degree);
      return `${degreeName} 音的字母先定为 ${skeletonLetter}；但 ${question.label} 公式要求的是 ${distanceName}，所以要写成 ${finalNote}。`;
    })
    .filter(Boolean);
}

function getDegreeDistanceName(degree: FormulaDegree): string {
  const names: Record<FormulaDegree, string> = {
    "1": "根音",
    b3: "小三度",
    "3": "大三度",
    b5: "减五度",
    "5": "纯五度",
    "#5": "增五度",
    b7: "小七度",
    "7": "大七度",
    "9": "九度",
  };

  return names[degree];
}

function getLetterForDegree(root: string, degree: ScaleDegree): string {
  const degreeIndex: Record<ScaleDegree, number> = {
    "1": 0,
    "3": 1,
    "5": 2,
    "7": 3,
    "9": 4,
  };

  return getLetterSkeleton(root, 5)[degreeIndex[degree]];
}

function baseDegree(degree: FormulaDegree): ScaleDegree {
  return degree.replace("b", "").replace("#", "") as ScaleDegree;
}

function parseNote(note: string): { letter: string; pitch: number } {
  const normalized = normalizeNote(note);
  const letter = normalized.charAt(0);
  const accidentals = normalized.slice(1);
  const offset = accidentals.split("").reduce((sum, accidental) => {
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

function buildEnharmonicTips(notes: string[]): string[] {
  return notes
    .map((note) => {
      const simpleName = getSimpleEnharmonicName(note);
      if (!simpleName || simpleName === note) {
        return "";
      }

      const letter = note.charAt(0);
      return `${note} 和 ${simpleName} 是同一个实际声音；这里写 ${note}，是为了保留它在字母骨架里属于 ${letter} 这个级数。`;
    })
    .filter(Boolean);
}

function buildPracticalNotationTips(question: Question, notes: string[]): string[] {
  if (!notes.some((note) => note.includes("##") || note.includes("bb"))) {
    return [];
  }

  const practicalRoot = getCommonEnharmonicRoot(question.root);
  if (!practicalRoot) {
    return [
      "双升或双降来自严格按字母骨架拼写；它是理论拼写训练，不代表实际谱面一定优先这样写。",
    ];
  }

  return [
    `${question.label} 里出现双升/双降，是因为本题强制保留 ${question.root} 根音下的级数拼写；实际谱面常会按调性改用更易读的等音根音，例如 ${formatChordLabel(practicalRoot, question.type)}。`,
  ];
}

function getCommonEnharmonicRoot(root: string): string | null {
  const commonRoots: Record<string, string> = {
    "D#": "Eb",
    "G#": "Ab",
    "A#": "Bb",
  };

  return commonRoots[normalizeNote(root)] ?? null;
}

function getSimpleEnharmonicName(note: string): string | null {
  const parsed = parseNote(note);
  const sharpNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const flatNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const hasFlat = note.includes("b");
  const hasSharp = note.includes("#");

  if (!hasFlat && !hasSharp) {
    return null;
  }

  const simpleName = hasFlat ? flatNames[parsed.pitch] : sharpNames[parsed.pitch];
  return simpleName === note ? null : simpleName;
}

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function mod12(value: number): number {
  return ((value % 12) + 12) % 12;
}
