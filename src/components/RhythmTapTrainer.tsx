import { Hand, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { playRhythmPattern } from "../utils/audioEngine";
import { TheoryQuestion } from "../utils/courseTheory";

interface RhythmTapTrainerProps {
  question: TheoryQuestion;
}

interface TapRecord {
  id: number;
  offsetMs: number;
  nearestStep: number;
  distanceMs: number;
  hit: boolean;
}

const RHYTHM_BPM = 84;
const STEP_MS = (60 / RHYTHM_BPM / 4) * 1000;
const TOLERANCE_MS = STEP_MS * 0.5;
const COUNT_IN_MS = 420;
const AUDIO_SCHEDULE_OFFSET_MS = 40;

export function RhythmTapTrainer({ question }: RhythmTapTrainerProps) {
  const targetSteps = useMemo(() => getAccentSteps(question.expectedAnswer), [question.expectedAnswer]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [taps, setTaps] = useState<TapRecord[]>([]);

  const isRunning = startedAt !== null;
  const summary = buildSummary(taps, targetSteps);

  function startTraining() {
    setTaps([]);
    const nextStartedAt = performance.now() + COUNT_IN_MS + AUDIO_SCHEDULE_OFFSET_MS;
    setStartedAt(nextStartedAt);
    window.setTimeout(() => {
      void playRhythmPattern(question.expectedAnswer, RHYTHM_BPM);
    }, COUNT_IN_MS);
    window.setTimeout(() => {
      setStartedAt(null);
    }, COUNT_IN_MS + AUDIO_SCHEDULE_OFFSET_MS + STEP_MS * 16 + 900);
  }

  function tap() {
    if (!startedAt) {
      return;
    }

    const offsetMs = performance.now() - startedAt;
    const nearestStep = Math.max(0, Math.min(15, Math.round(offsetMs / STEP_MS)));
    const nearestAccent = findNearestAccent(nearestStep, targetSteps);
    const expectedMs = nearestAccent * STEP_MS;
    const distanceMs = offsetMs - expectedMs;

    setTaps((current) => [
      ...current,
      {
        id: Date.now() + current.length,
        offsetMs,
        nearestStep,
        distanceMs,
        hit: Math.abs(distanceMs) <= TOLERANCE_MS,
      },
    ]);
  }

  function reset() {
    setStartedAt(null);
    setTaps([]);
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Hand className="text-leaf" size={20} aria-hidden="true" />
            <h2 className="text-base font-bold text-ink">跟拍检测</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            先播放目标，再跟着每个重音点拍下面的大按钮。误差控制在半个十六分格内就算命中。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={startTraining}>
            <Play size={16} aria-hidden="true" />
            播放并开始
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            重来
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`mt-4 flex h-24 w-full items-center justify-center rounded-lg border text-lg font-black transition ${
          isRunning ? "border-leaf bg-leaf text-white shadow-sm active:scale-[0.99]" : "border-stone-200 bg-mist text-stone-500"
        }`}
        onClick={tap}
        disabled={!isRunning}
      >
        {isRunning ? "跟着重音拍这里" : "先点“播放并开始”"}
      </button>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="目标重音" value={targetSteps.map((step) => step + 1).join(", ")} />
        <Metric label="命中" value={`${summary.hits}/${targetSteps.length}`} />
        <Metric label="结果" value={summary.label} tone={summary.passed ? "good" : "neutral"} />
      </div>

      {taps.length > 0 && (
        <div className="mt-4 rounded-md bg-mist px-3 py-3">
          <p className="text-xs font-bold text-stone-500">最近拍点</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {taps.slice(-8).map((tapRecord) => (
              <span
                key={tapRecord.id}
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  tapRecord.hit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                第 {tapRecord.nearestStep + 1} 格 {formatDistance(tapRecord.distanceMs)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" }) {
  return (
    <div className={`rounded-md px-3 py-3 ${tone === "good" ? "bg-emerald-50 text-emerald-800" : "bg-mist text-stone-700"}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 break-words text-base font-black">{value}</p>
    </div>
  );
}

function buildSummary(taps: TapRecord[], targetSteps: number[]) {
  const hitSteps = new Set<number>();

  for (const tapRecord of taps) {
    if (!tapRecord.hit) {
      continue;
    }

    hitSteps.add(findNearestAccent(tapRecord.nearestStep, targetSteps));
  }

  const hits = hitSteps.size;
  const tooManyTaps = taps.length > targetSteps.length;
  const passed = hits === targetSteps.length && !tooManyTaps;

  if (passed) {
    return { hits, label: "合格", passed };
  }

  if (taps.length === 0) {
    return { hits, label: "等待跟拍", passed };
  }

  if (tooManyTaps) {
    return { hits, label: "拍多了", passed };
  }

  return { hits, label: "继续补齐", passed };
}

function getAccentSteps(pattern: string): number[] {
  return pattern
    .replace(/\s+/g, "")
    .slice(0, 16)
    .split("")
    .map((step, index) => (step.toUpperCase() === "X" ? index : -1))
    .filter((step) => step >= 0);
}

function findNearestAccent(step: number, accentSteps: number[]): number {
  return accentSteps.reduce((nearest, candidate) => (Math.abs(candidate - step) < Math.abs(nearest - step) ? candidate : nearest), accentSteps[0] ?? 0);
}

function formatDistance(distanceMs: number): string {
  if (Math.abs(distanceMs) <= 12) {
    return "很准";
  }

  return distanceMs < 0 ? `早 ${Math.round(Math.abs(distanceMs))}ms` : `晚 ${Math.round(distanceMs)}ms`;
}
