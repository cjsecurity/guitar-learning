import { CheckCircle2, HelpCircle, Music, Play, RefreshCw, Send, Volume2, XCircle } from "lucide-react";
import { useState } from "react";
import { getFrequency, playSequence, playSingle, playTogether } from "../utils/audioEngine";
import { IntervalEvaluationResult, IntervalFeel, IntervalQuestion, evaluateIntervalAnswer } from "../utils/intervalTheory";

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
  const [hasPlayed, setHasPlayed] = useState(false);
  const [target, setTarget] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<IntervalEvaluationResult | null>(null);
  const isHardIdentify = question.mode === "identify" && question.difficultyId === "hard";

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
    setHasPlayed(false);
    setTarget("");
    setShowHint(false);
    setResult(null);
    onNext();
  }

  async function playRoot() {
    setHasPlayed(true);
    await playSingle(question.rootFrequency);
  }

  async function playTarget() {
    setHasPlayed(true);
    await playSingle(question.targetFrequency);
  }

  async function playCurrentInterval() {
    setHasPlayed(true);
    await playSequence([question.rootFrequency, question.targetFrequency]);
  }

  async function playCurrentTogether() {
    setHasPlayed(true);
    await playTogether([question.rootFrequency, question.targetFrequency]);
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
              {isHardIdentify ? "这一档只要求快速说出完整音程名；解释区会帮你核对度数、半音和协和分类。" : "练习顺序：度数看字母，性质看半音，最后判断基础协和分类。"}
            </p>
          </div>
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={handleNext}>
            <RefreshCw size={18} aria-hidden="true" />
            下一题
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="rounded-lg border border-stone-200 bg-mist px-4 py-4">
          <div className="flex items-center gap-2">
            <Volume2 className="text-leaf" size={20} aria-hidden="true" />
            <h2 className="text-base font-bold text-ink">先听声音</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            先听根音，再听目标音。听不出来时先播放下面的对比样本，再回来听当前题。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AudioButton label="播放根音" onClick={playRoot} />
            <AudioButton label="播放目标音" onClick={playTarget} />
            <AudioButton label="根音 + 目标音" onClick={playCurrentInterval} />
            <AudioButton label="同时听两个音" onClick={playCurrentTogether} />
          </div>
          {!hasPlayed && <p className="mt-3 text-xs font-semibold text-amber-700">先听再选，协和分类要和声音感觉连起来。</p>}
        </div>

        <ComparisonSamples />

        {question.mode === "spell" ? (
          <label className="space-y-2">
            <span className="label">目标音</span>
            <input className="input" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="例如 F#、Gb、C" />
          </label>
        ) : isHardIdentify ? (
          <label className="space-y-2">
            <span className="label">完整音程名</span>
            <input className="input" value={quality} onChange={(event) => setQuality(event.target.value)} placeholder="例如 增四度、减五度、M3、P5" />
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
            <div className="space-y-2 md:col-span-2">
              <span className="label">基础协和分类</span>
              <FeelPicker value={feel} onChange={setFeel} />
            </div>
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
              <li>3. 本课程的基础协和分类按完全协和、不完全协和、不协和来判断；纯四度归入完全协和。</li>
              {isHardIdentify && <li>4. 困难档只填完整音程名，是为了更贴合“速算”；提交后再看其它字段校准。</li>}
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
              <ResultBadge label="度数" ok={question.mode === "spell" || isHardIdentify || result.degreeCorrect} value={result.expectedDegree} />
              <ResultBadge label="半音" ok={question.mode === "spell" || isHardIdentify || result.semitoneCorrect} value={`${result.expectedSemitones}`} />
              <ResultBadge label="音程名" ok={question.mode === "spell" || result.qualityCorrect} value={result.expectedQuality} />
              {question.mode === "identify" && <ResultBadge label="基础协和分类" ok={isHardIdentify || result.feelCorrect} value={result.expectedFeel} />}
              {question.mode === "spell" && <ResultBadge label="目标音" ok={result.targetCorrect} value={result.expectedTarget} />}
            </div>

            {question.mode === "identify" && (
              <p className="mt-4 rounded-md bg-white/70 px-3 py-2 text-sm text-stone-800">
                你选的是 {feel || "未选择"}，标准分类是 {result.expectedFeel}。先听声音，再用理论检查：{question.interval.audioExample}。
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

function AudioButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn-secondary" onClick={onClick}>
      <Play size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

function FeelPicker({ value, onChange }: { value: string; onChange: (value: IntervalFeel) => void }) {
  const options: Array<{ value: IntervalFeel; helper: string }> = [
    { value: "完全协和", helper: "纯四、纯五、八度" },
    { value: "不完全协和", helper: "大小三度、大小六度" },
    { value: "不协和", helper: "二度、七度、三全音" },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`min-h-16 rounded-md border px-3 py-2 text-left text-sm font-bold transition ${
            value === option.value ? "border-leaf bg-leaf text-white" : "border-stone-300 bg-white text-stone-700 hover:border-leaf hover:text-leaf"
          }`}
          onClick={() => onChange(option.value)}
        >
          <span className="block">{option.value}</span>
          <span className={`mt-1 block text-xs font-semibold ${value === option.value ? "text-white/80" : "text-stone-500"}`}>{option.helper}</span>
        </button>
      ))}
    </div>
  );
}

function ComparisonSamples() {
  const samples: Array<{ feel: IntervalFeel; label: string; notes: [string, string] }> = [
    { feel: "完全协和", label: "C -> F / C -> G / C -> C", notes: ["C", "F"] },
    { feel: "不完全协和", label: "C -> E / C -> Eb", notes: ["C", "E"] },
    { feel: "不协和", label: "C -> Db / C -> F#", notes: ["C", "Db"] },
  ];

  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-4">
      <div className="flex items-center gap-2">
        <Music className="text-leaf" size={20} aria-hidden="true" />
        <h2 className="text-base font-bold text-ink">对比样本</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {samples.map((sample) => (
          <button
            key={sample.feel}
            type="button"
            className="rounded-md border border-stone-200 bg-mist px-3 py-3 text-left transition hover:border-leaf"
            onClick={() => playSequence(sample.notes.map((note) => getFrequency(note)))}
          >
            <span className="text-sm font-black text-ink">{sample.feel}</span>
            <span className="mt-1 block text-xs text-stone-600">{sample.label}</span>
          </button>
        ))}
      </div>
    </div>
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
