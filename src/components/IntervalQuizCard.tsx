import { CheckCircle2, HelpCircle, RefreshCw, Send, XCircle } from "lucide-react";
import { useState } from "react";
import { IntervalEvaluationResult, IntervalQuestion, evaluateIntervalAnswer } from "../utils/intervalTheory";

interface IntervalQuizCardProps {
  question: IntervalQuestion;
  onSubmit: (result: IntervalEvaluationResult) => void;
  onNext: () => void;
}

export function IntervalQuizCard({ question, onSubmit, onNext }: IntervalQuizCardProps) {
  const [degree, setDegree] = useState("");
  const [semitones, setSemitones] = useState("");
  const [quality, setQuality] = useState("");
  const [feel, setFeel] = useState("");
  const [target, setTarget] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<IntervalEvaluationResult | null>(null);

  function handleSubmit() {
    const nextResult = evaluateIntervalAnswer(question, { degree, semitones, quality, feel, target });
    setResult(nextResult);
    onSubmit(nextResult);
  }

  function handleNext() {
    setDegree("");
    setSemitones("");
    setQuality("");
    setFeel("");
    setTarget("");
    setShowHint(false);
    setResult(null);
    onNext();
  }

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-stone-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-sm font-medium text-leaf">当前题目</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-5xl font-black tracking-normal text-ink sm:text-6xl">{question.label}</h1>
            <p className="mt-3 text-base font-semibold text-stone-800">
              {question.mode === "spell" ? "根据根音和音程名，写出目标音。" : "根据根音和目标音，判断音程。"}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              练习顺序：度数看字母，性质看半音，最后判断听感。
            </p>
          </div>
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={handleNext}>
            <RefreshCw size={18} aria-hidden="true" />
            下一题
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        {question.mode === "spell" ? (
          <label className="space-y-2">
            <span className="label">目标音</span>
            <input className="input" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="例如 F#、Gb、C" />
          </label>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="label">度数</span>
              <input className="input" value={degree} onChange={(event) => setDegree(event.target.value)} placeholder="例如 三度 或 3度" />
            </label>
            <label className="space-y-2">
              <span className="label">半音数量</span>
              <input className="input" value={semitones} onChange={(event) => setSemitones(event.target.value)} placeholder="例如 4" />
            </label>
            <label className="space-y-2">
              <span className="label">完整音程名</span>
              <input className="input" value={quality} onChange={(event) => setQuality(event.target.value)} placeholder="例如 大三度 或 M3" />
            </label>
            <label className="space-y-2">
              <span className="label">听感分类</span>
              <input className="input" value={feel} onChange={(event) => setFeel(event.target.value)} placeholder="稳定、顺耳、紧张、刺耳" />
            </label>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn-primary flex-1" onClick={handleSubmit}>
            <Send size={18} aria-hidden="true" />
            提交答案
          </button>
          <button type="button" className="btn-warm flex-1" onClick={() => setShowHint((value) => !value)}>
            <HelpCircle size={18} aria-hidden="true" />
            {showHint ? "收起提示" : "显示提示"}
          </button>
        </div>

        {showHint && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
            <h2 className="text-base font-bold text-stone-900">解题提示</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
              <li>1. 先数字母，决定它是几度。</li>
              <li>2. 再数半音，决定大、小、纯、增、减。</li>
              <li>3. 最后把听感归类：稳定、顺耳、紧张或刺耳。</li>
              {question.mode === "spell" && <li>4. 反向题先定目标字母，再用 # 或 b 补足半音距离。</li>}
            </ol>
          </div>
        )}

        {result && (
          <div className={`rounded-lg border px-4 py-4 ${result.isFullyCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="flex items-center gap-2">
              {result.isFullyCorrect ? (
                <CheckCircle2 className="text-emerald-700" size={20} aria-hidden="true" />
              ) : (
                <XCircle className="text-rose-700" size={20} aria-hidden="true" />
              )}
              <h2 className="text-base font-bold text-stone-950">{result.isFullyCorrect ? "完全正确" : "再校准一下"}</h2>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-stone-800 sm:grid-cols-2 lg:grid-cols-4">
              <ResultBadge label="度数" ok={result.degreeCorrect} value={result.expectedDegree} />
              <ResultBadge label="半音" ok={result.semitoneCorrect} value={`${result.expectedSemitones}`} />
              <ResultBadge label="音程名" ok={result.qualityCorrect} value={result.expectedQuality} />
              <ResultBadge label="听感" ok={result.feelCorrect} value={result.expectedFeel} />
              {question.mode === "spell" && <ResultBadge label="目标音" ok={result.targetCorrect} value={result.expectedTarget} />}
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-stone-800">
              {result.explanation.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function ResultBadge({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <div className="rounded-md border border-white/70 bg-white/70 px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-stone-700">{label}</span>
        <span className={ok ? "text-emerald-700" : "text-rose-700"}>{ok ? "正确" : "应为"}</span>
      </div>
      <p className="mt-2 break-words text-base font-bold text-ink">{value}</p>
    </div>
  );
}
