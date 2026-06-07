import { ArrowLeft, CheckCircle2, Clock3, Eye, EyeOff, Home, Keyboard, RotateCcw, Sparkles, Target, Trophy, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  NATURAL_INTERVAL_LEVELS,
  NaturalIntervalAnswer,
  NaturalIntervalLevelId,
  NaturalIntervalLevelStats,
  NaturalIntervalMode,
  NaturalIntervalQuestion,
  NaturalIntervalStatsByLevel,
  ageNaturalIntervalMistakes,
  buildNaturalIntervalFeedback,
  createEmptyNaturalIntervalStats,
  createNaturalIntervalQuestion,
  evaluateNaturalIntervalAnswer,
  getNaturalIntervalMemorySections,
  getNaturalIntervalPassState,
  getNaturalIntervalRecent20,
  getReadyNaturalIntervalMistakeIds,
  updateNaturalIntervalMistakes,
} from "../utils/naturalIntervalRecognition";

const STORAGE_KEY = "guitar-natural-interval-recognition-stats-v1";

interface NaturalIntervalTrainerProps {
  onBackHome: () => void;
  onBackDifficulty: () => void;
}

interface AnswerState {
  selectedAnswer: NaturalIntervalAnswer;
  correct: boolean;
  feedback: string[];
  review: boolean;
  responseSeconds?: number;
}

