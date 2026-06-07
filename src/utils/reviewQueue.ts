import { QuizStats } from "../types/quiz";

export const REVIEW_DRAW_RATE = 0.65;
export const SHOWN_QUESTION_MEMORY_LIMIT = 5;

export interface LabeledQuestion {
  id?: string;
  label: string;
}

export interface QuestionPickOptions<T extends LabeledQuestion> {
  previous?: T;
  reviewLabels?: string[];
  recentLabels?: string[];
  reviewRate?: number;
}

export function normalizeQuestionPickOptions<T extends LabeledQuestion>(
  previousOrOptions?: T | QuestionPickOptions<T>,
): QuestionPickOptions<T> {
  if (!previousOrOptions) {
    return {};
  }

  if ("previous" in previousOrOptions || "reviewLabels" in previousOrOptions || "recentLabels" in previousOrOptions || "reviewRate" in previousOrOptions) {
    return previousOrOptions as QuestionPickOptions<T>;
  }

  return { previous: previousOrOptions as T };
}

export function pickQuestionCandidate<T extends LabeledQuestion>(
  questions: T[],
  options: QuestionPickOptions<T> = {},
): T {
  const previousPool = withoutPrevious(questions, options.previous);
  const basePool = previousPool.length > 0 ? previousPool : questions;
  const freshPool = withoutRecent(basePool, options.recentLabels);
  const pool = freshPool.length > 0 ? freshPool : basePool;
  const reviewLabels = new Set(options.reviewLabels ?? []);
  const reviewPool = pool.filter((question) => reviewLabels.has(question.label));
  const reviewRate = options.reviewRate ?? REVIEW_DRAW_RATE;

  if (reviewPool.length > 0 && Math.random() < reviewRate) {
    return randomItem(reviewPool);
  }

  return randomItem(pool.length > 0 ? pool : questions);
}

export function getReviewQuestionLabels(stats: QuizStats, limit = 5): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const item of stats.history) {
    if (seen.has(item.questionLabel)) {
      continue;
    }

    seen.add(item.questionLabel);

    if (!item.correct) {
      labels.push(item.questionLabel);
    }

    if (labels.length >= limit) {
      break;
    }
  }

  return labels;
}

export function getRecentQuestionLabels(stats: QuizStats, limit = 3): string[] {
  const labels: string[] = [];

  for (const item of stats.history) {
    if (!labels.includes(item.questionLabel)) {
      labels.push(item.questionLabel);
    }

    if (labels.length >= limit) {
      break;
    }
  }

  return labels;
}

export function mergeRecentQuestionLabels(labelGroups: Array<string[] | undefined>, limit = SHOWN_QUESTION_MEMORY_LIMIT): string[] {
  const labels: string[] = [];

  for (const group of labelGroups) {
    for (const label of group ?? []) {
      if (!labels.includes(label)) {
        labels.push(label);
      }

      if (labels.length >= limit) {
        return labels;
      }
    }
  }

  return labels;
}

function withoutPrevious<T extends LabeledQuestion>(questions: T[], previous?: T): T[] {
  if (!previous || questions.length <= 1) {
    return questions;
  }

  const previousKey = getQuestionKey(previous);
  return questions.filter((question) => getQuestionKey(question) !== previousKey);
}

function withoutRecent<T extends LabeledQuestion>(questions: T[], recentLabels?: string[]): T[] {
  if (!recentLabels || recentLabels.length === 0 || questions.length <= 1) {
    return questions;
  }

  const recent = new Set(recentLabels);
  return questions.filter((question) => !recent.has(question.label));
}

function getQuestionKey(question: LabeledQuestion): string {
  return question.id ?? question.label;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
