import { Repeat2 } from "lucide-react";
import { QuizStats } from "../types/quiz";
import { REVIEW_DRAW_RATE, getReviewQuestionLabels } from "../utils/reviewQueue";

interface ReviewQueueNoticeProps {
  stats: QuizStats;
}

export function ReviewQueueNotice({ stats }: ReviewQueueNoticeProps) {
  const labels = getReviewQuestionLabels(stats);

  if (labels.length === 0) {
    return null;
  }

  return (
    <section data-testid="review-queue-notice" className="panel p-5">
      <div className="flex items-center gap-2">
        <Repeat2 className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-lg font-bold text-ink">错题回炉</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        下一题有 {Math.round(REVIEW_DRAW_RATE * 100)}% 概率优先抽最近未纠正的错题；答对后会自动从回炉队列里移出。
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span key={label} data-testid="review-queue-item" className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
