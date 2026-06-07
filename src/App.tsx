import { useEffect, useState } from "react";
import { DifficultySelect } from "./components/DifficultySelect";
import { HomePage } from "./components/HomePage";
import { IntervalDifficultySelect } from "./components/IntervalDifficultySelect";
import { IntervalQuizPage } from "./components/IntervalQuizPage";
import { QuizPage } from "./components/QuizPage";
import { TheoryDifficultySelect } from "./components/TheoryDifficultySelect";
import { TheoryQuizPage } from "./components/TheoryQuizPage";
import { createEmptyStats, makeStatsKey, QuizHistoryItem, QuizStats, StatsByScope, StatsKey } from "./types/quiz";
import { TheoryDifficultyId, TheoryEvaluationResult, TheoryQuestion, getTheoryChapter, getTheoryDifficulty } from "./utils/courseTheory";
import { IntervalDifficultyId, IntervalEvaluationResult, IntervalQuestion, getIntervalDifficulty } from "./utils/intervalTheory";
import { DifficultyId, EvaluationResult, Question, getDifficulty } from "./utils/musicTheory";

const STORAGE_KEY = "guitar-theory-challenge-stats-v3";

type ViewState =
  | { name: "home" }
  | { name: "interval-difficulty" }
  | { name: "interval-quiz"; difficultyId: IntervalDifficultyId }
  | { name: "chord-difficulty" }
  | { name: "chord-quiz"; difficultyId: DifficultyId }
  | { name: "theory-difficulty"; chapterId: string }
  | { name: "theory-quiz"; chapterId: string; difficultyId: TheoryDifficultyId };

