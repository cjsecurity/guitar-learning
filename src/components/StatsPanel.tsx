import { Award, BarChart3, CheckCircle2, Flame, Gauge, LockKeyhole, Medal, Target, Trophy } from "lucide-react";
import { QuizStats } from "../types/quiz";
import { getReviewQuestionLabels } from "../utils/reviewQueue";
import { formatSeconds } from "./SpeedTimer";

interface StatsPanelProps {
  stats: QuizStats;
}

const PASS_REQUIRED_ANSWERS = 20;
const PASS_REQUIRED_ACCURACY = 90;
const PASS_REQUIRED_STREAK = 20;
const PASS_TARGET_AVERAGE_SECONDS = 20;
const SPEED_BADGE_TARGET_SECONDS = 20;
const SPEED_BADGE_MIN_TIMED_ANSWERS = 5;

export function StatsPanel({ stats }: StatsPanelProps) {
  const accuracy = stats.totalAnswers === 0 ? 0 : Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
  const weakestType = getWeakestType(stats.mistakesByType);
  const averageSeconds = stats.timedAnswers && stats.totalResponseSeconds !== undefined ? Math.round(stats.totalResponseSeconds / stats.timedAnswers) : undefined;
  const passItems = getPassItems(stats, accuracy, averageSeconds);
  const reviewLabels = getReviewQuestionLabels(stats);
  const achievements = getAchievements(stats, accuracy, averageSeconds, reviewLabels.length);
  const nextAchievement = achievements.find((achievement) => !achievement.done);
  const passed = passItems.every((item) => item.done);

  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2">
        <BarChart3 className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-lg font-bold text-ink">成绩统计</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="总答题数" value={stats.totalAnswers} />
        <Metric label="正确题数" value={stats.correctAnswers} />
        <Metric label="正确率" value={`${accuracy}%`} icon={<Target size={16} aria-hidden="true" />} />
        <Metric label="连续答对" value={stats.currentStreak} icon={<Flame size={16} aria-hidden="true" />} />
        <Metric label="最高连对" value={stats.bestStreak} icon={<Trophy size={16} aria-hidden="true" />} />
        <Metric label="平均用时" value={averageSeconds === undefined ? "暂无" : formatSeconds(averageSeconds)} icon={<Gauge size={16} aria-hidden="true" />} />
        <Metric label="最快速答" value={stats.bestResponseSeconds === undefined ? "暂无" : formatSeconds(stats.bestResponseSeconds)} icon={<Gauge size={16} aria-hidden="true" />} />
        <Metric label="易错类型" value={weakestType} />
      </div>

      <div data-testid="achievement-panel" className="mt-4 rounded-lg border border-stone-200 bg-white px-3 py-3">
        <div className="flex items-start gap-2">
          <Award className="mt-0.5 shrink-0 text-brass" size={18} aria-hidden="true" />
          <div>
            <h3 className="text-sm font-black text-ink">练习徽章</h3>
            <p className="mt-1 text-xs leading-5 text-stone-600">
              徽章不是最终证书，只是提醒你当前难度已经形成哪些小能力。
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement.label} done={achievement.done} label={achievement.label} detail={achievement.detail} />
          ))}
        </div>

        <p data-testid="next-achievement-hint" className="mt-3 rounded-md bg-mist px-3 py-2 text-xs font-semibold leading-5 text-stone-700">
          {nextAchievement ? `下一枚：${nextAchievement.label}，${nextAchievement.detail}` : "本难度基础徽章已拿满，可以切到错题复习或更高难度。"}
        </p>
      </div>

      <div className={`mt-4 rounded-lg border px-3 py-3 ${passed ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-white"}`}>
        <div className="flex items-start gap-2">
          {passed ? (
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={18} aria-hidden="true" />
          ) : (
            <LockKeyhole className="mt-0.5 shrink-0 text-stone-500" size={18} aria-hidden="true" />
          )}
          <div>
            <h3 className="text-sm font-black text-ink">{passed ? "阶段通关" : "阶段通关标准"}</h3>
            <p className="mt-1 text-xs leading-5 text-stone-600">
              通关只证明你能完成当前题型的纸面推导、规则识别和输入表达；指板实操、闭眼听辨和歌曲应用还需要单独训练。
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {passItems.map((item) => (
            <PassItem key={item.label} done={item.done} label={item.label} detail={item.detail} />
          ))}
        </div>
      </div>
    </section>
  );
}

