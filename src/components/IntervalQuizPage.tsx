import { ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { QuizStats } from "../types/quiz";
import {
  INTERVAL_CHAPTER,
  IntervalDifficultyConfig,
  IntervalEvaluationResult,
  IntervalQuestion,
  createRandomIntervalQuestion,
} from "../utils/intervalTheory";
import { getKnowledgeCard } from "../utils/knowledgeCards";
import { getRecentQuestionLabels, getReviewQuestionLabels, mergeRecentQuestionLabels } from "../utils/reviewQueue";
import { HistoryPanel } from "./HistoryPanel";
import { IntervalQuizCard } from "./IntervalQuizCard";
import { KnowledgeCard } from "./KnowledgeCard";
import { ReviewPracticePanel } from "./ReviewPracticePanel";
import { ReviewQueueNotice } from "./ReviewQueueNotice";
import { StatsPanel } from "./StatsPanel";

interface IntervalQuizPageProps {
  difficulty: IntervalDifficultyConfig;
  stats: QuizStats;
  onSubmitResult: (question: IntervalQuestion, result: IntervalEvaluationResult, responseSeconds: number) => void;
  onResetStats: () => void;
  onBackHome: () => void;
  onBackDifficulty: () => void;
}

export function IntervalQuizPage({ difficulty, stats, onSubmitResult, onResetStats, onBackHome, onBackDifficulty }: IntervalQuizPageProps) {
  const [question, setQuestion] = useState<IntervalQuestion>(() => createRandomIntervalQuestion(difficulty, { reviewLabels: getReviewQuestionLabels(stats), recentLabels: getRecentQuestionLabels(stats) }));
  const [shownLabels, setShownLabels] = useState<string[]>(() => [question.label]);
  const [reviewOnly, setReviewOnly] = useState(false);
  const reviewLabels = useMemo(() => getReviewQuestionLabels(stats), [stats]);
  const recentLabels = useMemo(() => getRecentQuestionLabels(stats), [stats]);
  const effectiveRecentLabels = useMemo(() => mergeRecentQuestionLabels([shownLabels, recentLabels]), [shownLabels, recentLabels]);

  const headerStats = useMemo(() => {
    if (stats.totalAnswers === 0) return "从第一题开始建立耳朵和尺子";
    const accuracy = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    return `${stats.totalAnswers} 题 · 正确率 ${accuracy}% · 当前连对 ${stats.currentStreak}`;
  }, [stats]);

  function handleNextQuestion(forceReview = false) {
    const shouldReviewOnly = (forceReview || reviewOnly) && reviewLabels.length > 0;
    const nextQuestion = createRandomIntervalQuestion(difficulty, {
      previous: question,
      reviewLabels,
      recentLabels: shouldReviewOnly ? undefined : effectiveRecentLabels,
      reviewRate: shouldReviewOnly ? 1 : undefined,
    });
    setQuestion(nextQuestion);
    setShownLabels((labels) => mergeRecentQuestionLabels([[nextQuestion.label], labels]));
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap gap-3">
          <button type="button" data-testid="back-difficulty-button" className="btn-secondary" onClick={onBackDifficulty}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回难度选择
          </button>
          <button type="button" data-testid="back-home-button" className="btn-secondary" onClick={onBackHome}>
            <Home size={18} aria-hidden="true" />
            返回主页面
          </button>
        </div>

        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-leaf">{INTERVAL_CHAPTER.title} · {difficulty.title}</p>
            <h1 className="text-2xl font-black tracking-normal text-ink sm:text-3xl">{difficulty.badge}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{difficulty.description}</p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <p className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm">{headerStats}</p>
            <button type="button" data-testid="reset-stats-button" className="btn-secondary" onClick={onResetStats}>
              <RotateCcw size={16} aria-hidden="true" />
              重置本难度统计
            </button>
          </div>
        </header>

        <KnowledgeCard card={getKnowledgeCard("interval")} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <IntervalQuizCard
            question={question}
            onSubmit={(result, responseSeconds) => onSubmitResult(question, result, responseSeconds)}
            onNext={handleNextQuestion}
          />

          <aside className="space-y-5">
            <ReviewPracticePanel stats={stats} active={reviewOnly} onToggle={setReviewOnly} onPracticeNow={() => handleNextQuestion(true)} />
            <ReviewQueueNotice stats={stats} />
            <StatsPanel stats={stats} />
            <HistoryPanel history={stats.history} />
          </aside>
        </div>
      </div>
    </main>
  );
}
