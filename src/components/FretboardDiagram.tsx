import { MousePointer2 } from "lucide-react";
import { TheoryQuestion } from "../utils/courseTheory";

interface FretboardDiagramProps {
  question: TheoryQuestion;
  value: string;
  onChange: (value: string) => void;
  isSubmitted: boolean;
}

interface FretboardPosition {
  stringNumber: number;
  fret: number;
}

type FretboardMode = "position" | "reference" | "root-and-ghost";

const STRINGS = [6, 5];
const FRETS = Array.from({ length: 13 }, (_, index) => index);

export function FretboardDiagram({ question, value, onChange, isSubmitted }: FretboardDiagramProps) {
  const expectedPosition = getFretboardFocus(question);
  const promptPosition = getPositionFromText(question.prompt);
  const selectedPosition = getPositionFromText(value);
  const selectedGhostString = parseGhostString(value);
  const mode = getFretboardMode(question);

  if (question.chapterId !== "fretboard-root" || (!expectedPosition && !promptPosition)) {
    return null;
  }

  const referencePosition = mode === "reference" ? promptPosition : null;
  const helperText = getHelperText(mode, expectedPosition, promptPosition, isSubmitted);

  function handlePositionClick(position: FretboardPosition) {
    if (mode === "reference" || isSubmitted) {
      return;
    }

    if (mode === "root-and-ghost") {
      onChange(formatRootAndGhostAnswer(position, selectedGhostString));
      return;
    }

    onChange(formatPositionAnswer(position));
  }

  function handleGhostClick(stringNumber: number) {
    if (isSubmitted) {
      return;
    }

    onChange(formatRootAndGhostAnswer(selectedPosition, stringNumber));
  }

  return (
    <div data-testid="fretboard-practice-panel" className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MousePointer2 className="text-leaf" size={20} aria-hidden="true" />
            <h2 className="text-base font-bold text-ink">指板实操</h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-stone-600">{helperText}</p>
        </div>
        <span className="rounded-md bg-mist px-3 py-2 text-xs font-bold text-stone-700">5/6 弦 · 0-12 品</span>
      </div>

      {mode === "root-and-ghost" && (
        <div className="mt-4 rounded-md border border-stone-200 bg-mist px-3 py-3">
          <p className="text-sm font-bold text-ink">右手 ghost note 落点</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[6, 5].map((stringNumber) => (
              <button
                key={stringNumber}
                type="button"
                data-testid={`fretboard-ghost-string-${stringNumber}`}
                className={`min-h-11 rounded-md border px-3 py-2 text-sm font-bold transition ${
                  selectedGhostString === stringNumber ? "border-leaf bg-leaf text-white" : "border-stone-300 bg-white text-stone-700 hover:border-leaf hover:text-leaf"
                }`}
                onClick={() => handleGhostClick(stringNumber)}
                disabled={isSubmitted}
              >
                拍{stringNumber}弦
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[52px_repeat(13,minmax(46px,1fr))] gap-1 text-center text-xs font-bold text-stone-500">
            <div />
            {FRETS.map((fret) => (
              <div key={fret}>{fret}</div>
            ))}
          </div>

          <div className="mt-2 space-y-2">
            {STRINGS.map((stringNumber) => (
              <div key={stringNumber} className="grid grid-cols-[52px_repeat(13,minmax(46px,1fr))] gap-1">
                <div className="flex items-center justify-end pr-2 text-xs font-bold text-stone-500">{stringNumber}弦</div>
                {FRETS.map((fret) => {
                  const position = { stringNumber, fret };
                  const selected = positionsEqual(selectedPosition, position);
                  const correct = isSubmitted && positionsEqual(expectedPosition, position);
                  const reference = positionsEqual(referencePosition, position);
                  const interactive = mode !== "reference" && !isSubmitted;
                  const label = getCellLabel({ selected, correct, reference });

                  return (
                    <button
                      key={`${stringNumber}-${fret}`}
                      type="button"
                      data-testid={`fretboard-cell-${stringNumber}-${fret}`}
                      className={`relative h-10 rounded border text-xs font-black transition ${getCellClass({ selected, correct, reference, interactive })}`}
                      onClick={() => handlePositionClick(position)}
                      disabled={!interactive}
                      aria-pressed={selected}
                    >
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current opacity-35" />
                      {label && <span className="relative z-10 flex h-full items-center justify-center">{label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
        <span className="rounded bg-leaf px-2 py-1 text-white">已选</span>
        {isSubmitted && <span className="rounded bg-brass px-2 py-1 text-white">正确位置</span>}
        {mode === "reference" && <span className="rounded bg-mist px-2 py-1 text-stone-700">题目位置</span>}
      </div>
    </div>
  );
}

function getFretboardMode(question: TheoryQuestion): FretboardMode {
  if (question.answerLabel === "音名") {
    return "reference";
  }

  if (question.answerLabel === "根音与落点") {
    return "root-and-ghost";
  }

  return "position";
}

function getHelperText(mode: FretboardMode, expectedPosition: FretboardPosition | null, promptPosition: FretboardPosition | null, isSubmitted: boolean): string {
  if (mode === "reference" && promptPosition) {
    return `题目给的位置是 ${promptPosition.stringNumber} 弦 ${promptPosition.fret} 品。看着这个位置，反向说出音名。`;
  }

  if (isSubmitted && expectedPosition) {
    return `正确位置是 ${expectedPosition.stringNumber} 弦 ${expectedPosition.fret} 品。记住同一根弦上 +12 品是同名音。`;
  }

  if (mode === "root-and-ghost") {
    return "先点根音所在的弦和品，再选择右手 ghost note 更自然拍 5 弦还是 6 弦。";
  }

  return "直接在 5/6 弦指板上点答案；点击会自动填写为“几弦几品”。";
}

function getCellLabel(state: { selected: boolean; correct: boolean; reference: boolean }): string {
  if (state.correct) return "正确";
  if (state.selected) return "已选";
  if (state.reference) return "题目";
  return "";
}

function getCellClass(state: { selected: boolean; correct: boolean; reference: boolean; interactive: boolean }): string {
  if (state.correct) {
    return "border-brass bg-brass text-white shadow-sm";
  }

  if (state.selected) {
    return "border-leaf bg-leaf text-white shadow-sm";
  }

  if (state.reference) {
    return "border-stone-400 bg-mist text-stone-700";
  }

  return state.interactive ? "border-stone-200 bg-mist text-stone-400 hover:border-leaf hover:bg-white hover:text-leaf" : "border-stone-200 bg-mist text-stone-300";
}

function formatPositionAnswer(position: FretboardPosition): string {
  return `${position.stringNumber}弦${position.fret}品`;
}

function formatRootAndGhostAnswer(position: FretboardPosition | null, ghostString: number | null): string {
  const parts = [];

  if (position) {
    parts.push(formatPositionAnswer(position));
  }

  if (ghostString) {
    parts.push(`拍${ghostString}弦`);
  }

  return parts.join("，");
}

function getFretboardFocus(question: TheoryQuestion): FretboardPosition | null {
  const combined = `${question.prompt} ${question.expectedAnswer}`;
  const stringNumber = parseStringNumber(combined);
  const fret = parseFret(question.expectedAnswer) ?? parseFret(question.prompt);

  if (!stringNumber || fret === null || fret < 0 || fret > 12) {
    return null;
  }

  return { stringNumber, fret };
}

function getPositionFromText(value: string): FretboardPosition | null {
  const stringNumber = parseStringNumber(value);
  const fret = parseFret(value);

  if (!stringNumber || fret === null || fret < 0 || fret > 12) {
    return null;
  }

  return { stringNumber, fret };
}

function positionsEqual(left: FretboardPosition | null, right: FretboardPosition | null): boolean {
  return Boolean(left && right && left.stringNumber === right.stringNumber && left.fret === right.fret);
}

function parseStringNumber(value: string): number | null {
  if (/6\s*弦|六弦|string\s*6|string6/.test(value)) return 6;
  if (/5\s*弦|五弦|string\s*5|string5/.test(value)) return 5;
  return null;
}

function parseGhostString(value: string): number | null {
  if (/拍\s*6\s*弦|拍六弦|string\s*6|string6/.test(value)) return 6;
  if (/拍\s*5\s*弦|拍五弦|string\s*5|string5/.test(value)) return 5;
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

  const explicitFret = normalized.match(/(\d{1,2})\s*品|fret\s*(\d{1,2})/i);
  if (explicitFret) {
    return Number(explicitFret[1] ?? explicitFret[2]);
  }

  const bareNumber = normalized.match(/^\s*(\d{1,2})\s*$/);
  return bareNumber ? Number(bareNumber[1]) : null;
}
