import { BookOpen, ChevronRight, CircleDot, Clock3, Compass, GitBranch, Hash, KeyRound, MapPinned, Music2, Network, Piano, Repeat2, Ruler, Tags } from "lucide-react";
import { THEORY_CHAPTERS } from "../utils/courseTheory";
import { INTERVAL_CHAPTER } from "../utils/intervalTheory";
import { CHORD_CHAPTER } from "../utils/musicTheory";

interface HomePageProps {
  onOpenIntervalChapter: () => void;
  onOpenChordChapter: () => void;
  onOpenTheoryChapter: (chapterId: string) => void;
}

const theoryIcons: Record<string, typeof BookOpen> = {
  "fretboard-root": MapPinned,
  "diatonic-chords": Piano,
  "chord-symbols": Tags,
  "extensions-omissions": CircleDot,
  "progression-transpose": Repeat2,
  "key-signatures": KeyRound,
  "relative-pentatonic": GitBranch,
  "minor-function": Compass,
  "borrowed-chords": Network,
  "rhythm-grid": Clock3,
};

export function HomePage({ onOpenIntervalChapter, onOpenChordChapter, onOpenTheoryChapter }: HomePageProps) {
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
            把 7 节课里的音程、和弦、调号、级数、大小调、指板根音和节奏结构拆成小关卡。每个分支只练一个能力，答错时给出课堂化解释。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ChapterCard
            testId="chapter-card-interval"
            title={INTERVAL_CHAPTER.title}
            subtitle={INTERVAL_CHAPTER.subtitle}
            description={INTERVAL_CHAPTER.description}
            icon={Ruler}
            onClick={onOpenIntervalChapter}
          />

          <ChapterCard
            testId="chapter-card-chord"
            title={CHORD_CHAPTER.title}
            subtitle={CHORD_CHAPTER.subtitle}
            description={CHORD_CHAPTER.description}
            icon={BookOpen}
            onClick={onOpenChordChapter}
          />

          {THEORY_CHAPTERS.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              testId={`chapter-card-${chapter.id}`}
              title={chapter.title}
              subtitle={chapter.subtitle}
              description={chapter.description}
              icon={theoryIcons[chapter.id] ?? Hash}
              onClick={() => onOpenTheoryChapter(chapter.id)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function ChapterCard({
  testId,
  title,
  subtitle,
  description,
  icon: Icon,
  onClick,
}: {
  testId: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof BookOpen;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
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
