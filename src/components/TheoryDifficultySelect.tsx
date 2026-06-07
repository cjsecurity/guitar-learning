import { ArrowLeft, Flame, Gauge, Sprout, Trophy } from "lucide-react";
import { TheoryChapter, TheoryDifficultyId } from "../utils/courseTheory";

interface TheoryDifficultySelectProps {
  chapter: TheoryChapter;
  onBackHome: () => void;
  onSelect: (difficultyId: TheoryDifficultyId) => void;
}

const icons: Record<TheoryDifficultyId, typeof Sprout> = {
  easy: Sprout,
  medium: Gauge,
  hard: Flame,
  hell: Trophy,
};

export function TheoryDifficultySelect({ chapter, onBackHome, onSelect }: TheoryDifficultySelectProps) {
  return (
    <main className="min-h-screen bg-mist px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button type="button" className="btn-secondary mb-5" onClick={onBackHome}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回主页面
        </button>

        <header className="mb-5">
          <p className="text-sm font-semibold text-leaf">{chapter.title}</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-ink sm:text-4xl">选择难度</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            {chapter.description} 对应课程：{chapter.lessonRefs}。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {chapter.difficulties.map((difficulty) => {
            const Icon = icons[difficulty.id];
            return (
              <button
                key={difficulty.id}
                type="button"
                data-testid={`difficulty-card-${chapter.id}-${difficulty.id}`}
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
                <p className="mt-auto pt-5 text-sm font-bold text-leaf">{difficulty.questions.length} 个题型样本</p>
              </button>
            );
          })}
        </section>
      </div>
    </main>
  );
}
