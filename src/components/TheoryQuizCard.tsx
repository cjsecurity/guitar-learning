import { CheckCircle2, HelpCircle, RefreshCw, Send, XCircle } from "lucide-react";
import { useState } from "react";
import { TheoryEvaluationResult, TheoryQuestion, evaluateTheoryAnswer } from "../utils/courseTheory";

interface TheoryQuizCardProps {
  question: TheoryQuestion;
  onSubmit: (result: TheoryEvaluationResult) => void;
  onNext: () => void;
}

export function TheoryQuizCard({ question, onSubmit, onNext }: TheoryQuizCardProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<TheoryEvaluationResult | null>(null);

  function handleSubmit() {
    const nextResult = evaluateTheoryAnswer(question, answer);
    setResult(nextResult);
    onSubmit(nextResult);
  }

  function handleNext() {
    setAnswer("");
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
            <h1 className="text-4xl font-black tracking-normal text-ink sm:text-5xl">{question.label}</h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-stone-800">{question.prompt}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">训练点：{question.typeLabel}</p>
          </div>
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={handleNext}>
            <RefreshCw size={18} aria-hidden="true" />
            下一题
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        {question.options && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`min-h-12 rounded-md border px-3 py-2 text-sm font-bold transition ${
                  answer === option ? "border-leaf bg-leaf text-white" : "border-stone-300 bg-white text-stone-700 hover:border-leaf hover:text-leaf"
                }`}
                onClick={() => setAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <label className="space-y-2">
          <span className="label">{question.answerLabel}</span>
          <input className="input" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="输入答案，支持空格、逗号或常见符号分隔" />
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
              {question.hint.map((line, index) => (
                <li key={line}>{index + 1}. {line}</li>
              ))}
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
              <h2 className="text-base font-bold text-stone-950">{result.isFullyCorrect ? "正确" : "再校准一下"}</h2>
            </div>

            <div className="mt-4 rounded-md bg-white/70 px-3 py-3 text-sm text-stone-800">
              <p>
                标准答案：<span className="font-black text-ink">{result.expectedFinal}</span>
              </p>
              {!result.isFullyCorrect && answer && <p className="mt-2 text-stone-600">你的答案：{answer}</p>}
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
