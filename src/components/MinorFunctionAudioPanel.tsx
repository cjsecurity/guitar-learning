import { Play, Volume2 } from "lucide-react";
import { playChordProgression } from "../utils/audioEngine";
import { TheoryQuestion } from "../utils/courseTheory";

interface MinorFunctionAudioPanelProps {
  question: TheoryQuestion;
}

const COMPARISONS = [
  {
    label: "Em7 -> Am",
    helper: "自然小调 v7 回 i，G 到 A 不是半音，回家感较弱。",
    chords: [
      ["E", "G", "B", "D"],
      ["A", "C", "E"],
    ],
  },
  {
    label: "E7 -> Am",
    helper: "和声小调 V7 回 i，G# 是导音，会强烈想去 A。",
    chords: [
      ["E", "G#", "B", "D"],
      ["A", "C", "E"],
    ],
  },
  {
    label: "G#°7 -> Am",
    helper: "导音减七回 i，也能听到向 Am 收束的张力。",
    chords: [
      ["G#", "B", "D", "F"],
      ["A", "C", "E"],
    ],
  },
];

export function MinorFunctionAudioPanel({ question }: MinorFunctionAudioPanelProps) {
  if (question.chapterId !== "minor-function") {
    return null;
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex items-center gap-2">
        <Volume2 className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-base font-bold text-ink">听 V7 为什么更想回 i</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        先听自然小调的 v7，再听和声小调的 V7。重点听 G 和 G# 到 A 的差别：半音导向会让回家感更强。
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {COMPARISONS.map((comparison) => (
          <button
            key={comparison.label}
            type="button"
            className="rounded-md border border-stone-200 bg-mist px-3 py-3 text-left transition hover:border-leaf"
            onClick={() => playChordProgression(comparison.chords)}
          >
            <span className="flex items-center gap-2 text-sm font-black text-ink">
              <Play size={16} aria-hidden="true" />
              {comparison.label}
            </span>
            <span className="mt-2 block text-xs leading-5 text-stone-600">{comparison.helper}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
