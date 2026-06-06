import { BookOpen, ChevronRight, Lock, Music2 } from "lucide-react";
import { CHORD_CHAPTER } from "../utils/musicTheory";

interface HomePageProps {
  onOpenChapter: () => void;
}

export function HomePage({ onOpenChapter }: HomePageProps) {
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
          <button
            type="button"
            className="panel group flex min-h-56 flex-col p-5 text-left transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-md"
            onClick={onOpenChapter}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-leaf text-white">
                <BookOpen size={20} aria-hidden="true" />
              </span>
              <ChevronRight className="text-stone-400 transition group-hover:translate-x-1 group-hover:text-leaf" size={22} aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-semibold text-leaf">{CHORD_CHAPTER.subtitle}</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{CHORD_CHAPTER.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{CHORD_CHAPTER.description}</p>
            <span className="mt-auto pt-5 text-sm font-bold text-leaf">进入考核</span>
          </button>

          <LockedChapter title="顺阶和弦挑战" description="之后用于练 C 大调、自然小调、和声小调里的顺阶和弦。" />
          <LockedChapter title="指板音名挑战" description="之后用于把音名、品位、弦组和根音形状连起来。" />
        </section>
      </div>
    </main>
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
