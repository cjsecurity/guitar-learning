export type NaturalIntervalLevelId = "level1" | "level2" | "level3" | "level4" | "level5";
export type NaturalIntervalMode = "practice" | "timed";

export type NaturalIntervalAnswer =
  | "小二度"
  | "大二度"
  | "小三度"
  | "大三度"
  | "纯四度"
  | "增四度"
  | "减五度"
  | "纯五度"
  | "小六度"
  | "大六度"
  | "小七度"
  | "大七度";

export interface NaturalIntervalLevel {
  id: NaturalIntervalLevelId;
  title: string;
  subtitle: string;
  description: string;
}

export interface NaturalIntervalDefinition {
  id: string;
  root: NaturalNote;
  target: NaturalNote;
  degreeNumber: 2 | 3 | 4 | 5 | 6 | 7;
  degreeName: string;
  answer: NaturalIntervalAnswer;
  rule: string;
  detailedRule: string;
}

export interface NaturalIntervalQuestion extends NaturalIntervalDefinition {
  levelId: NaturalIntervalLevelId;
  options: NaturalIntervalAnswer[];
}

export interface NaturalIntervalHistoryItem {
  id: string;
  levelId: NaturalIntervalLevelId;
  questionLabel: string;
  selectedAnswer: NaturalIntervalAnswer;
  correctAnswer: NaturalIntervalAnswer;
  correct: boolean;
  responseSeconds?: number;
  time: string;
  review: boolean;
}

export interface NaturalIntervalMistake {
  remainingCorrects: number;
  cooldown: number;
}

export interface NaturalIntervalLevelStats {
  totalAnswers: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  totalResponseSeconds: number;
  timedAnswers: number;
  history: NaturalIntervalHistoryItem[];
  mistakes: Record<string, NaturalIntervalMistake>;
}

export type NaturalIntervalStatsByLevel = Record<NaturalIntervalLevelId, NaturalIntervalLevelStats>;
export type NaturalNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export const NATURAL_NOTES: NaturalNote[] = ["C", "D", "E", "F", "G", "A", "B"];

export const NATURAL_INTERVAL_LEVELS: NaturalIntervalLevel[] = [
  {
    id: "level1",
    title: "Level 1",
    subtitle: "只练三度",
    description: "先把自然三度的大小关系练到一眼认出。",
  },
  {
    id: "level2",
    title: "Level 2",
    subtitle: "只练四度 / 五度",
    description: "记住 F-B 是增四度，B-F 是减五度，其余自然四/五度大多很稳定。",
  },
  {
    id: "level3",
    title: "Level 3",
    subtitle: "只练六度",
    description: "用三度转位反推：小三度变大六度，大三度变小六度。",
  },
  {
    id: "level4",
    title: "Level 4",
    subtitle: "只练七度",
    description: "用二度转位反推：小二度变大七度，大二度变小七度。",
  },
  {
    id: "level5",
    title: "Level 5",
    subtitle: "混合挑战",
    description: "二度到七度混合出现，目标是在 20 题内进入 2 秒速认。",
  },
];

export const NATURAL_INTERVAL_ANSWERS: NaturalIntervalAnswer[] = [
  "小二度",
  "大二度",
  "小三度",
  "大三度",
  "纯四度",
  "增四度",
  "减五度",
  "纯五度",
  "小六度",
  "大六度",
  "小七度",
  "大七度",
];

const secondRule = "自然二度里 E-F、B-C 是小二度，其他相邻自然音是大二度。";
const thirdRule = "自然三度里 C-E、F-A、G-B 是大三度，其余自然三度是小三度。";
const fourthRule = "自然四度只有 F-B 是增四度，其他自然四度都是纯四度。";
const fifthRule = "自然五度只有 B-F 是减五度，其他自然五度都是纯五度。";
const sixthRule = "六度用三度转位反推：小三度变大六度，大三度变小六度。";
const seventhRule = "七度用二度转位反推：小二度变大七度，大二度变小七度。";

