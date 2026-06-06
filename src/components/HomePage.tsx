import { BookOpen, ChevronRight, Lock, Music2, Ruler } from "lucide-react";
import { INTERVAL_CHAPTER } from "../utils/intervalTheory";
import { CHORD_CHAPTER } from "../utils/musicTheory";

interface HomePageProps {
  onOpenIntervalChapter: () => void;
  onOpenChordChapter: () => void;
}

export function HomePage({ onOpenIntervalChapter, onOpenChordChapter }: HomePageProps) {
  return (
    <main className="min-h-screen bg-mist px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="py-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-leaf text-white">
              <Music2 size={24} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-leaf">Guitar Theory Challenge</p>
              <h1 className="text-3xl font-black tracking-normal text-ink sm:text-4xl">吉他乐理挑战</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            把课堂里的和弦构成、音名拼写和指板判断拆成小关卡。先建立清楚的字母骨架，再把声音落到吉他上。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <ChapterCard
            title={INTERVAL_CHAPTER.title}
            subtitle={INTERVAL_CHAPTER.subtitle}
            description={INTERVAL_CHAPTER.description}
            icon={Ruler}
            onClick={onOpenIntervalChapter}
          />

          <ChapterCard
            title={CHORD_CHAPTER.title}
            subtitle={CHORD_CHAPTER.subtitle}
            description={CHORD_CHAPTER.description}
            icon={BookOpen}
            onClick={onOpenChordChapter}
          />

          <LockedChapter title="顺阶和弦挑战" description="之后用于练 C 大调、自然小调、和声小调里的顺阶和弦。" />
        </section>
      </div>
    </main>
  );
}

function ChapterCard({
  title,
  subtitle,
  description,
  icon: Icon,
  onClick,
}: {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof BookOpen;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="panel group flex min-h-56 flex-col p-5 text-left transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-leaf text-white">
          <Icon size={20} aria-hidden="true" />
        </span>
        <ChevronRight className="text-stone-400 transition group-hover:translate-x-1 group-hover:text-leaf" size={22} aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm font-semibold text-leaf">{subtitle}</p>
      <h2 className="mt-2 text-2xl font-black text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
      <span className="mt-auto pt-5 text-sm font-bold text-leaf">进入考核</span>
    </button>
  );
}

function LockedChapter({ title, description }: { title: string; description: string }) {
  return (
    <article className="panel flex min-h-56 flex-col p-5 opacity-75">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-stone-200 text-stone-500">
          <Lock size={20} aria-hidden="true" />
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">未开放</span>
      </div>
      <h2 className="mt-7 text-2xl font-black text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
    </article>
  );
}
