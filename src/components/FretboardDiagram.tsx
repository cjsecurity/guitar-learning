import { TheoryQuestion } from "../utils/courseTheory";

interface FretboardDiagramProps {
  question: TheoryQuestion;
}

const STRINGS = [6, 5, 4, 3, 2, 1];
const FRETS = Array.from({ length: 13 }, (_, index) => index);

export function FretboardDiagram({ question }: FretboardDiagramProps) {
  const focus = getFretboardFocus(question);

  if (question.chapterId !== "fretboard-root" || !focus) {
    return null;
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">指板定位</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            高亮位置：{focus.stringNumber} 弦 {focus.fret} 品。记住同一根弦上 +12 品是同名音。
          </p>
        </div>
        <span className="rounded-md bg-mist px-3 py-2 text-xs font-bold text-stone-700">0-12 品</span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[44px_repeat(13,minmax(42px,1fr))] gap-1 text-center text-xs font-bold text-stone-500">
            <div />
            {FRETS.map((fret) => (
              <div key={fret}>{fret}</div>
            ))}
          </div>

          <div className="mt-2 space-y-1">
            {STRINGS.map((stringNumber) => (
              <div key={stringNumber} className="grid grid-cols-[44px_repeat(13,minmax(42px,1fr))] gap-1">
                <div className="flex items-center justify-end pr-2 text-xs font-bold text-stone-500">{stringNumber}弦</div>
                {FRETS.map((fret) => {
                  const active = stringNumber === focus.stringNumber && fret === focus.fret;
                  return (
                    <div
                      key={`${stringNumber}-${fret}`}
                      className={`relative h-9 rounded border ${
                        active ? "border-leaf bg-leaf text-white shadow-sm" : "border-stone-200 bg-mist text-stone-400"
                      }`}
                    >
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-stone-300" />
                      {active && <span className="relative z-10 flex h-full items-center justify-center text-xs font-black">根音</span>}
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

function getFretboardFocus(question: TheoryQuestion): { stringNumber: number; fret: number } | null {
  const combined = `${question.prompt} ${question.expectedAnswer}`;
  const stringNumber = parseStringNumber(combined);
  const fret = parseFret(question.expectedAnswer) ?? parseFret(question.prompt);

  if (!stringNumber || fret === null || fret < 0 || fret > 12) {
    return null;
  }

  return { stringNumber, fret };
}

function parseStringNumber(value: string): number | null {
  if (/6\s*弦|六弦/.test(value)) return 6;
  if (/5\s*弦|五弦/.test(value)) return 5;
  return null;
}

function parseFret(value: string): number | null {
  const normalized = value
    .replace(/十三/g, "13")
    .replace(/十二/g, "12")
    .replace(/十一/g, "11")
    .replace(/十/g, "10")
    .replace(/九/g, "9")
    .replace(/八/g, "8")
    .replace(/七/g, "7")
    .replace(/六/g, "6")
    .replace(/五/g, "5")
    .replace(/四/g, "4")
    .replace(/三/g, "3")
    .replace(/二/g, "2")
    .replace(/一/g, "1");

  const explicitFret = normalized.match(/(\d{1,2})\s*品/);
  if (explicitFret) {
    return Number(explicitFret[1]);
  }

  const bareNumber = normalized.match(/^\s*(\d{1,2})\s*$/);
  return bareNumber ? Number(bareNumber[1]) : null;
}