export function NaturalIntervalTrainer({ onBackHome, onBackDifficulty }: NaturalIntervalTrainerProps) {
  const [levelId, setLevelId] = useState<NaturalIntervalLevelId>("level1");
  const [mode, setMode] = useState<NaturalIntervalMode>("practice");
  const [showMemory, setShowMemory] = useState(true);
  const [statsByLevel, setStatsByLevel] = useState<NaturalIntervalStatsByLevel>(() => loadStats());
  const [question, setQuestion] = useState<NaturalIntervalQuestion>(() => createNaturalIntervalQuestion("level1"));
  const [answerState, setAnswerState] = useState<AnswerState | null>(null);
  const [startedAt, setStartedAt] = useState(() => performance.now());

  const level = NATURAL_INTERVAL_LEVELS.find((item) => item.id === levelId) ?? NATURAL_INTERVAL_LEVELS[0];
  const stats = statsByLevel[levelId];
  const readyMistakeIds = useMemo(() => getReadyNaturalIntervalMistakeIds(stats.mistakes), [stats.mistakes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statsByLevel));
  }, [statsByLevel]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (answerState) return;
      const number = Number(event.key);

      if (number >= 1 && number <= 4) {
        const selected = question.options[number - 1];
        if (selected) {
          handleAnswer(selected);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answerState, question, startedAt, mode, levelId, stats]);

  function handleLevelChange(nextLevelId: NaturalIntervalLevelId) {
    const nextStats = statsByLevel[nextLevelId] ?? createEmptyNaturalIntervalStats()[nextLevelId];
    const nextQuestion = createNaturalIntervalQuestion(nextLevelId, {
      mistakeIds: getReadyNaturalIntervalMistakeIds(nextStats.mistakes),
    });
    setLevelId(nextLevelId);
    setQuestion(nextQuestion);
    setAnswerState(null);
    setStartedAt(performance.now());
  }

  function handleAnswer(selectedAnswer: NaturalIntervalAnswer) {
    if (answerState) return;

    const responseSeconds = mode === "timed" ? (performance.now() - startedAt) / 1000 : undefined;
    const review = Boolean(stats.mistakes[question.id]);
    const result = evaluateNaturalIntervalAnswer(question, selectedAnswer);
    const feedback = buildNaturalIntervalFeedback(question, selectedAnswer, review);

    setAnswerState({
      selectedAnswer,
      correct: result.correct,
      feedback,
      review,
      responseSeconds,
    });

    setStatsByLevel((current) => {
      const currentStats = current[levelId] ?? createEmptyNaturalIntervalStats()[levelId];
      const nextStreak = result.correct ? currentStats.currentStreak + 1 : 0;
      const nextMistakes = updateNaturalIntervalMistakes(currentStats.mistakes, question.id, result.correct);

      return {
        ...current,
        [levelId]: {
          totalAnswers: currentStats.totalAnswers + 1,
          correctAnswers: currentStats.correctAnswers + (result.correct ? 1 : 0),
          currentStreak: nextStreak,
          bestStreak: Math.max(currentStats.bestStreak, nextStreak),
          totalResponseSeconds: currentStats.totalResponseSeconds + (responseSeconds ?? 0),
          timedAnswers: currentStats.timedAnswers + (responseSeconds === undefined ? 0 : 1),
          mistakes: nextMistakes,
          history: [
            {
              id: `${Date.now()}-${question.id}`,
              levelId,
              questionLabel: question.id,
              selectedAnswer,
              correctAnswer: question.answer,
              correct: result.correct,
              responseSeconds,
              time: formatTime(),
              review,
            },
            ...currentStats.history,
          ].slice(0, 60),
        },
      };
    });
  }

  function handleNextQuestion() {
    const agedMistakes = ageNaturalIntervalMistakes(statsByLevel[levelId].mistakes);
    const mistakeIds = getReadyNaturalIntervalMistakeIds(agedMistakes);
    const nextQuestion = createNaturalIntervalQuestion(levelId, {
      previousId: question.id,
      mistakeIds,
      reviewRate: 0.5,
    });

    setStatsByLevel((current) => ({
      ...current,
      [levelId]: {
        ...current[levelId],
        mistakes: agedMistakes,
      },
    }));
    setQuestion(nextQuestion);
    setAnswerState(null);
    setStartedAt(performance.now());
  }

  function handleResetLevel() {
    const emptyStats = createEmptyNaturalIntervalStats()[levelId];
    setStatsByLevel((current) => ({
      ...current,
      [levelId]: emptyStats,
    }));
    setQuestion(createNaturalIntervalQuestion(levelId));
    setAnswerState(null);
    setStartedAt(performance.now());
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={onBackDifficulty}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回第一课
          </button>
          <button type="button" className="btn-secondary" onClick={onBackHome}>
            <Home size={18} aria-hidden="true" />
            返回主页面
          </button>
        </div>

        <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-leaf">音程距离速算 · 子训练</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-ink sm:text-4xl">自然音速认选择题</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              看到 A-C、D-B、B-F 这类自然音组合，先认字母距离，再套本类别的特殊规则。目标是从临时计算进化到模式识别。
            </p>
          </div>

          <button type="button" data-testid="natural-interval-reset-button" className="btn-secondary" onClick={handleResetLevel}>
            <RotateCcw size={16} aria-hidden="true" />
            重置本 Level
          </button>
        </header>

        <KnowledgeIntro showMemory={showMemory} onToggleMemory={() => setShowMemory((value) => !value)} />

        <section className="mt-5 grid gap-3 lg:grid-cols-5">
          {NATURAL_INTERVAL_LEVELS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-testid={`natural-interval-level-${item.id}`}
              className={`rounded-lg border px-4 py-4 text-left transition ${
                item.id === levelId ? "border-leaf bg-white shadow-sm ring-2 ring-leaf/15" : "border-stone-200 bg-white/75 hover:border-leaf"
              }`}
              onClick={() => handleLevelChange(item.id)}
            >
              <p className="text-xs font-black text-leaf">{item.title}</p>
              <h2 className="mt-1 text-base font-black text-ink">{item.subtitle}</h2>
              <p className="mt-2 text-xs leading-5 text-stone-600">{item.description}</p>
            </button>
          ))}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <section className="panel p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-leaf">{level.title} · {level.subtitle}</p>
                <h2 data-testid="natural-interval-question" className="mt-2 text-4xl font-black tracking-normal text-ink sm:text-5xl">
                  {question.id} 是什么音程？
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">只看自然音上行音程，不出现升降号。先判断几度，再找这一类里的特殊款。</p>
              </div>

              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            {readyMistakeIds.length > 0 && (
              <div data-testid="natural-interval-review-notice" className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                当前有 {readyMistakeIds.length} 道错题待回炉，后续会随机重新出现。
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const selected = answerState?.selectedAnswer === option;
                const isCorrectOption = answerState && option === question.answer;
                const isWrongSelected = selected && !answerState.correct;

                return (
                  <button
                    key={option}
                    type="button"
                    data-testid={`natural-interval-option-${index + 1}`}
                    className={`min-h-20 rounded-lg border px-4 py-4 text-left text-lg font-black transition ${
                      isCorrectOption
                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                        : isWrongSelected
                          ? "border-rose-300 bg-rose-50 text-rose-900"
                          : "border-stone-200 bg-white text-ink hover:border-leaf hover:bg-mist"
                    } ${answerState ? "cursor-default" : ""}`}
                    disabled={Boolean(answerState)}
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="mr-2 rounded bg-stone-100 px-2 py-1 text-sm text-stone-600">{index + 1}</span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-stone-600">
                <Keyboard size={16} aria-hidden="true" />
                可按键盘 1 / 2 / 3 / 4 快速选择
              </p>
              <button type="button" data-testid="natural-interval-next-button" className="btn-primary" onClick={handleNextQuestion} disabled={!answerState}>
                下一题
              </button>
            </div>

            {answerState && <FeedbackPanel question={question} answerState={answerState} />}
          </section>

          <aside className="space-y-5">
            <NaturalIntervalStatsPanel levelId={levelId} stats={stats} />
            <NaturalIntervalHistoryPanel stats={stats} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function KnowledgeIntro({ showMemory, onToggleMemory }: { showMemory: boolean; onToggleMemory: () => void }) {
  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-brass" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">自然音速认：先练模式，不要每题都重算</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
            看到两个自然音时，先判断它们是几度，再看这个类别里有没有特殊款。A-C 是三度，不在 C-E / F-A / G-B 这三个大三度模板里，所以是小三度。
            D-B 是六度，反过来 B-D 是小三度，所以 D-B 是大六度。B-F 是自然五度里唯一的减五度。
          </p>
        </div>
        <button type="button" data-testid="natural-interval-memory-toggle" className="btn-secondary shrink-0" onClick={onToggleMemory}>
          {showMemory ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          {showMemory ? "隐藏记忆表" : "显示记忆表"}
        </button>
      </div>

      {showMemory && (
        <div data-testid="natural-interval-memory-table" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {getNaturalIntervalMemorySections().map((section) => (
            <div key={section.title} className="rounded-md border border-stone-200 bg-mist px-3 py-3">
              <h3 className="text-sm font-black text-ink">{section.title}</h3>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-stone-700">
                {section.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ModeToggle({ mode, onModeChange }: { mode: NaturalIntervalMode; onModeChange: (mode: NaturalIntervalMode) => void }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-mist p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-black ${mode === "practice" ? "bg-white text-leaf shadow-sm" : "text-stone-600"}`}
          onClick={() => onModeChange("practice")}
        >
          慢速练习
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-black ${mode === "timed" ? "bg-white text-leaf shadow-sm" : "text-stone-600"}`}
          onClick={() => onModeChange("timed")}
        >
          计时挑战
        </button>
      </div>
      <p className="mt-2 px-2 pb-1 text-xs leading-5 text-stone-600">
        {mode === "timed" ? "目标：平均反应压到 2 秒左右。" : "不抢时间，先把解释看懂。"}
      </p>
    </div>
  );
}

function FeedbackPanel({ question, answerState }: { question: NaturalIntervalQuestion; answerState: AnswerState }) {
  return (
    <section
      data-testid="natural-interval-feedback"
      className={`mt-5 rounded-lg border px-4 py-4 ${
        answerState.correct ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-rose-200 bg-rose-50 text-rose-950"
      }`}
    >
      <div className="flex items-start gap-2">
        {answerState.correct ? <CheckCircle2 className="mt-0.5 shrink-0" size={20} aria-hidden="true" /> : <XCircle className="mt-0.5 shrink-0" size={20} aria-hidden="true" />}
        <div>
          <h3 className="font-black">{answerState.correct ? "答对了" : "再校准一下"}</h3>
          <div className="mt-2 space-y-1 text-sm leading-6">
            {answerState.feedback.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {answerState.responseSeconds !== undefined && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-sm font-black">
              <Clock3 size={16} aria-hidden="true" />
              本题用时 {formatSeconds(answerState.responseSeconds)}
            </p>
          )}
          <p className="mt-3 text-xs leading-5 opacity-80">本题固定结论：{question.id} = {question.answer}</p>
        </div>
      </div>
    </section>
  );
}

function NaturalIntervalStatsPanel({ levelId, stats }: { levelId: NaturalIntervalLevelId; stats: NaturalIntervalLevelStats }) {
  const accuracy = stats.totalAnswers === 0 ? 0 : Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
  const averageSeconds = stats.timedAnswers === 0 ? undefined : stats.totalResponseSeconds / stats.timedAnswers;
  const passState = getNaturalIntervalPassState(levelId, stats);
  const recent20 = passState.recent20;
  const recentAccuracy = Math.round(recent20.accuracy);
  const recentSpeedDone = recent20.averageSeconds !== undefined && recent20.averageSeconds < 2;

  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2">
        <Target className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-lg font-bold text-ink">速认统计</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="当前 Level" value={levelId.replace("level", "Level ")} />
        <Metric label="总答题数" value={stats.totalAnswers} />
        <Metric label="正确数" value={stats.correctAnswers} />
        <Metric label="正确率" value={`${accuracy}%`} />
        <Metric label="平均反应" value={averageSeconds === undefined ? "暂无" : formatSeconds(averageSeconds)} />
        <Metric label="连续正确" value={stats.currentStreak} />
      </div>

      <div className="mt-4 rounded-lg border border-stone-200 bg-mist px-3 py-3">
        <h3 className="text-sm font-black text-ink">最近 20 题目标</h3>
        <div className="mt-3 space-y-2">
          <PassLine done={recent20.answered >= 20} label="样本数量" detail={`${recent20.answered}/20 题`} />
          <PassLine done={recent20.answered >= 20 && recent20.accuracy >= 90} label="正确率 ≥ 90%" detail={`${recentAccuracy}%`} />
          <PassLine
            done={recent20.averageSeconds !== undefined && recent20.averageSeconds <= 2.5}
            label="平均反应 ≤ 2.5 秒"
            detail={recent20.averageSeconds === undefined ? "暂无计时记录" : formatSeconds(recent20.averageSeconds)}
          />
          <PassLine done={stats.currentStreak >= 8} label="连续正确 ≥ 8" detail={`${stats.currentStreak}/8`} />
          <PassLine done={recent20.answered >= 20 && recent20.accuracy >= 90} label="最近 20 题正确率达标" detail={recent20.answered < 20 ? "继续积累样本" : `${recentAccuracy}%`} />
          <PassLine done={recentSpeedDone} label="最近 20 题平均 < 2 秒" detail={recent20.averageSeconds === undefined ? "切到计时挑战练速度" : formatSeconds(recent20.averageSeconds)} />
        </div>
      </div>

      <div
        className={`mt-4 rounded-lg border px-3 py-3 ${
          passState.goldPassed ? "border-amber-200 bg-amber-50" : passState.basePassed ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-white"
        }`}
      >
        <div className="flex items-start gap-2">
          <Trophy className={`mt-0.5 shrink-0 ${passState.goldPassed ? "text-brass" : passState.basePassed ? "text-emerald-700" : "text-stone-500"}`} size={18} aria-hidden="true" />
          <div>
            <h3 className="text-sm font-black text-ink">{passState.goldPassed ? "混合挑战 Gold" : passState.basePassed ? "Level 已通关" : "通关规则"}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-700">
              {passState.basePassed
                ? "你已经开始从计算进入速认，可以进入下一组。"
                : "最近 20 题正确率 ≥ 90%，平均反应 ≤ 2.5 秒，并且连续正确 ≥ 8。"}
            </p>
            {levelId === "level5" && (
              <p className="mt-2 text-xs leading-5 text-stone-700">Gold 标准：20 题正确率 ≥ 95%，平均 ≤ 2 秒，错题 ≤ 1。</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NaturalIntervalHistoryPanel({ stats }: { stats: NaturalIntervalLevelStats }) {
  return (
    <section className="panel p-5">
      <h2 className="text-lg font-bold text-ink">最近记录</h2>
      {stats.history.length === 0 ? (
        <p className="mt-3 text-sm text-stone-600">还没有答题记录。</p>
      ) : (
        <div className="mt-4 space-y-2">
          {stats.history.slice(0, 10).map((item) => (
            <div key={item.id} className="rounded-md border border-stone-200 bg-mist px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-ink">{item.questionLabel}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-black ${item.correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {item.correct ? "正确" : "错误"}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-stone-600">
                答：{item.selectedAnswer} · 标准：{item.correctAnswer}
                {item.responseSeconds !== undefined ? ` · ${formatSeconds(item.responseSeconds)}` : ""}
                {item.review ? " · 错题回炉" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-stone-200 bg-mist px-3 py-3">
      <p className="text-xs font-medium text-stone-600">{label}</p>
      <p className="mt-1 truncate text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function PassLine({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
      <div>
        <p className="text-xs font-black text-ink">{label}</p>
        <p className="mt-0.5 text-xs text-stone-600">{detail}</p>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-black ${done ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
        {done ? "达成" : "未达成"}
      </span>
    </div>
  );
}

function loadStats(): NaturalIntervalStatsByLevel {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyNaturalIntervalStats();
    const parsed = JSON.parse(raw) as Partial<NaturalIntervalStatsByLevel>;
    const empty = createEmptyNaturalIntervalStats();

    return Object.fromEntries(
      NATURAL_INTERVAL_LEVELS.map((level) => [
        level.id,
        {
          ...empty[level.id],
          ...(parsed[level.id] ?? {}),
          history: parsed[level.id]?.history ?? [],
          mistakes: parsed[level.id]?.mistakes ?? {},
        },
      ]),
    ) as NaturalIntervalStatsByLevel;
  } catch {
    return createEmptyNaturalIntervalStats();
  }
}

function formatTime(): string {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function formatSeconds(seconds: number): string {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  }

  return `${seconds.toFixed(1)}s`;
}
