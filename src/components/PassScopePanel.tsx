import { AlertTriangle, CheckCircle2, Route } from "lucide-react";

interface PassScopePanelProps {
  scopeId: string;
}

interface PassScopeContent {
  canProve: string;
  cannotProve: string;
  nextPractice: string;
}

const PASS_SCOPE: Record<string, PassScopeContent> = {
  interval: {
    canProve: "能把题面里的根音和目标音转成字母度数、半音数量、完整音程名，并用完全协和/不完全协和/不协和做基础分类。",
    cannotProve: "你已经能闭眼听辨所有音程、拥有绝对音高，或能在真实旋律里马上听出每个距离。",
    nextPractice: "下一步要多开盲听模式，并在吉他上从同一个根音弹出目标音，把纸面推导、耳朵和指板连起来。",
  },
  "chord-construction": {
    canProve: "能按 1、3、5、7、9 的顺序写字母骨架，并按和弦公式补出正确升降号。",
    cannotProve: "你已经会在吉他上按出好听 voicing、会省略与转位，或能在歌曲伴奏里立刻应用。",
    nextPractice: "下一步要把写出的音放到 5/6 弦根音系统和实际和弦指型里，再练常见进行里的连接。",
  },
  "fretboard-root": {
    canProve: "能在 5 弦和 6 弦上定位根音，知道根音系统会影响和弦把位与 ghost note 落点。",
    cannotProve: "你已经掌握全指板所有音名，也不能证明你能在节拍里无停顿完成换把和右手控制。",
    nextPractice: "下一步要开节拍器限时找根音，并把同一个和弦分别放到 5 弦根音和 6 弦根音系统里弹出来。",
  },
  "diatonic-chords": {
    canProve: "能把 C 大调级数、三和弦质量和七和弦质量互相转换。",
    cannotProve: "你已经能在所有 key 里自动转调，也不能证明你能听出每个顺阶功能。",
    nextPractice: "下一步要把同一套级数移到 G、D、F、Bb 等常见 key，并在吉他上找根音。",
  },
  "chord-symbols": {
    canProve: "能识别常见和弦标记，例如 maj7、7、m7、m7b5、dim、sus、add9 与 slash chord。",
    cannotProve: "你已经会为每个符号选择实际按法，也不能证明你能在谱面里判断最佳省略音。",
    nextPractice: "下一步要把符号拆成具体和弦音，再在指板上找 3 音、7 音和颜色音。",
  },
  "extensions-omissions": {
    canProve: "能解释 9、11、13 的来源，判断课堂 voicing 里省略了哪些音，以及 sus 或 b13 的声部变化。",
    cannotProve: "你已经能在真实伴奏里选择最合适的延伸音排列，也不能证明你能听出每个内声解决。",
    nextPractice: "下一步要把 Dm9、G13、G13sus4、G7(b13) 放到 loop 里听解决方向。",
  },
  "progression-transpose": {
    canProve: "能把 1-6-2-5、ii-V-I 等级数进行落到具体 key 的和弦名。",
    cannotProve: "你已经能在歌曲里即时判断 key，也不能证明你能边弹边转调。",
    nextPractice: "下一步要用同一组进行在 C、A、Bb、Ab 等 key 上找根音并弹出基本 voicing。",
  },
  "key-signatures": {
    canProve: "能用五度圈、升号顺序和降号顺序推导大调调号与关系小调。",
    cannotProve: "你已经能在实际谱面里快速读完所有临时升降号，也不能证明你会用调号指导即兴。",
    nextPractice: "下一步要把调号和顺阶和弦、五声音阶中心一起练，避免只背调号表。",
  },
  "relative-pentatonic": {
    canProve: "能区分关系大小调和大小调五声音阶，知道同一批音可以因为中心不同而听感不同。",
    cannotProve: "你已经能在 solo 里稳定落到正确中心音，也不能证明你会连接多个五声音阶盒子。",
    nextPractice: "下一步要在同一个指板 box 里分别强调小调中心和关系大调中心，听落点变化。",
  },
  "minor-function": {
    canProve: "能解释自然小调、和声小调、V7 回 i、导音减七与省略根音的属七降九之间的关系。",
    cannotProve: "你已经能听出所有小调功能解决，也不能证明你会在真实曲子里安排替代和弦。",
    nextPractice: "下一步要反复听 Em7 -> Am、E7 -> Am、G#°7 -> Am 的回家感差异。",
  },
  "borrowed-chords": {
    canProve: "能判断常见同主音大小调借用和弦，例如 bIII、iv、bVI、bVII。",
    cannotProve: "你已经能在任何歌曲里即时判断借用来源，也不能证明你能自然写出 borrowed chord 进行。",
    nextPractice: "下一步要把 borrowed iv 放进真实进行里听，例如 G - B - C - Cm 的暗色变化。",
  },
  "rhythm-grid": {
    canProve: "能在 16 分网格里判断重音位置、分组和是否回到下一小节 one。",
    cannotProve: "你已经拥有稳定 groove、真实右手闷音控制，或能跟鼓手一起不漂。",
    nextPractice: "下一步要打开跟拍检测和节奏音频，用身体跟着 16 分网格走，而不只是看图答题。",
  },
};

const FALLBACK_SCOPE: PassScopeContent = {
  canProve: "能完成当前题型要求的纸面推导、规则识别和输入表达。",
  cannotProve: "你已经能在真实演奏、闭眼听辨或歌曲应用里稳定使用这个知识点。",
  nextPractice: "下一步要把规则放到指板、耳朵、节拍器和真实歌曲片段里继续练。",
};

export function PassScopePanel({ scopeId }: PassScopePanelProps) {
  const content = PASS_SCOPE[scopeId] ?? FALLBACK_SCOPE;

  return (
    <section data-testid="pass-scope-panel" className="mb-5 rounded-lg border border-stone-200 bg-white px-5 py-4 shadow-sm sm:px-6">
      <div className="grid gap-3 lg:grid-cols-3">
        <ScopeBlock icon="check" title="通关后能证明" body={content.canProve} />
        <ScopeBlock icon="warn" title="还不能证明" body={content.cannotProve} />
        <ScopeBlock icon="route" title="下一步练法" body={content.nextPractice} />
      </div>
    </section>
  );
}

function ScopeBlock({ icon, title, body }: { icon: "check" | "warn" | "route"; title: string; body: string }) {
  const Icon = icon === "check" ? CheckCircle2 : icon === "warn" ? AlertTriangle : Route;
  const iconClass = icon === "check" ? "text-emerald-700" : icon === "warn" ? "text-amber-700" : "text-leaf";

  return (
    <div className="rounded-md bg-mist px-3 py-3">
      <div className="flex items-center gap-2">
        <Icon className={iconClass} size={18} aria-hidden="true" />
        <h2 className="text-sm font-black text-ink">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-700">{body}</p>
    </div>
  );
}