function getAchievements(stats: QuizStats, accuracy: number, averageSeconds: number | undefined, reviewQueueCount: number) {
  return [
    {
      done: stats.totalAnswers >= 1,
      label: "开练",
      detail: stats.totalAnswers >= 1 ? "已经完成第一题" : "完成任意 1 题",
    },
    {
      done: stats.totalAnswers >= 10,
      label: "十题热身",
      detail: `${stats.totalAnswers}/10 题`,
    },
    {
      done: stats.bestStreak >= 5,
      label: "连对 5",
      detail: `${stats.bestStreak}/5 题最高连对`,
    },
    {
      done: stats.bestStreak >= 10,
      label: "连对 10",
      detail: `${stats.bestStreak}/10 题最高连对`,
    },
    {
      done: stats.totalAnswers >= PASS_REQUIRED_ANSWERS && accuracy >= PASS_REQUIRED_ACCURACY,
      label: "正确率稳定",
      detail: `${stats.totalAnswers}/${PASS_REQUIRED_ANSWERS} 题，正确率 ${accuracy}%/${PASS_REQUIRED_ACCURACY}%`,
    },
    {
      done: (stats.timedAnswers ?? 0) >= SPEED_BADGE_MIN_TIMED_ANSWERS && averageSeconds !== undefined && averageSeconds <= SPEED_BADGE_TARGET_SECONDS,
      label: "速算手感",
      detail:
        averageSeconds === undefined
          ? `至少 ${SPEED_BADGE_MIN_TIMED_ANSWERS} 题有计时，平均 ≤ ${SPEED_BADGE_TARGET_SECONDS} 秒`
          : `${stats.timedAnswers ?? 0}/${SPEED_BADGE_MIN_TIMED_ANSWERS} 题计时，平均 ${formatSeconds(averageSeconds)}/${formatSeconds(SPEED_BADGE_TARGET_SECONDS)}`,
    },
    {
      done: stats.totalAnswers >= 5 && reviewQueueCount === 0,
      label: "错题清零",
      detail: reviewQueueCount === 0 ? "当前没有待回炉错题" : `还有 ${reviewQueueCount} 题待回炉`,
    },
  ];
}

function AchievementBadge({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return (
    <div
      data-testid="achievement-badge"
      className={`rounded-md border px-3 py-2 ${done ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-stone-200 bg-mist text-stone-600"}`}
    >
      <div className="flex items-center gap-2">
        <Medal size={15} aria-hidden="true" />
        <p className="text-xs font-black">{label}</p>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-black ${done ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-600"}`}>
          {done ? "已获得" : "未获得"}
        </span>
      </div>
      <p className="mt-1 text-xs leading-5">{detail}</p>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  const testId = `stats-${label}`;

  return (
    <div data-testid={testId} className="rounded-md border border-stone-200 bg-mist px-3 py-3">
      <p className="flex items-center gap-1 text-xs font-medium text-stone-600">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function getWeakestType(mistakesByType: QuizStats["mistakesByType"]): string {
  const entries = Object.entries(mistakesByType).sort((left, right) => right[1] - left[1]);

  if (entries.length === 0 || entries[0][1] === 0) {
    return "暂无";
  }

  return entries[0][0];
}

function getPassItems(stats: QuizStats, accuracy: number, averageSeconds: number | undefined) {
  return [
    {
      done: stats.totalAnswers >= PASS_REQUIRED_ANSWERS && accuracy >= PASS_REQUIRED_ACCURACY,
      label: "样本稳定",
      detail: `${stats.totalAnswers}/${PASS_REQUIRED_ANSWERS} 题，正确率 ${accuracy}%/${PASS_REQUIRED_ACCURACY}%`,
    },
    {
      done: stats.currentStreak >= PASS_REQUIRED_STREAK,
      label: "连续稳定",
      detail: `${stats.currentStreak}/${PASS_REQUIRED_STREAK} 题连续答对`,
    },
    {
      done: averageSeconds !== undefined && averageSeconds <= PASS_TARGET_AVERAGE_SECONDS,
      label: "反应速度",
      detail: averageSeconds === undefined ? `暂无用时记录，目标 ≤ ${PASS_TARGET_AVERAGE_SECONDS} 秒` : `${formatSeconds(averageSeconds)} / ${formatSeconds(PASS_TARGET_AVERAGE_SECONDS)}`,
    },
  ];
}

function PassItem({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-mist px-3 py-2">
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
