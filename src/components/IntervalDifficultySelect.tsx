import { ArrowLeft, Flame, Gauge, Sprout, Trophy } from "lucide-react";
import { INTERVAL_CHAPTER, INTERVAL_DIFFICULTIES, IntervalDifficultyConfig, IntervalDifficultyId } from "../utils/intervalTheory";
import { PassScopePanel } from "./PassScopePanel";

interface IntervalDifficultySelectProps {
  onBackHome: () => void;
  onSelect: (difficultyId: IntervalDifficultyId) => void;
}

const icons: Record<IntervalDifficultyId, typeof Sprout> = {
  easy: Sprout,
  medium: Gauge,
  hard: Flame,
  hell: Trophy,
};

export function IntervalDifficultySelect({ onBackHome, onSelect }: IntervalDifficultySelectProps) {
  return (
    <main className="min-h-screen bg-mist px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button type="button" className="btn-secondary mb-5" onClick={onBackHome}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回主页面
        </button>

        <header className="mb-5">
          <p className="text-sm font-semibold text-leaf">{INTERVAL_CHAPTER.title}</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-ink sm:text-4xl">选择难度</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            建议先把 C 根音练熟。音程练习的顺序是：度数看字母，性质看半音，最后分清完全协和、不完全协和与不协和。
          </p>
        </header>

        <PassScopePanel scopeId={INTERVAL_CHAPTER.id} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {INTERVAL_DIFFICULTIES.map((difficulty) => (
            <DifficultyCard key={difficulty.id} difficulty={difficulty} onSelect={onSelect} />
          ))}
        </section>
      </div>
    </main>
  );
}

function DifficultyCard({ difficulty, onSelect }: { difficulty: IntervalDifficultyConfig; onSelect: (difficultyId: IntervalDifficultyId) => void }) {
  const Icon = icons[difficulty.id];

  return (
    <button
      type="button"
      data-testid={`difficulty-card-interval-${difficulty.id}`}
      className="panel flex min-h-64 flex-col p-5 text-left transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-md"
      onClick={() => onSelect(difficulty.id)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-leaf text-white">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-leaf">{difficulty.badge}</span>
      </div>
      <h2 className="mt-6 text-3xl font-black text-ink">{difficulty.title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">{difficulty.description}</p>
      <div className="mt-auto pt-5 text-sm text-stone-700">
        <p>
          题型：<span className="font-bold">{difficulty.mode === "spell" ? "反向拼写" : "判断音程"}</span>
        </p>
        <p className="mt-2">
          根音：<span className="font-bold">{difficulty.roots.join(" ")}</span>
        </p>
      </div>
    </button>
  );
}
