import { Repeat2, Target } from "lucide-react";
import { QuizStats } from "../types/quiz";
import { getReviewQuestionLabels } from "../utils/reviewQueue";

interface ReviewPracticePanelProps {
  stats: QuizStats;
  active: boolean;
  onToggle: (active: boolean) => void;
  onPracticeNow: () => void;
}

export function ReviewPracticePanel({ stats, active, onToggle, onPracticeNow }: ReviewPracticePanelProps) {
  const reviewLabels = getReviewQuestionLabels(stats, 10);
  const mistakeTypes = Object.entries(stats.mistakesByType)
    .filter(([, count]) => count > 0)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  if (stats.totalAnswers === 0) {
    return null;
  }

  return (
    <section data-testid="review-practice-panel" className="panel p-5">
      <div className="flex items-center gap-2">
        <Repeat2 className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-lg font-bold text-ink">错题复习中心</h2>
      </div>

      {reviewLabels.length === 0 ? (
        <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold leading-6 text-emerald-800">
          当前难度没有待回炉错题。继续保持，新的错题会自动进入这里。
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            这里按当前课程和当前难度整理错题。打开“只练错题”后，下一题会优先从下面这些未纠正题目里抽。
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              data-testid="review-only-toggle"
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-black transition ${
                active ? "border-leaf bg-leaf text-white" : "border-stone-300 bg-white text-stone-700 hover:border-leaf hover:text-leaf"
              }`}
              onClick={() => onToggle(!active)}
            >
              <Target size={16} aria-hidden="true" />
              {active ? "只练错题中" : "只练错题"}
            </button>
            <button type="button" data-testid="review-practice-now-button" className="btn-secondary" onClick={onPracticeNow}>
              <Repeat2 size={16} aria-hidden="true" />
              马上抽一题错题
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-black text-stone-500">待回炉题目</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {reviewLabels.map((label) => (
                <span key={label} data-testid="review-practice-item" className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {mistakeTypes.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-black text-stone-500">易错类型</p>
          <div className="mt-2 space-y-2">
            {mistakeTypes.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between gap-3 rounded-md bg-mist px-3 py-2 text-sm">
                <span className="font-bold text-stone-700">{type}</span>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-stone-600">{count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
