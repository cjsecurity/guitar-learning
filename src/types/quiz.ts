import { ChordType, DifficultyId } from "../utils/musicTheory";

export interface QuizHistoryItem {
  id: string;
  questionLabel: string;
  chordType: ChordType;
  difficultyId: DifficultyId;
  correct: boolean;
  expectedFinal: string;
  time: string;
}

export interface QuizStats {
  totalAnswers: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  mistakesByType: Partial<Record<ChordType, number>>;
  history: QuizHistoryItem[];
}

export type StatsByDifficulty = Record<DifficultyId, QuizStats>;

export const EMPTY_STATS: QuizStats = {
  totalAnswers: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  mistakesByType: {},
  history: [],
};

export const EMPTY_STATS_BY_DIFFICULTY: StatsByDifficulty = {
  easy: { ...EMPTY_STATS },
  medium: { ...EMPTY_STATS },
  hard: { ...EMPTY_STATS },
  hell: { ...EMPTY_STATS },
};
