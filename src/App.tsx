import { useEffect, useState } from "react";
import { DifficultySelect } from "./components/DifficultySelect";
import { HomePage } from "./components/HomePage";
import { QuizPage } from "./components/QuizPage";
import { EMPTY_STATS, EMPTY_STATS_BY_DIFFICULTY, QuizHistoryItem, StatsByDifficulty } from "./types/quiz";
import { DifficultyId, EvaluationResult, Question, getDifficulty } from "./utils/musicTheory";

const STORAGE_KEY = "guitar-chord-quiz-stats-v2";

type ViewState =
  | { name: "home" }
  | { name: "difficulty" }
  | { name: "quiz"; difficultyId: DifficultyId };

export default function App() {
  const [view, setView] = useState<ViewState>({ name: "home" });
  const [statsByDifficulty, setStatsByDifficulty] = useState<StatsByDifficulty>(() => loadStats());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statsByDifficulty));
  }, [statsByDifficulty]);

  function handleSubmitResult(difficultyId: DifficultyId, question: Question, result: EvaluationResult) {
    const historyItem: QuizHistoryItem = {
      id: `${Date.now()}-${question.label}`,
      questionLabel: question.label,
      chordType: question.type,
      difficultyId,
      correct: result.isFullyCorrect,
      expectedFinal: result.expectedFinal.join(" "),
      time: new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()),
    };

    setStatsByDifficulty((current) => {
      const currentStats = current[difficultyId];
      const nextStreak = result.isFullyCorrect ? currentStats.currentStreak + 1 : 0;
      const nextMistakes = { ...currentStats.mistakesByType };

      if (!result.isFullyCorrect) {
        nextMistakes[question.type] = (nextMistakes[question.type] ?? 0) + 1;
      }

      return {
        ...current,
        [difficultyId]: {
          totalAnswers: currentStats.totalAnswers + 1,
          correctAnswers: currentStats.correctAnswers + (result.isFullyCorrect ? 1 : 0),
          currentStreak: nextStreak,
          bestStreak: Math.max(currentStats.bestStreak, nextStreak),
          mistakesByType: nextMistakes,
          history: [historyItem, ...currentStats.history].slice(0, 10),
        },
      };
    });
  }

  function handleResetStats(difficultyId: DifficultyId) {
    setStatsByDifficulty((current) => ({
      ...current,
      [difficultyId]: { ...EMPTY_STATS, mistakesByType: {}, history: [] },
    }));
  }

  if (view.name === "difficulty") {
    return <DifficultySelect onBackHome={() => setView({ name: "home" })} onSelect={(difficultyId) => setView({ name: "quiz", difficultyId })} />;
  }

  if (view.name === "quiz") {
    const difficulty = getDifficulty(view.difficultyId);

    return (
      <QuizPage
        difficulty={difficulty}
        stats={statsByDifficulty[view.difficultyId]}
        onSubmitResult={(question, result) => handleSubmitResult(view.difficultyId, question, result)}
        onResetStats={() => handleResetStats(view.difficultyId)}
        onBackHome={() => setView({ name: "home" })}
        onBackDifficulty={() => setView({ name: "difficulty" })}
      />
    );
  }

  return <HomePage onOpenChapter={() => setView({ name: "difficulty" })} />;
}

function loadStats(): StatsByDifficulty {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneEmptyStats();

    return {
      ...cloneEmptyStats(),
      ...JSON.parse(raw),
    };
  } catch {
    return cloneEmptyStats();
  }
}

function cloneEmptyStats(): StatsByDifficulty {
  return {
    easy: { ...EMPTY_STATS_BY_DIFFICULTY.easy, mistakesByType: {}, history: [] },
    medium: { ...EMPTY_STATS_BY_DIFFICULTY.medium, mistakesByType: {}, history: [] },
    hard: { ...EMPTY_STATS_BY_DIFFICULTY.hard, mistakesByType: {}, history: [] },
    hell: { ...EMPTY_STATS_BY_DIFFICULTY.hell, mistakesByType: {}, history: [] },
  };
}