const definitions: NaturalIntervalDefinition[] = [
  interval("C", "D", 2, "大二度", secondRule, "C-D 是相邻自然音，不是 E-F 或 B-C，所以是大二度。"),
  interval("D", "E", 2, "大二度", secondRule, "D-E 是相邻自然音，不是 E-F 或 B-C，所以是大二度。"),
  interval("E", "F", 2, "小二度", secondRule, "E-F 是自然二度里的半音邻居，所以是小二度。"),
  interval("F", "G", 2, "大二度", secondRule, "F-G 是相邻自然音，不是 E-F 或 B-C，所以是大二度。"),
  interval("G", "A", 2, "大二度", secondRule, "G-A 是相邻自然音，不是 E-F 或 B-C，所以是大二度。"),
  interval("A", "B", 2, "大二度", secondRule, "A-B 是相邻自然音，不是 E-F 或 B-C，所以是大二度。"),
  interval("B", "C", 2, "小二度", secondRule, "B-C 是自然二度里的半音邻居，所以是小二度。"),

  interval("C", "E", 3, "大三度", thirdRule, "C-E 是自然三度里的大三度模板之一。"),
  interval("D", "F", 3, "小三度", thirdRule, "D-F 不在 C-E、F-A、G-B 这三个大三度模板里，所以是小三度。"),
  interval("E", "G", 3, "小三度", thirdRule, "E-G 不在 C-E、F-A、G-B 这三个大三度模板里，所以是小三度。"),
  interval("F", "A", 3, "大三度", thirdRule, "F-A 是自然三度里的大三度模板之一。"),
  interval("G", "B", 3, "大三度", thirdRule, "G-B 是自然三度里的大三度模板之一。"),
  interval("A", "C", 3, "小三度", thirdRule, "A-C 不在 C-E、F-A、G-B 这三个大三度模板里，所以是小三度。"),
  interval("B", "D", 3, "小三度", thirdRule, "B-D 不在 C-E、F-A、G-B 这三个大三度模板里，所以是小三度。"),

  interval("C", "F", 4, "纯四度", fourthRule, "C-F 不是自然四度里的 F-B，所以是纯四度。"),
  interval("D", "G", 4, "纯四度", fourthRule, "D-G 不是自然四度里的 F-B，所以是纯四度。"),
  interval("E", "A", 4, "纯四度", fourthRule, "E-A 不是自然四度里的 F-B，所以是纯四度。"),
  interval("F", "B", 4, "增四度", fourthRule, "F-B 是自然四度里唯一的增四度。"),
  interval("G", "C", 4, "纯四度", fourthRule, "G-C 不是自然四度里的 F-B，所以是纯四度。"),
  interval("A", "D", 4, "纯四度", fourthRule, "A-D 不是自然四度里的 F-B，所以是纯四度。"),
  interval("B", "E", 4, "纯四度", fourthRule, "B-E 不是自然四度里的 F-B，所以是纯四度。"),

  interval("C", "G", 5, "纯五度", fifthRule, "C-G 不是自然五度里的 B-F，所以是纯五度。"),
  interval("D", "A", 5, "纯五度", fifthRule, "D-A 不是自然五度里的 B-F，所以是纯五度。"),
  interval("E", "B", 5, "纯五度", fifthRule, "E-B 不是自然五度里的 B-F，所以是纯五度。"),
  interval("F", "C", 5, "纯五度", fifthRule, "F-C 不是自然五度里的 B-F，所以是纯五度。"),
  interval("G", "D", 5, "纯五度", fifthRule, "G-D 不是自然五度里的 B-F，所以是纯五度。"),
  interval("A", "E", 5, "纯五度", fifthRule, "A-E 不是自然五度里的 B-F，所以是纯五度。"),
  interval("B", "F", 5, "减五度", fifthRule, "B-F 是自然五度里唯一的减五度。"),

  interval("C", "A", 6, "大六度", sixthRule, "A-C 是小三度，转位后 C-A 是大六度。"),
  interval("D", "B", 6, "大六度", sixthRule, "B-D 是小三度，转位后 D-B 是大六度。"),
  interval("E", "C", 6, "小六度", sixthRule, "C-E 是大三度，转位后 E-C 是小六度。"),
  interval("F", "D", 6, "大六度", sixthRule, "D-F 是小三度，转位后 F-D 是大六度。"),
  interval("G", "E", 6, "大六度", sixthRule, "E-G 是小三度，转位后 G-E 是大六度。"),
  interval("A", "F", 6, "小六度", sixthRule, "F-A 是大三度，转位后 A-F 是小六度。"),
  interval("B", "G", 6, "小六度", sixthRule, "G-B 是大三度，转位后 B-G 是小六度。"),

  interval("C", "B", 7, "大七度", seventhRule, "B-C 是小二度，转位后 C-B 是大七度。"),
  interval("D", "C", 7, "小七度", seventhRule, "C-D 是大二度，转位后 D-C 是小七度。"),
  interval("E", "D", 7, "小七度", seventhRule, "D-E 是大二度，转位后 E-D 是小七度。"),
  interval("F", "E", 7, "大七度", seventhRule, "E-F 是小二度，转位后 F-E 是大七度。"),
  interval("G", "F", 7, "小七度", seventhRule, "F-G 是大二度，转位后 G-F 是小七度。"),
  interval("A", "G", 7, "小七度", seventhRule, "G-A 是大二度，转位后 A-G 是小七度。"),
  interval("B", "A", 7, "小七度", seventhRule, "A-B 是大二度，转位后 B-A 是小七度。"),
];

