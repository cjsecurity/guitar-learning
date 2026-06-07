import { Clock3 } from "lucide-react";
import { QuizHistoryItem } from "../types/quiz";
import { formatSeconds } from "./SpeedTimer";

interface HistoryPanelProps {
  history: QuizHistoryItem[];
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2">
        <Clock3 className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-lg font-bold text-ink">最近 10 次</h2>
      </div>

      {history.length === 0 ? (
        <p className="mt-4 rounded-md bg-mist px-3 py-4 text-sm text-stone-600">还没有答题记录。</p>
      ) : (
        <div className="mt-4 space-y-2">
          {history.map((item) => (
            <article key={item.id} className="rounded-md border border-stone-200 bg-white px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-black text-ink">{item.questionLabel}</p>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-bold ${
                    item.correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {item.correct ? "正确" : "错误"}
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {item.time}
                {item.responseSeconds !== undefined && <> · 用时 {formatSeconds(item.responseSeconds)}</>}
              </p>
              <p className="mt-2 text-sm text-stone-700">答案：{item.expectedFinal}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
