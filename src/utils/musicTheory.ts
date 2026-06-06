export type ChordType = "maj7" | "7" | "m7" | "m7b5" | "m9" | "9" | "maj9";

export type ScaleDegree = "1" | "3" | "5" | "7" | "9";
export type FormulaDegree = ScaleDegree | "b3" | "b5" | "b7";

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
  b7: 10,
  "7": 11,
  "9": 14,
};

export const ROOTS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "C#",
  "D#",
  "F#",
  "G#",
  "A#",
  "Bb",
  "Eb",
  "Ab",
  "Db",
  "Gb",
];

export const CHORD_TYPES: ChordType[] = ["maj7", "7", "m7", "m7b5", "m9", "9", "maj9"];

export const CHORD_FORMULAS: Record<ChordType, FormulaDegree[]> = {
  maj7: ["1", "3", "5", "7"],
  "7": ["1", "3", "5", "b7"],
  m7: ["1", "b3", "5", "b7"],
  m7b5: ["1", "b3", "b5", "b7"],
  m9: ["1", "b3", "5", "b7", "9"],
  "9": ["1", "3", "5", "b7", "9"],
  maj9: ["1", "3", "5", "7", "9"],
};

export function createRandomQuestion(previous?: Question): Question {
  let question = buildQuestion(randomItem(ROOTS), randomItem(CHORD_TYPES));

  if (previous && ROOTS.length * CHORD_TYPES.length > 1) {
    while (question.label === previous.label) {
      question = buildQuestion(randomItem(ROOTS), randomItem(CHORD_TYPES));
    }
  }

  return question;
}

export function buildQuestion(root: string, type: ChordType): Question {
  return {
    root,
    type,
    label: `${root}${type}`,
  };
}

export function getLetterSkeleton(root: string, includeNine: boolean): string[] {
  const rootLetter = normalizeNote(root).charAt(0);
  const rootIndex = LETTERS.indexOf(rootLetter);
  const length = includeNine ? 5 : 4;

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
    const letter = baseDegree(degree) === "9" ? getLetterSkeleton(question.root, true)[4] : getLetterForDegree(question.root, baseDegree(degree));
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
  const includeNine = isNinthChord(question.type);
  const expectedSkeleton = getLetterSkeleton(question.root, includeNine);
  const formula = getChordFormula(question.type);
  const expectedFinal = getChordNotes(question);
  const expectedOmittedFinal = getOmittedFifthNotes(question);
  const userSkeleton = parseAnswer(skeletonInput).map((note) => note.charAt(0));
  const userFinal = parseAnswer(finalInput);

  // 字母骨架只看音名字母，不看升降号。这里训练的是“隔一个字母叠三度”的第一步。
  const skeletonCorrect = arraysEqual(userSkeleton, expectedSkeleton);

  // 最终音必须按字母骨架正确拼写，所以 E# 与 F 不互相替代。
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
  const includeNine = isNinthChord(question.type);
  const skeleton = getLetterSkeleton(question.root, includeNine);
  const formula = getChordFormula(question.type);
  const altered = formula.filter((degree) => degree.startsWith("b"));
  const answer = getChordNotes(question);

  const hint = [
    `${question.root} 的字母骨架是 ${skeleton.join(" ")}。`,
    `${question.type} 公式是 ${formula.join(" ")}。`,
  ];

  if (altered.length > 0) {
    hint.push(`所以要把 ${altered.map((degree) => degree.replace("b", "")).join("、")} 降半音。`);
  } else {
    hint.push("这个类型不需要降低 3、5、7，只要按公式确认大小三度和七音。");
  }

  hint.push(`完整答案是 ${answer.join(" ")}。`);

  if (includeNine) {
    const omitted = getOmittedFifthNotes(question);
    hint.push(`九和弦练习时可以认识省略五音的写法：${omitted.join(" ")}，但完整结构仍然包含 ${answer[2]}。`);
  }

  return hint;
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
    `${question.root} 的 1、3、5、7${isNinthChord(question.type) ? "、9" : ""} 字母骨架是 ${skeleton.join(" ")}。`,
    `${question.type} 的公式是 ${formula.join(" ")}。`,
    `所以 ${question.label} = ${finalNotes.join(" ")}。`,
  ];

  if (isNinthChord(question.type)) {
    lines.push(`如果课堂写成 ${omittedNotes.join(" ")}，这是省略了五音 ${finalNotes[2]}，不代表 ${finalNotes[2]} 不属于 ${question.label}。`);
  }

  if (omittedFifthRecognized) {
    lines.push("你已经识别出省略五音的写法；考试完整答案仍建议把五音写出来。");
  }

  return lines;
}

function getLetterForDegree(root: string, degree: ScaleDegree): string {
  const degreeIndex: Record<ScaleDegree, number> = {
    "1": 0,
    "3": 1,
    "5": 2,
    "7": 3,
    "9": 4,
  };

  return getLetterSkeleton(root, true)[degreeIndex[degree]];
}

function baseDegree(degree: FormulaDegree): ScaleDegree {
  return degree.replace("b", "") as ScaleDegree;
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

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function mod12(value: number): number {
  return ((value % 12) + 12) % 12;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
