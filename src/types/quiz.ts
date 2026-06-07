export type ChapterId = string;
export type StatsKey = `${ChapterId}:${string}`;

export interface QuizHistoryItem {
  id: string;
  chapterId: ChapterId;
  difficultyId: string;
  questionLabel: string;
  typeLabel: string;
  correct: boolean;
  expectedFinal: string;
  time: string;
  responseSeconds?: number;
}

export interface QuizStats {
  totalAnswers: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  totalResponseSeconds?: number;
  timedAnswers?: number;
  bestResponseSeconds?: number;
  mistakesByType: Record<string, number>;
  history: QuizHistoryItem[];
}

export type StatsByScope = Partial<Record<StatsKey, QuizStats>>;

export const EMPTY_STATS: QuizStats = {
  totalAnswers: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalResponseSeconds: 0,
  timedAnswers: 0,
  bestResponseSeconds: undefined,
  mistakesByType: {},
  history: [],
};

export function createEmptyStats(): QuizStats {
  return {
    ...EMPTY_STATS,
    mistakesByType: {},
    history: [],
  };
}

export function makeStatsKey(chapterId: ChapterId, difficultyId: string): StatsKey {
  return `${chapterId}:${difficultyId}`;
}