export default function App() {
  const [view, setView] = useState<ViewState>({ name: "home" });
  const [statsByScope, setStatsByScope] = useState<StatsByScope>(() => loadStats());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statsByScope));
  }, [statsByScope]);

  function getStats(key: StatsKey): QuizStats {
    return statsByScope[key] ?? createEmptyStats();
  }

  function updateStats(key: StatsKey, historyItem: QuizHistoryItem, mistakeKey: string, isCorrect: boolean, responseSeconds: number) {
    setStatsByScope((current) => {
      const currentStats = current[key] ?? createEmptyStats();
      const nextStreak = isCorrect ? currentStats.currentStreak + 1 : 0;
      const nextMistakes = { ...currentStats.mistakesByType };
      const previousTotalSeconds = currentStats.totalResponseSeconds ?? 0;
      const previousTimedAnswers = currentStats.timedAnswers ?? 0;
      const previousBestSeconds = currentStats.bestResponseSeconds;

      if (!isCorrect) {
        nextMistakes[mistakeKey] = (nextMistakes[mistakeKey] ?? 0) + 1;
      }

      return {
        ...current,
        [key]: {
          totalAnswers: currentStats.totalAnswers + 1,
          correctAnswers: currentStats.correctAnswers + (isCorrect ? 1 : 0),
          currentStreak: nextStreak,
          bestStreak: Math.max(currentStats.bestStreak, nextStreak),
          totalResponseSeconds: previousTotalSeconds + responseSeconds,
          timedAnswers: previousTimedAnswers + 1,
          bestResponseSeconds: previousBestSeconds === undefined ? responseSeconds : Math.min(previousBestSeconds, responseSeconds),
          mistakesByType: nextMistakes,
          history: [historyItem, ...currentStats.history].slice(0, 10),
        },
      };
    });
  }

  function handleChordSubmitResult(difficultyId: DifficultyId, question: Question, result: EvaluationResult, responseSeconds: number) {
    const key = makeStatsKey("chord", difficultyId);
    updateStats(
      key,
      {
        id: `${Date.now()}-${question.label}`,
        chapterId: "chord",
        difficultyId,
        questionLabel: question.label,
        typeLabel: question.type,
        correct: result.isFullyCorrect,
        expectedFinal: result.expectedFinal.join(" "),
        time: formatTime(),
        responseSeconds,
      },
      question.type,
      result.isFullyCorrect,
      responseSeconds,
    );
  }

  function handleIntervalSubmitResult(difficultyId: IntervalDifficultyId, question: IntervalQuestion, result: IntervalEvaluationResult, responseSeconds: number) {
    const key = makeStatsKey("interval", difficultyId);
    updateStats(
      key,
      {
        id: `${Date.now()}-${question.label}`,
        chapterId: "interval",
        difficultyId,
        questionLabel: question.label,
        typeLabel: question.mode === "spell" ? "反向拼写" : result.expectedIntervalName,
        correct: result.isFullyCorrect,
        expectedFinal: question.mode === "spell" ? result.expectedTarget : `${result.expectedIntervalName} · ${result.expectedSemitones} 半音 · ${result.expectedFeel}`,
        time: formatTime(),
        responseSeconds,
      },
      question.mode === "spell" ? "反向拼写" : result.expectedIntervalName,
      result.isFullyCorrect,
      responseSeconds,
    );
  }

  function handleTheorySubmitResult(difficultyId: TheoryDifficultyId, question: TheoryQuestion, result: TheoryEvaluationResult, responseSeconds: number) {
    const key = makeStatsKey(question.chapterId, difficultyId);
    updateStats(
      key,
      {
        id: `${Date.now()}-${question.id}`,
        chapterId: question.chapterId,
        difficultyId,
        questionLabel: question.label,
        typeLabel: result.typeLabel,
        correct: result.isFullyCorrect,
        expectedFinal: result.expectedFinal,
        time: formatTime(),
        responseSeconds,
      },
      result.typeLabel,
      result.isFullyCorrect,
      responseSeconds,
    );
  }

  function handleResetStats(key: StatsKey) {
    setStatsByScope((current) => ({
      ...current,
      [key]: createEmptyStats(),
    }));
  }

  if (view.name === "interval-difficulty") {
    return <IntervalDifficultySelect onBackHome={() => setView({ name: "home" })} onSelect={(difficultyId) => setView({ name: "interval-quiz", difficultyId })} />;
  }

  if (view.name === "interval-quiz") {
    const difficulty = getIntervalDifficulty(view.difficultyId);
    const key = makeStatsKey("interval", view.difficultyId);

    return (
      <IntervalQuizPage
        difficulty={difficulty}
        stats={getStats(key)}
        onSubmitResult={(question, result, responseSeconds) => handleIntervalSubmitResult(view.difficultyId, question, result, responseSeconds)}
        onResetStats={() => handleResetStats(key)}
        onBackHome={() => setView({ name: "home" })}
        onBackDifficulty={() => setView({ name: "interval-difficulty" })}
      />
    );
  }

  if (view.name === "chord-difficulty") {
    return <DifficultySelect onBackHome={() => setView({ name: "home" })} onSelect={(difficultyId) => setView({ name: "chord-quiz", difficultyId })} />;
  }

  if (view.name === "chord-quiz") {
    const difficulty = getDifficulty(view.difficultyId);
    const key = makeStatsKey("chord", view.difficultyId);

    return (
      <QuizPage
        difficulty={difficulty}
        stats={getStats(key)}
        onSubmitResult={(question, result, responseSeconds) => handleChordSubmitResult(view.difficultyId, question, result, responseSeconds)}
        onResetStats={() => handleResetStats(key)}
        onBackHome={() => setView({ name: "home" })}
        onBackDifficulty={() => setView({ name: "chord-difficulty" })}
      />
    );
  }

  if (view.name === "theory-difficulty") {
    const chapter = getTheoryChapter(view.chapterId);
    return (
      <TheoryDifficultySelect
        chapter={chapter}
        onBackHome={() => setView({ name: "home" })}
        onSelect={(difficultyId) => setView({ name: "theory-quiz", chapterId: chapter.id, difficultyId })}
      />
    );
  }

  if (view.name === "theory-quiz") {
    const chapter = getTheoryChapter(view.chapterId);
    const difficulty = getTheoryDifficulty(chapter.id, view.difficultyId);
    const key = makeStatsKey(chapter.id, view.difficultyId);

    return (
      <TheoryQuizPage
        chapter={chapter}
        difficulty={difficulty}
        stats={getStats(key)}
        onSubmitResult={(question, result, responseSeconds) => handleTheorySubmitResult(view.difficultyId, question, result, responseSeconds)}
        onResetStats={() => handleResetStats(key)}
        onBackHome={() => setView({ name: "home" })}
        onBackDifficulty={() => setView({ name: "theory-difficulty", chapterId: chapter.id })}
      />
    );
  }

  return (
    <HomePage
      onOpenIntervalChapter={() => setView({ name: "interval-difficulty" })}
      onOpenChordChapter={() => setView({ name: "chord-difficulty" })}
      onOpenTheoryChapter={(chapterId) => setView({ name: "theory-difficulty", chapterId })}
    />
  );
}

function loadStats(): StatsByScope {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return normalizeLoadedStats(JSON.parse(raw));
  } catch {
    return {};
  }
}

function normalizeLoadedStats(rawStats: StatsByScope): StatsByScope {
  return Object.fromEntries(
    Object.entries(rawStats).map(([key, stats]) => {
      if (!stats) {
        return [key, createEmptyStats()];
      }

      const history = stats.history ?? [];
      const timedHistory = history.map((item) => item.responseSeconds).filter((seconds): seconds is number => typeof seconds === "number");
      const inferredTimedAnswers = stats.timedAnswers ?? timedHistory.length;
      const inferredTotalSeconds = stats.totalResponseSeconds ?? timedHistory.reduce((sum, seconds) => sum + seconds, 0);
      const inferredBestSeconds = stats.bestResponseSeconds ?? (timedHistory.length > 0 ? Math.min(...timedHistory) : undefined);

      return [
        key,
        {
          ...createEmptyStats(),
          ...stats,
          mistakesByType: stats.mistakesByType ?? {},
          history,
          totalResponseSeconds: inferredTotalSeconds,
          timedAnswers: inferredTimedAnswers,
          bestResponseSeconds: inferredBestSeconds,
        },
      ];
    }),
  );
}

function formatTime(): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}
