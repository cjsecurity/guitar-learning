import { Music2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HistoryPanel } from "./components/HistoryPanel";
import { QuizCard } from "./components/QuizCard";
import { StatsPanel } from "./components/StatsPanel";
import { ChordType, EvaluationResult, Question, createRandomQuestion } from "./utils/musicTheory";

const STORAGE_KEY = "guitar-chord-quiz-stats-v1";

export interface QuizHistoryItem {
  id: string;
  questionLabel: string;
  chordType: ChordType;
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

const EMPTY_STATS: QuizStats = {
  totalAnswers: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  mistakesByType: {},
  history: [],
};

export default function App() {
  const [question, setQuestion] = useState<Question>(() => createRandomQuestion());
  const [stats, setStats] = useState<QuizStats>(() => loadStats());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const headerStats = useMemo(() => {
    if (stats.totalAnswers === 0) return "从第一题开始建立手感";
    const accuracy = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    return `${stats.totalAnswers} 题 · 正确率 ${accuracy}% · 当前连对 ${stats.currentStreak}`;
  }, [stats]);

  function handleSubmit(result: EvaluationResult) {
    const historyItem: QuizHistoryItem = {
      id: `${Date.now()}-${question.label}`,
      questionLabel: question.label,
      chordType: question.type,
      correct: result.isFullyCorrect,
      expectedFinal: result.expectedFinal.join(" "),
      time: new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()),
    };

    setStats((current) => {
      const nextStreak = result.isFullyCorrect ? current.currentStreak + 1 : 0;
      const nextMistakes = { ...current.mistakesByType };

      if (!result.isFullyCorrect) {
        nextMistakes[question.type] = (nextMistakes[question.type] ?? 0) + 1;
      }

      return {
        totalAnswers: current.totalAnswers + 1,
        correctAnswers: current.correctAnswers + (result.isFullyCorrect ? 1 : 0),
        currentStreak: nextStreak,
        bestStreak: Math.max(current.bestStreak, nextStreak),
        mistakesByType: nextMistakes,
        history: [historyItem, ...current.history].slice(0, 10),
      };
    });
  }

  function handleResetStats() {
    setStats(EMPTY_STATS);
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-leaf text-white">
                <Music2 size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-leaf">吉他和弦构成考核</p>
                <h1 className="text-2xl font-black tracking-normal text-ink sm:text-3xl">七和弦与九和弦训练</h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              先抓住 1、3、5、7、9 的字母骨架，再把 maj7、7、m7、m7b5、m9、9、maj9 的公式套进去。
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <p className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm">{headerStats}</p>
            <button type="button" className="btn-secondary" onClick={handleResetStats}>
              <RotateCcw size={16} aria-hidden="true" />
              重置统计
            </button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <QuizCard
            question={question}
            onSubmit={handleSubmit}
            onNext={() => setQuestion((current) => createRandomQuestion(current))}
          />

          <aside className="space-y-5">
            <StatsPanel stats={stats} />
            <HistoryPanel history={stats.history} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function loadStats(): QuizStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATS;

    return {
      ...EMPTY_STATS,
      ...JSON.parse(raw),
    };
  } catch {
    return EMPTY_STATS;
  }
}
