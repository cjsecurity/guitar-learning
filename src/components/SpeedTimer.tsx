import { Clock3, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function useQuestionTimer(questionKey: string) {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [submittedSeconds, setSubmittedSeconds] = useState<number | null>(null);

  useEffect(() => {
    const nextStart = Date.now();
    setStartedAt(nextStart);
    setNow(nextStart);
    setSubmittedSeconds(null);
  }, [questionKey]);

  useEffect(() => {
    if (submittedSeconds !== null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [submittedSeconds]);

  const elapsedSeconds = useMemo(() => {
    if (submittedSeconds !== null) {
      return submittedSeconds;
    }

    return Math.max(0, Math.floor((now - startedAt) / 1000));
  }, [now, startedAt, submittedSeconds]);

  function stop(): number {
    if (submittedSeconds !== null) {
      return submittedSeconds;
    }

    const seconds = Math.max(1, Math.ceil((Date.now() - startedAt) / 1000));
    setSubmittedSeconds(seconds);
    return seconds;
  }

  function reset() {
    const nextStart = Date.now();
    setStartedAt(nextStart);
    setNow(nextStart);
    setSubmittedSeconds(null);
  }

  return {
    elapsedSeconds,
    isStopped: submittedSeconds !== null,
    reset,
    stop,
  };
}

export function SpeedTimer({ seconds, isStopped }: { seconds: number; isStopped: boolean }) {
  return (
    <div className={`rounded-md border px-3 py-2 text-sm font-bold shadow-sm ${isStopped ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-stone-200 bg-white text-stone-700"}`}>
      <div className="flex items-center gap-2">
        {isFast(seconds) ? <Zap size={16} aria-hidden="true" /> : <Clock3 size={16} aria-hidden="true" />}
        <span>{isStopped ? "本题用时" : "本题计时"}</span>
        <span className="tabular-nums">{formatSeconds(seconds)}</span>
      </div>
    </div>
  );
}

export function formatSeconds(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function isFast(seconds: number): boolean {
  return seconds > 0 && seconds <= 15;
}
