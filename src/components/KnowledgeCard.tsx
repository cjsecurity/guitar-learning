import { BookOpenCheck, ChevronUp, Lightbulb } from "lucide-react";
import { useState } from "react";
import { KnowledgeCardContent } from "../utils/knowledgeCards";

interface KnowledgeCardProps {
  card: KnowledgeCardContent;
}

export function KnowledgeCard({ card }: KnowledgeCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="mb-5 overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
      <button
        type="button"
        data-testid="knowledge-card-toggle"
        className="flex w-full items-center justify-between gap-3 border-b border-stone-200 bg-white px-5 py-4 text-left sm:px-6"
        onClick={() => setIsOpen((value) => !value)}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-leaf text-white">
            <BookOpenCheck size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-leaf">30 秒知识卡</p>
            <h2 className="mt-1 text-lg font-black text-ink">{card.title}</h2>
          </div>
        </div>
        <ChevronUp className={`shrink-0 text-stone-500 transition ${isOpen ? "" : "rotate-180"}`} size={20} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="grid divide-y divide-amber-200 px-5 py-2 sm:px-6 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <KnowledgeBlock title="规则" body={card.rule} />
          <KnowledgeBlock title="例子" body={card.example} />
          <KnowledgeBlock title="自查" body={card.selfCheck} />
        </div>
      )}
    </section>
  );
}

function KnowledgeBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-4 lg:px-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="text-brass" size={18} aria-hidden="true" />
        <p className="text-sm font-black text-ink">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-700">{body}</p>
    </div>
  );
}