const definitionsById = Object.fromEntries(definitions.map((definition) => [definition.id, definition])) as Record<string, NaturalIntervalDefinition>;

const poolsByLevel: Record<NaturalIntervalLevelId, string[]> = {
  level1: ["C-E", "D-F", "E-G", "F-A", "G-B", "A-C", "B-D"],
  level2: ["C-F", "D-G", "E-A", "F-B", "G-C", "A-D", "B-E", "C-G", "D-A", "E-B", "F-C", "G-D", "A-E", "B-F"],
  level3: ["C-A", "D-B", "E-C", "F-D", "G-E", "A-F", "B-G"],
  level4: ["C-B", "D-C", "E-D", "F-E", "G-F", "A-G", "B-A"],
  level5: definitions.map((definition) => definition.id),
};

const optionsByDegree: Record<NaturalIntervalDefinition["degreeNumber"], NaturalIntervalAnswer[]> = {
  2: ["小二度", "大二度", "小三度", "大三度"],
  3: ["小三度", "大三度", "大二度", "纯四度"],
  4: ["纯四度", "增四度", "纯五度", "减五度"],
  5: ["纯五度", "减五度", "纯四度", "增四度"],
  6: ["小六度", "大六度", "小三度", "大三度"],
  7: ["小七度", "大七度", "小二度", "大二度"],
};

export function createEmptyNaturalIntervalLevelStats(): NaturalIntervalLevelStats {
  return {
    totalAnswers: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalResponseSeconds: 0,
    timedAnswers: 0,
    history: [],
    mistakes: {},
  };
}

export function createEmptyNaturalIntervalStats(): NaturalIntervalStatsByLevel {
  return Object.fromEntries(NATURAL_INTERVAL_LEVELS.map((level) => [level.id, createEmptyNaturalIntervalLevelStats()])) as NaturalIntervalStatsByLevel;
}

export function getNaturalIntervalDefinition(id: string): NaturalIntervalDefinition {
  const definition = definitionsById[id];

  if (!definition) {
    throw new Error(`Unknown natural interval: ${id}`);
  }

  return definition;
}

export function getNaturalIntervalQuestionPool(levelId: NaturalIntervalLevelId): NaturalIntervalDefinition[] {
  return poolsByLevel[levelId].map(getNaturalIntervalDefinition);
}

export function createNaturalIntervalQuestion(
  levelId: NaturalIntervalLevelId,
  options: { previousId?: string; mistakeIds?: string[]; reviewRate?: number } = {},
): NaturalIntervalQuestion {
  const pool = getNaturalIntervalQuestionPool(levelId);
  const reviewCandidates = (options.mistakeIds ?? []).map((id) => definitionsById[id]).filter((definition): definition is NaturalIntervalDefinition => Boolean(definition));
  const useReview = reviewCandidates.length > 0 && Math.random() < (options.reviewRate ?? 0.4);
  const candidates = useReview ? reviewCandidates : pool;
  const withoutPrevious = candidates.filter((definition) => definition.id !== options.previousId);
  const picked = pickRandom(withoutPrevious.length > 0 ? withoutPrevious : candidates);

  return {
    ...picked,
    levelId,
    options: buildNaturalIntervalOptions(picked),
  };
}

export function buildNaturalIntervalOptions(definition: NaturalIntervalDefinition): NaturalIntervalAnswer[] {
  const base = optionsByDegree[definition.degreeNumber];
  const options = uniqueAnswers([definition.answer, ...base]);

  for (const answer of NATURAL_INTERVAL_ANSWERS) {
    if (options.length >= 4) break;
    if (answer !== definition.answer) {
      options.push(answer);
    }
  }

  return shuffle(options.slice(0, 4));
}

export function evaluateNaturalIntervalAnswer(question: NaturalIntervalQuestion, selectedAnswer: NaturalIntervalAnswer) {
  return {
    correct: selectedAnswer === question.answer,
    selectedAnswer,
    correctAnswer: question.answer,
    feedback: buildNaturalIntervalFeedback(question, selectedAnswer, false),
  };
}

export function buildNaturalIntervalFeedback(question: NaturalIntervalQuestion, selectedAnswer: NaturalIntervalAnswer, review: boolean): string[] {
  const prefix = selectedAnswer === question.answer ? `正确，${question.id} 是${question.answer}。` : `不是${selectedAnswer}。${question.id} 是${question.answer}。`;
  const lines = [
    prefix,
    `第一步：${question.id} 的字母距离是${question.degreeName}。`,
    `第二步：${question.rule}`,
    `第三步：所以 ${question.id} 是${question.answer}。`,
  ];

  if (review) {
    lines.push(`错题回炉：${question.detailedRule} 这次先记模式，不要每题都绕回 C 坐标慢算。`);
  } else {
    lines.push(question.detailedRule);
  }

  return lines;
}

