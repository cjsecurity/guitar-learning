import { BarChart3, Flame, Target, Trophy } from "lucide-react";
import { QuizStats } from "../App";

interface StatsPanelProps {
  stats: QuizStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const accuracy = stats.totalAnswers === 0 ? 0 : Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
  const weakestType = getWeakestType(stats.mistakesByType);

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
        <Metric label="易错类型" value={weakestType} />
      </div>
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-stone-200 bg-mist px-3 py-3">
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
