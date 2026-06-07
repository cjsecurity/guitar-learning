import { ChevronUp, GraduationCap } from "lucide-react";
import { useState } from "react";

interface ChordWorkedExampleProps {
  defaultOpen: boolean;
}

export function ChordWorkedExample({ defaultOpen }: ChordWorkedExampleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section data-testid="chord-worked-example" className="mb-5 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        data-testid="chord-worked-example-toggle"
        className="flex w-full items-center justify-between gap-3 border-b border-stone-200 px-5 py-4 text-left sm:px-6"
        onClick={() => setIsOpen((value) => !value)}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brass text-white">
            <GraduationCap size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-brass">新手第一题示范</p>
            <h2 className="mt-1 text-lg font-black text-ink">为什么 D 的骨架是 D F A，但 D 大三和弦是 D F# A</h2>
          </div>
        </div>
        <ChevronUp className={`shrink-0 text-stone-500 transition ${isOpen ? "" : "rotate-180"}`} size={20} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="grid gap-3 px-5 py-5 sm:px-6 lg:grid-cols-3">
          <WorkedStep
            title="1. 先搭字母骨架"
            body="从 D 开始隔一个字母叠三度：D、F、A。这里先只决定字母名字，不急着判断升降号。"
            answer="字母骨架：D F A"
          />
          <WorkedStep
            title="2. 再看和弦公式"
            body="大三和弦公式是 1、3、5。这里的 3 不是“随便第三个字母”，而是距离根音 4 个半音的大三度。"
            answer="D 到 F 只有 3 个半音"
          />
          <WorkedStep
            title="3. 最后补升降号"
            body="为了让 D 到三音变成 4 个半音，要把骨架里的 F 升高半音写成 F#。骨架没有错，最终音要补上升降号。"
            answer="最终音：D F# A"
          />
          <p className="rounded-md bg-mist px-3 py-3 text-sm font-semibold leading-6 text-stone-700 lg:col-span-3">
            自查口令：先说“D 的 1、3、5 字母骨架是 D F A”，再说“D 大三公式要求大三度，所以 F 要升成 F#”。这两个答案不是互相矛盾，而是两个步骤。
          </p>
        </div>
      )}
    </section>
  );
}

function WorkedStep({ title, body, answer }: { title: string; body: string; answer: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-mist px-4 py-4">
      <h3 className="text-sm font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-700">{body}</p>
      <p className="mt-3 rounded-md bg-white px-3 py-2 text-sm font-black text-leaf">{answer}</p>
    </div>
  );
}
