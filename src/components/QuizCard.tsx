import { CheckCircle2, HelpCircle, RefreshCw, Send, XCircle } from "lucide-react";
import { useState } from "react";
import {
  EvaluationResult,
  Question,
  buildHint,
  evaluateAnswer,
  formatFormula,
  getFormulaTaskLabel,
  getQuestionReading,
  getSkeletonTaskLabel,
  isNinthChord,
} from "../utils/musicTheory";

interface QuizCardProps {
  question: Question;
  onSubmit: (result: EvaluationResult) => void;
  onNext: () => void;
}

export function QuizCard({ question, onSubmit, onNext }: QuizCardProps) {
  const [skeletonInput, setSkeletonInput] = useState("");
  const [finalInput, setFinalInput] = useState("");
  const [omitFifth, setOmitFifth] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const hint = buildHint(question);
  const skeletonDegrees = isNinthChord(question.type) ? ["1", "3", "5", "7", "9"] : ["1", "3", "5", "7"];

  function handleSubmit() {
    const nextResult = evaluateAnswer(question, skeletonInput, finalInput, omitFifth);
    setResult(nextResult);
    onSubmit(nextResult);
  }

  function handleNext() {
    setSkeletonInput("");
    setFinalInput("");
    setOmitFifth(false);
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
            <h1 className="text-6xl font-black tracking-normal text-ink sm:text-7xl">{question.label}</h1>
            <p className="mt-3 text-base font-semibold text-stone-800">{getQuestionReading(question)}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              先写根音的字母骨架，再套和弦公式。输入可用空格或逗号分隔。
            </p>
          </div>
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={handleNext}>
            <RefreshCw size={18} aria-hidden="true" />
            下一题
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-stone-200 bg-mist px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-leaf">第一步</p>
            <p className="mt-2 text-base font-bold text-ink">{getSkeletonTaskLabel(question)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skeletonDegrees.map((degree) => (
                <span key={degree} className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-700">
                  {degree} = ?
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-mist px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-leaf">第二步</p>
            <p className="mt-2 text-base font-bold text-ink">{getFormulaTaskLabel(question)}</p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              根音部分决定从哪个字母开始，后面的类型标记决定公式。例如 Db7 读作降D属七和弦，公式是 1、3、5、b7。
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="label">{getSkeletonTaskLabel(question)}</span>
            <input
              className="input"
              value={skeletonInput}
              onChange={(event) => setSkeletonInput(event.target.value)}
              placeholder={isNinthChord(question.type) ? "例如 D F A C E" : "例如 A C E G"}
            />
          </label>

          <label className="space-y-2">
            <span className="label">{getFormulaTaskLabel(question)}</span>
            <input
              className="input"
              value={finalInput}
              onChange={(event) => setFinalInput(event.target.value)}
              placeholder="例如 A C# E G"
            />
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-md border border-stone-200 bg-mist px-3 py-3 text-sm text-stone-700">
          <input
            className="mt-1 h-4 w-4 accent-leaf"
            type="checkbox"
            checked={omitFifth}
            onChange={(event) => setOmitFifth(event.target.checked)}
          />
          <span>我选择省略五音，并知道完整和弦结构里仍然包含五音。</span>
        </label>

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
              {hint.map((line, index) => (
                <li key={line}>
                  {index + 1}. {line}
                </li>
              ))}
            </ol>
          </div>
        )}

        {result && (
          <div
            className={`rounded-lg border px-4 py-4 ${
              result.isFullyCorrect
                ? "border-emerald-200 bg-emerald-50"
                : "border-rose-200 bg-rose-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.isFullyCorrect ? (
                <CheckCircle2 className="text-emerald-700" size={20} aria-hidden="true" />
              ) : (
                <XCircle className="text-rose-700" size={20} aria-hidden="true" />
              )}
              <h2 className="text-base font-bold text-stone-950">
                {result.isFullyCorrect ? "完全正确" : "再校准一下"}
              </h2>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-stone-800 sm:grid-cols-3">
              <ResultBadge label="字母骨架" ok={result.skeletonCorrect} value={result.expectedSkeleton.join(" ")} />
              <ResultBadge label="和弦公式" ok value={formatFormula(result.formula)} />
              <ResultBadge label="最终音" ok={result.finalCorrect} value={result.expectedFinal.join(" ")} />
            </div>

            {result.omittedFifthAnswer && !result.finalCorrect && (
              <p className="mt-4 rounded-md bg-white/70 px-3 py-2 text-sm text-stone-800">
                你写的是省略五音版本：{result.expectedOmittedFinal.join(" ")}。这个课堂写法能理解，但本题完整答案仍要写{" "}
                {result.expectedFinal.join(" ")}。
              </p>
            )}

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
