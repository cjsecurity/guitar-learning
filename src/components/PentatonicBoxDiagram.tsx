import { TheoryQuestion } from "../utils/courseTheory";

interface PentatonicBoxDiagramProps {
  question: TheoryQuestion;
}

interface BoxNote {
  fret: number;
  note: string;
  role?: "minorRoot" | "majorRoot";
}

interface PentatonicBox {
  title: string;
  subtitle: string;
  frets: number[];
  notesByString: Record<number, BoxNote[]>;
  minorRoot: string;
  majorRoot: string;
}

const STRINGS = [6, 5, 4, 3, 2, 1];

const BOXES: Record<"eg" | "ac" | "gbb", PentatonicBox> = {
  eg: {
    title: "E minor / G major 共用五声盒子",
    subtitle: "6 弦开放 E 是小调中心；6 弦 3 品 G 是关系大调中心。同一批音，落点不同，听感不同。",
    frets: [0, 1, 2, 3],
    minorRoot: "E",
    majorRoot: "G",
    notesByString: {
      6: [
        { fret: 0, note: "E", role: "minorRoot" },
        { fret: 3, note: "G", role: "majorRoot" },
      ],
      5: [
        { fret: 0, note: "A" },
        { fret: 2, note: "B" },
      ],
      4: [
        { fret: 0, note: "D" },
        { fret: 2, note: "E", role: "minorRoot" },
      ],
      3: [
        { fret: 0, note: "G", role: "majorRoot" },
        { fret: 2, note: "A" },
      ],
      2: [
        { fret: 0, note: "B" },
        { fret: 3, note: "D" },
      ],
      1: [
        { fret: 0, note: "E", role: "minorRoot" },
        { fret: 3, note: "G", role: "majorRoot" },
      ],
    },
  },
  ac: {
    title: "A minor / C major 共用五声盒子",
    subtitle: "6 弦 5 品 A 是小调中心；6 弦 8 品 C 是关系大调中心。盒子不变，中心改变。",
    frets: [5, 6, 7, 8],
    minorRoot: "A",
    majorRoot: "C",
    notesByString: {
      6: [
        { fret: 5, note: "A", role: "minorRoot" },
        { fret: 8, note: "C", role: "majorRoot" },
      ],
      5: [
        { fret: 5, note: "D" },
        { fret: 7, note: "E" },
      ],
      4: [
        { fret: 5, note: "G" },
        { fret: 7, note: "A", role: "minorRoot" },
      ],
      3: [
        { fret: 5, note: "C", role: "majorRoot" },
        { fret: 7, note: "D" },
      ],
      2: [
        { fret: 5, note: "E" },
        { fret: 8, note: "G" },
      ],
      1: [
        { fret: 5, note: "A", role: "minorRoot" },
        { fret: 8, note: "C", role: "majorRoot" },
      ],
    },
  },
  gbb: {
    title: "G minor / Bb major 共用五声盒子",
    subtitle: "6 弦 3 品 G 是小调中心；6 弦 6 品 Bb 是关系大调中心。Bb major pentatonic 可以借 G minor 盒子定位。",
    frets: [3, 4, 5, 6],
    minorRoot: "G",
    majorRoot: "Bb",
    notesByString: {
      6: [
        { fret: 3, note: "G", role: "minorRoot" },
        { fret: 6, note: "Bb", role: "majorRoot" },
      ],
      5: [
        { fret: 3, note: "C" },
        { fret: 5, note: "D" },
      ],
      4: [
        { fret: 3, note: "F" },
        { fret: 5, note: "G", role: "minorRoot" },
      ],
      3: [
        { fret: 3, note: "Bb", role: "majorRoot" },
        { fret: 5, note: "C" },
      ],
      2: [
        { fret: 3, note: "D" },
        { fret: 6, note: "F" },
      ],
      1: [
        { fret: 3, note: "G", role: "minorRoot" },
        { fret: 6, note: "Bb", role: "majorRoot" },
      ],
    },
  },
};

export function PentatonicBoxDiagram({ question }: PentatonicBoxDiagramProps) {
  const box = getPentatonicBox(question);

  if (!box) {
    return null;
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">{box.title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-600">{box.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-md bg-leaf px-2 py-1 text-white">{box.minorRoot} 小调中心</span>
          <span className="rounded-md bg-brass px-2 py-1 text-white">{box.majorRoot} 大调中心</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[44px_repeat(4,minmax(82px,1fr))] gap-1 text-center text-xs font-bold text-stone-500">
            <div />
            {box.frets.map((fret) => (
              <div key={fret}>{fret}品</div>
            ))}
          </div>

          <div className="mt-2 space-y-1">
            {STRINGS.map((stringNumber) => (
              <div key={stringNumber} className="grid grid-cols-[44px_repeat(4,minmax(82px,1fr))] gap-1">
                <div className="flex items-center justify-end pr-2 text-xs font-bold text-stone-500">{stringNumber}弦</div>
                {box.frets.map((fret) => {
                  const note = box.notesByString[stringNumber].find((item) => item.fret === fret);
                  return (
                    <div key={`${stringNumber}-${fret}`} className="relative h-11 rounded border border-stone-200 bg-mist">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-stone-300" />
                      {note && (
                        <span
                          className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full text-xs font-black text-white shadow-sm ${
                            note.role === "minorRoot" ? "bg-leaf" : note.role === "majorRoot" ? "bg-brass" : "bg-stone-600"
                          }`}
                        >
                          {note.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getPentatonicBox(question: TheoryQuestion): PentatonicBox | null {
  if (question.chapterId !== "relative-pentatonic") {
    return null;
  }

  const combined = `${question.label} ${question.prompt} ${question.expectedAnswer}`;

  if (/Bb 大调五声|B♭ 大调五声|Bb major pentatonic|G minor \/ Bb major|G minor B/.test(combined)) {
    return BOXES.gbb;
  }

  if (/A C D E G|A minor \/ C major|A minor C major|A小调\/C大调|A 小调五声|C 大调五声|C major pentatonic/.test(combined)) {
    return BOXES.ac;
  }

  if (/E G A B D|E minor \/ G major|E minor G major|E 小调五声|G 大调五声|E minor 关系大调|G 的关系小调|G major pentatonic/.test(combined)) {
    return BOXES.eg;
  }

  return null;
}
