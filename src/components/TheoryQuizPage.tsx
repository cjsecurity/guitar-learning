import { ArrowLeft, Home, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { QuizStats } from "../types/quiz";
import { TheoryChapter, TheoryDifficultyConfig, TheoryEvaluationResult, TheoryQuestion, createRandomTheoryQuestion } from "../utils/courseTheory";
import { getKnowledgeCard } from "../utils/knowledgeCards";
import { getReviewQuestionLabels } from "../utils/reviewQueue";
import { HistoryPanel } from "./HistoryPanel";
import { KnowledgeCard } from "./KnowledgeCard";
import { ReviewQueueNotice } from "./ReviewQueueNotice";
import { StatsPanel } from "./StatsPanel";
import { TheoryQuizCard } from "./TheoryQuizCard";

interface TheoryQuizPageProps {
  chapter: TheoryChapter;
  difficulty: TheoryDifficultyConfig;
  stats: QuizStats;
  onSubmitResult: (question: TheoryQuestion, result: TheoryEvaluationResult, responseSeconds: number) => void;
  onResetStats: () => void;
  onBackHome: () => void;
  onBackDifficulty: () => void;
}

export function TheoryQuizPage({ chapter, difficulty, stats, onSubmitResult, onResetStats, onBackHome, onBackDifficulty }: TheoryQuizPageProps) {
  const [question, setQuestion] = useState<TheoryQuestion>(() => createRandomTheoryQuestion(difficulty, { reviewLabels: getReviewQuestionLabels(stats) }));
  const reviewLabels = useMemo(() => getReviewQuestionLabels(stats), [stats]);

  const headerStats = useMemo(() => {
    if (stats.totalAnswers === 0) return "从第一题开始建立反应速度";
    const accuracy = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    return `${stats.totalAnswers} 题 · 正确率 ${accuracy}% · 当前连对 ${stats.currentStreak}`;
  }, [stats]);

  return (
    <main className="min-h-screen bg-mist px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={onBackDifficulty}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回难度选择
          </button>
          <button type="button" className="btn-secondary" onClick={onBackHome}>
            <Home size={18} aria-hidden="true" />
            返回主页面
          </button>
        </div>

        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-leaf">{chapter.title} · {difficulty.title}</p>
            <h1 className="text-2xl font-black tracking-normal text-ink sm:text-3xl">{difficulty.badge}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{difficulty.description}</p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <p className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm">{headerStats}</p>
            <button type="button" className="btn-secondary" onClick={onResetStats}>
              <RotateCcw size={16} aria-hidden="true" />
              重置本难度统计
            </button>
          </div>
        </header>

        <KnowledgeCard card={getKnowledgeCard(chapter.id)} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <TheoryQuizCard
            question={question}
            onSubmit={(result, responseSeconds) => onSubmitResult(question, result, responseSeconds)}
            onNext={() => setQuestion((current) => createRandomTheoryQuestion(difficulty, { previous: current, reviewLabels }))}
          />

          <aside className="space-y-5">
            <ReviewQueueNotice stats={stats} />
            <StatsPanel stats={stats} />
            <HistoryPanel history={stats.history} />
          </aside>
        </div>
      </div>
    </main>
  );
}
