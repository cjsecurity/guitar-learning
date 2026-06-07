import { Play, RotateCcw, Volume2 } from "lucide-react";
import { playRhythmPattern } from "../utils/audioEngine";
import { TheoryQuestion } from "../utils/courseTheory";

interface RhythmStepSequencerProps {
  question: TheoryQuestion;
  value: string;
  onChange: (value: string) => void;
}

const STEP_LABELS = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];
const BEAT_LABELS = ["第 1 拍", "第 2 拍", "第 3 拍", "第 4 拍"];
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
            手机上按 4 拍折行，每拍都是 1 e & a 四个十六分格。
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

      <div data-testid="rhythm-mobile-beat-grid" className="mt-4 grid gap-3 sm:grid-cols-4">
        {BEAT_LABELS.map((beatLabel, beatIndex) => {
          const beatSteps = currentPattern.slice(beatIndex * 4, beatIndex * 4 + 4).split("");

          return (
            <div key={beatLabel} data-testid={`rhythm-beat-group-${beatIndex + 1}`} className="rounded-lg border border-stone-200 bg-mist px-3 py-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-black text-ink">{beatLabel}</p>
                <p className="text-xs font-semibold text-stone-500">1 e & a</p>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {beatSteps.map((step, stepOffset) => {
                  const index = beatIndex * 4 + stepOffset;
                  const active = step === "X";
                  const beatStart = stepOffset === 0;

                  return (
                    <div key={`${STEP_LABELS[index]}-${index}`} className="space-y-1">
                      <div className="text-center text-xs font-bold text-stone-500">{STEP_LABELS[index]}</div>
                      <button
                        type="button"
                        data-testid={`rhythm-step-${index + 1}`}
                        className={`h-12 w-full rounded-md border text-sm font-black transition ${
                          active
                            ? "border-leaf bg-leaf text-white shadow-sm"
                            : beatStart
                              ? "border-stone-300 bg-white text-stone-500 hover:border-leaf"
                              : "border-stone-200 bg-white text-stone-400 hover:border-leaf"
                        }`}
                        aria-label={`第 ${index + 1} 格${active ? "已点亮" : "未点亮"}`}
                        onClick={() => toggleStep(index)}
                      >
                        {active ? "X" : "."}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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
