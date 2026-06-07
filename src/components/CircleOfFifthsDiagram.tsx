import { TheoryQuestion } from "../utils/courseTheory";

interface CircleOfFifthsDiagramProps {
  question: TheoryQuestion;
}

const SHARP_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "C#"];
const FLAT_KEYS = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
const SHARP_ORDER = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"];
const FLAT_ORDER = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"];

const SHARP_KEY_TEXT = "C G D A E B F# C#";
const FLAT_KEY_TEXT = "C F Bb Eb Ab Db Gb Cb";

function normalizeText(value: string) {
  return value.replace(/♯/g, "#").replace(/♭/g, "b").toLowerCase();
}

function isMentioned(question: TheoryQuestion, keyName: string) {
  const source = normalizeText(`${question.label} ${question.prompt} ${question.expectedAnswer}`);
  const normalizedKey = normalizeText(keyName);
  const tokenPattern = new RegExp(`(^|[^a-z#b])${normalizedKey}($|[^a-z#b])`);
  return tokenPattern.test(source);
}

function KeyStrip({ title, helper, keys, question }: { title: string; helper: string; keys: string[]; question: TheoryQuestion }) {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="text-sm font-black text-stone-900">{title}</h3>
        <p className="text-xs font-semibold text-stone-500">{helper}</p>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {keys.map((keyName) => {
          const active = isMentioned(question, keyName);
          return (
            <div
              key={`${title}-${keyName}`}
              className={`flex min-h-12 items-center justify-center rounded-md border px-2 text-sm font-black ${
                active ? "border-leaf bg-leaf text-white shadow-sm" : "border-stone-200 bg-white text-stone-800"
              }`}
            >
              {keyName}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccidentalOrder({ title, items, rule }: { title: string; items: string[]; rule: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white px-3 py-3">
      <h3 className="text-sm font-black text-stone-900">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={item} className="rounded-md bg-stone-100 px-2.5 py-1 text-sm font-black text-stone-800">
            {index + 1}. {item}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-stone-600">{rule}</p>
    </div>
  );
}

export function CircleOfFifthsDiagram({ question }: CircleOfFifthsDiagramProps) {
  if (question.chapterId !== "key-signatures") {
    return null;
  }

  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-sky-700">Circle of Fifths</p>
          <h2 className="text-lg font-black text-stone-950">五度圈速查</h2>
        </div>
        <p className="text-xs font-semibold text-stone-600">当前题相关调会高亮</p>
      </div>

      <div className="mt-4 space-y-4">
        <KeyStrip title="升号方向" helper={`顺时针：${SHARP_KEY_TEXT}`} keys={SHARP_KEYS} question={question} />
        <KeyStrip title="降号方向" helper={`逆时针：${FLAT_KEY_TEXT}`} keys={FLAT_KEYS} question={question} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <AccidentalOrder title="升号出现顺序" items={SHARP_ORDER} rule="最后一个升号 + 半音 = 调名。例如 F# C# G# 的最后一个升号是 G#，上行半音到 A，所以是 A major。" />
        <AccidentalOrder title="降号出现顺序" items={FLAT_ORDER} rule="两个以上降号时，倒数第二个降号 = 调名。例如 Bb Eb Ab Db 的倒数第二个降号是 Ab，所以是 Ab major。" />
      </div>
    </section>
  );
}