export function ageNaturalIntervalMistakes(mistakes: Record<string, NaturalIntervalMistake>): Record<string, NaturalIntervalMistake> {
  return Object.fromEntries(
    Object.entries(mistakes).map(([id, mistake]) => [
      id,
      {
        ...mistake,
        cooldown: Math.max(0, mistake.cooldown - 1),
      },
    ]),
  );
}

export function getReadyNaturalIntervalMistakeIds(mistakes: Record<string, NaturalIntervalMistake>): string[] {
  return Object.entries(mistakes)
    .filter(([, mistake]) => mistake.remainingCorrects > 0 && mistake.cooldown <= 0)
    .map(([id]) => id);
}

export function updateNaturalIntervalMistakes(
  mistakes: Record<string, NaturalIntervalMistake>,
  questionId: string,
  correct: boolean,
): Record<string, NaturalIntervalMistake> {
  const nextMistakes = { ...mistakes };
  const current = nextMistakes[questionId];

  if (!correct) {
    nextMistakes[questionId] = {
      remainingCorrects: 2,
      cooldown: 2,
    };
    return nextMistakes;
  }

  if (current) {
    const remainingCorrects = current.remainingCorrects - 1;

    if (remainingCorrects <= 0) {
      delete nextMistakes[questionId];
    } else {
      nextMistakes[questionId] = {
        remainingCorrects,
        cooldown: 2,
      };
    }
  }

  return nextMistakes;
}

export function getNaturalIntervalRecent20(stats: NaturalIntervalLevelStats) {
  const recent = stats.history.slice(0, 20);
  const correctCount = recent.filter((item) => item.correct).length;
  const timed = recent.filter((item) => typeof item.responseSeconds === "number");
  const averageSeconds = timed.length === 0 ? undefined : timed.reduce((sum, item) => sum + (item.responseSeconds ?? 0), 0) / timed.length;

  return {
    answered: recent.length,
    correctCount,
    accuracy: recent.length === 0 ? 0 : (correctCount / recent.length) * 100,
    averageSeconds,
    timedAnswers: timed.length,
    mistakes: recent.length - correctCount,
  };
}

export function getNaturalIntervalPassState(levelId: NaturalIntervalLevelId, stats: NaturalIntervalLevelStats) {
  const recent20 = getNaturalIntervalRecent20(stats);
  const averageForPass = recent20.averageSeconds ?? Number.POSITIVE_INFINITY;
  const basePassed = recent20.answered >= 20 && recent20.accuracy >= 90 && averageForPass <= 2.5 && stats.currentStreak >= 8;
  const goldPassed = levelId === "level5" && recent20.answered >= 20 && recent20.accuracy >= 95 && averageForPass <= 2 && recent20.mistakes <= 1;

  return {
    basePassed,
    goldPassed,
    recent20,
  };
}

export function getNaturalIntervalMemorySections() {
  return [
    { title: "二度", lines: ["E-F、B-C = 小二度", "其他相邻自然音 = 大二度"] },
    { title: "三度", lines: ["C-E、F-A、G-B = 大三度", "D-F、E-G、A-C、B-D = 小三度"] },
    { title: "四度", lines: ["F-B = 增四度", "其他自然四度 = 纯四度"] },
    { title: "五度", lines: ["B-F = 减五度", "其他自然五度 = 纯五度"] },
    { title: "六度", lines: ["小三度转位 = 大六度", "大三度转位 = 小六度", "C-A、D-B、F-D、G-E = 大六度"] },
    { title: "七度", lines: ["小二度转位 = 大七度", "大二度转位 = 小七度", "C-B、F-E = 大七度"] },
  ];
}

function interval(
  root: NaturalNote,
  target: NaturalNote,
  degreeNumber: NaturalIntervalDefinition["degreeNumber"],
  answer: NaturalIntervalAnswer,
  rule: string,
  detailedRule: string,
): NaturalIntervalDefinition {
  return {
    id: `${root}-${target}`,
    root,
    target,
    degreeNumber,
    degreeName: getDegreeName(degreeNumber),
    answer,
    rule,
    detailedRule,
  };
}

function getDegreeName(degreeNumber: NaturalIntervalDefinition["degreeNumber"]): string {
  const names = {
    2: "二度",
    3: "三度",
    4: "四度",
    5: "五度",
    6: "六度",
    7: "七度",
  };
  return names[degreeNumber];
}

function uniqueAnswers(answers: NaturalIntervalAnswer[]): NaturalIntervalAnswer[] {
  return Array.from(new Set(answers));
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
