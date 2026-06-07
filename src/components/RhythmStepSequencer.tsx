import { Play, RotateCcw, Volume2 } from "lucide-react";
import { playRhythmPattern } from "../utils/audioEngine";
import { TheoryQuestion } from "../utils/courseTheory";

interface RhythmStepSequencerProps {
  question: TheoryQuestion;
  value: string;
  onChange: (value: string) => void;
}

const STEP_LABELS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];
const EMPTY_PATTERN = "................";

export function RhythmStepSequencer({ question, value, onChange }: RhythmStepSequencerProps) {
  const currentPattern = normalizePattern(value);

  function toggleStep(index: number) {
    const next = currentPattern.split("");
    next[index] = next[index] === "X" ? "." : "X";
    onChange(next.join(""));
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Volume2 className="text-leaf" size={20} aria-hidden="true" />
            <h2 className="text-base font-bold text-ink">16 步重音网格</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            点亮每组开头的重音格。`X` 是重音，`.` 是经过的十六分格。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => playRhythmPattern(question.expectedAnswer)}>
            <Play size={16} aria-hidden="true" />
            播放目标
          </button>
          <button type="button" className="btn-secondary" onClick={() => playRhythmPattern(currentPattern)}>
            <Play size={16} aria-hidden="true" />
            播放当前
          </button>
          <button type="button" className="btn-secondary" onClick={() => onChange(EMPTY_PATTERN)}>
            <RotateCcw size={16} aria-hidden="true" />
            清空
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
            {STEP_LABELS.map((label, index) => (
              <div key={`${label}-${index}`} className="text-center text-xs font-bold text-stone-500">
                {label}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1">
            {currentPattern.split("").map((step, index) => {
              const active = step === "X";
              const beatStart = index % 4 === 0;
              return (
                <button
                  key={`${index}-${step}`}
                  type="button"
                  data-testid={`rhythm-step-${index + 1}`}
                  className={`h-11 rounded-md border text-sm font-black transition ${
                    active
                      ? "border-leaf bg-leaf text-white shadow-sm"
                      : beatStart
                        ? "border-stone-300 bg-white text-stone-400 hover:border-leaf"
                        : "border-stone-200 bg-mist text-stone-400 hover:border-leaf"
                  }`}
                  aria-label={`第 ${index + 1} 格${active ? "已点亮" : "未点亮"}`}
                  onClick={() => toggleStep(index)}
                >
                  {active ? "X" : "."}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-mist px-3 py-2 text-sm">
        <span className="font-semibold text-stone-600">当前：</span>
        <span className="font-black text-ink">{currentPattern}</span>
      </div>
    </div>
  );
}

export function isRhythmGridQuestion(question: TheoryQuestion): boolean {
  return question.chapterId === "rhythm-grid" && /^[X.]{16}$/.test(question.expectedAnswer.replace(/\s+/g, ""));
}

function normalizePattern(pattern: string): string {
  const compact = pattern.replace(/\s+/g, "");
  return Array.from({ length: 16 }, (_, index) => (compact[index]?.toUpperCase() === "X" ? "X" : ".")).join("");
}
