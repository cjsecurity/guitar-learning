export type TheoryDifficultyId = "easy" | "medium" | "hard" | "hell";

export interface TheoryChapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessonRefs: string;
  difficulties: TheoryDifficultyConfig[];
}

export interface TheoryDifficultyConfig {
  id: TheoryDifficultyId;
  title: string;
  badge: string;
  description: string;
  questions: TheoryQuestion[];
}

export interface TheoryQuestion {
  id: string;
  chapterId: string;
  difficultyId: TheoryDifficultyId;
  label: string;
  prompt: string;
  answerLabel: string;
  expectedAnswer: string;
  acceptedAnswers: string[];
  typeLabel: string;
  hint: string[];
  explanation: string[];
  options?: string[];
}

export interface TheoryEvaluationResult {
  isFullyCorrect: boolean;
  expectedFinal: string;
  typeLabel: string;
  explanation: string[];
  normalizedUserAnswer: string;
}

interface QuestionSeed {
  label: string;
  prompt: string;
  answerLabel: string;
  expectedAnswer: string;
  acceptedAnswers?: string[];
  typeLabel: string;
  hint: string[];
  explanation: string[];
  options?: string[];
}

const DIFFICULTY_TITLES: Record<TheoryDifficultyId, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
  hell: "地狱",
};

const COURSE_DEFINITIONS: Array<Omit<TheoryChapter, "difficulties"> & { difficultySeeds: Record<TheoryDifficultyId, { badge: string; description: string; questions: QuestionSeed[] }> }> = [
  {
    id: "fretboard-root",
    title: "指板根音定位",
    subtitle: "五弦/六弦根音与右手落点",
    description: "训练 5、6 弦根音位置、和弦根音系统，以及 ghost note 应该落在哪个弦区。",
    lessonRefs: "第2、3、4、7课",
    difficultySeeds: {
      easy: {
        badge: "自然音根音",
        description: "只练 5、6 弦上的自然音根音。",
        questions: [
          q("C 在五弦", "C 在 5 弦第几品？", "品位", "3", ["3品", "五弦3品", "5弦3品"], "五弦根音", ["先找 5 弦开放音 A，再按半音往上数。"], ["5 弦 3 品是 C，这是课堂里最常用的 C 根音锚点。"]),
          q("C 在六弦", "C 在 6 弦第几品？", "品位", "8", ["8品", "六弦8品", "6弦8品"], "六弦根音", ["6 弦开放音是 E，往上数到 C。"], ["6 弦 8 品是 C，适合 E shape / 六弦根音系统。"]),
          q("G 在六弦", "G 在 6 弦第几品？", "品位", "3", ["3品", "六弦3品", "6弦3品"], "六弦根音", ["6 弦开放音 E，1 品 F，3 品 G。"], ["G 的六弦根音在 3 品。"]),
        ],
      },
      medium: {
        badge: "常见升降根音",
        description: "加入 Bb、Eb、F#、C#、Ab 等课堂常见根音。",
        questions: [
          q("Bb 在五弦", "Bb 在 5 弦第几品？", "品位", "1", ["1品", "五弦1品", "5弦1品", "A#"], "降号根音", ["5 弦开放音是 A，升高 1 个半音就是 Bb/A#。"], ["5 弦 1 品可写 Bb，也可听成 A#；在降号 key 里优先写 Bb。"]),
          q("Eb 在五弦", "Eb 在 5 弦第几品？", "品位", "6", ["6品", "五弦6品", "5弦6品", "D#"], "降号根音", ["C 在 5 弦 3 品，再往上 3 个半音到 Eb。"], ["5 弦 6 品是 Eb/D#，课堂借用和弦常会用到 Ebmaj7。"]),
          q("Ab 在六弦", "Ab 在 6 弦第几品？", "品位", "4", ["4品", "六弦4品", "6弦4品", "G#"], "降号根音", ["6 弦 3 品是 G，4 品是 Ab/G#。"], ["6 弦 4 品可作为 Ab 根音，也常写成 G#。"]),
        ],
      },
      hard: {
        badge: "品位反推音名",
        description: "给出 5、6 弦品位，反向说音名。",
        questions: [
          q("6弦8品", "6 弦 8 品是什么音？", "音名", "C", ["c"], "反向定位", ["6 弦开放音 E，12 品回到 E。"], ["6 弦 8 品是 C。"]),
          q("5弦6品", "5 弦 6 品是什么音？", "音名", "Eb", ["eb", "D#", "d#"], "反向定位", ["5 弦 3 品是 C，6 品是 Eb。"], ["5 弦 6 品是 Eb，也可等音写作 D#。"]),
          q("6弦4品", "6 弦 4 品是什么音？", "音名", "Ab", ["ab", "G#", "g#"], "反向定位", ["6 弦 3 品 G，4 品 Ab/G#。"], ["6 弦 4 品是 Ab/G#。"]),
        ],
      },
      hell: {
        badge: "根音系统 + 右手",
        description: "给和弦名，同时判断根音系统、品位与 ghost note 落点。",
        questions: [
          q("Cmaj7 六弦系统", "Cmaj7 如果用六弦根音系统，根音在哪？ghost note 更自然拍哪根弦？", "根音与落点", "6弦8品，拍6弦", ["六弦8品拍六弦", "6弦8品拍6弦", "8品6弦"], "右手落点", ["先找根音，再决定右手落点。"], ["六弦根音 C 在 8 品，所以 ghost note 更自然落在六弦区域。"]),
          q("Dm9 五弦系统", "Dm9 常用五弦根音系统时，根音在哪？ghost note 更自然拍哪根弦？", "根音与落点", "5弦5品，拍5弦", ["五弦5品拍五弦", "5弦5品拍5弦"], "右手落点", ["D 在 5 弦 5 品。"], ["五弦根音 D 在 5 品，所以 ghost note 更自然落在五弦区域。"]),
        ],
      },
    },
  },
  {
    id: "diatonic-chords",
    title: "C大调顺阶和弦速算",
    subtitle: "一四大，二三六小，五属，七半减",
    description: "把 C 大调的三和弦、七和弦和级数关系练成自动反应。",
    lessonRefs: "第2、3课",
    difficultySeeds: {
      easy: {
        badge: "C 大调三和弦",
        description: "按级数写 C 大调顺阶三和弦。",
        questions: [
          q("2级三和弦", "C 大调 2 级三和弦是什么？", "和弦", "Dm", ["D-", "Dmin", "D minor"], "三和弦级数", ["C 大调音阶第 2 个音是 D。"], ["C 大调三和弦顺序是 C Dm Em F G Am Bdim，所以 2 级是 Dm。"]),
          q("7级三和弦", "C 大调 7 级三和弦是什么？", "和弦", "Bdim", ["B°", "B diminished"], "三和弦级数", ["第 7 级是 B，质量是 diminished。"], ["C 大调 7 级三和弦是 Bdim。"]),
        ],
      },
      medium: {
        badge: "C 大调七和弦",
        description: "按级数写 C 大调顺阶七和弦。",
        questions: [
          q("5级七和弦", "C 大调 5 级七和弦是什么？", "和弦", "G7", ["Gdom7"], "七和弦级数", ["口诀：五属。"], ["C 大调 5 级是 G，五级七和弦是属七，所以是 G7。"]),
          q("6级七和弦", "C 大调 6 级七和弦是什么？", "和弦", "Am7", ["A-7", "Amin7"], "七和弦级数", ["口诀：二三六小。"], ["C 大调 6 级是 A，质量是 m7，所以是 Am7。"]),
        ],
      },
      hard: {
        badge: "级数与和弦互推",
        description: "混合三和弦、七和弦、和弦反推级数。",
        questions: [
          q("Am7 级数", "Am7 在 C 大调里是几级七和弦？", "级数", "6级小七", ["6", "六级", "6级", "VI", "vim7"], "反推级数", ["A 是 C 大调第 6 个音。"], ["Am7 是 C 大调的 6 级小七。"]),
          q("Fmaj7 级数", "Fmaj7 在 C 大调里是几级七和弦？", "级数", "4级大七", ["4", "四级", "4级", "IV", "IVmaj7"], "反推级数", ["口诀：一四大。"], ["Fmaj7 是 C 大调的 4 级大七。"]),
        ],
      },
      hell: {
        badge: "小调 ii-V-i 嵌入",
        description: "判断 Bm7b5-E7-Am7 在 C 大调中的级数写法。",
        questions: [
          q("Bm7b5-E7-Am7", "Bm7b5 - E7 - Am7 在 C 大调级数里应写成什么？", "级数进行", "7ø - 37 - 6m7", ["7ø-37-6m7", "7m7b5 37 6m7", "VIIø III7 VIm7"], "嵌入小调", ["E7 不是 C 大调顺阶 iii，它是导向 Am 的属七。"], ["在 C 大调视角下它是 7ø - 37 - 6m7；功能上像 A 小调 iiø - V7 - i。"]),
        ],
      },
    },
  },
  {
    id: "chord-symbols",
    title: "和弦标记识别",
    subtitle: "看到符号先判断和弦类型",
    description: "训练 maj7、m7、7、m7b5、dim、sus 等常见标记，避免把 C7 看成 Cmaj7。",
    lessonRefs: "第2、3、4、5课",
    difficultySeeds: {
      easy: {
        badge: "三和弦符号",
        description: "识别大三、小三、减三、增三。",
        questions: [
          q("Cm", "Cm 表示什么和弦类型？", "类型", "小三和弦", ["minor", "小三", "m"], "三和弦标记", ["m/min/- 都和 minor 相关。"], ["Cm 表示 C 小三和弦。"]),
          q("Caug", "Caug 表示什么和弦类型？", "类型", "增三和弦", ["aug", "增三", "+", "C+"], "三和弦标记", ["aug 是 augmented。"], ["Caug 表示 C 增三和弦。"]),
        ],
      },
      medium: {
        badge: "七和弦符号",
        description: "识别 maj7、m7、7、m7b5。",
        questions: [
          q("C7", "C7 表示大七还是属七？", "类型", "属七", ["dominant7", "dom7", "属七和弦"], "七和弦标记", ["只有根音 + 7 默认是属七。"], ["C7 是 C 属七，不是 Cmaj7。"]),
          q("Cø7", "Cø7 / Cm7b5 表示什么？", "类型", "半减七", ["m7b5", "半减", "half diminished"], "七和弦标记", ["ø 是 half-diminished。"], ["Cø7 和 Cm7b5 都表示 C 半减七。"]),
        ],
      },
      hard: {
        badge: "延伸与 sus",
        description: "识别九、十三、sus、b13。",
        questions: [
          q("G13sus4", "G13sus4 里的 sus4 表示什么？", "含义", "三音被四音替代", ["3被4替代", "四音替代三音", "没有三音"], "sus 标记", ["sus 通常表示 suspended。"], ["G13sus4 中第三音 B 被第四音 C 替代。"]),
          q("G7(b13)", "G7(b13) 里的 b13 是什么？", "含义", "降十三音", ["b13", "降13", "降十三", "Eb"], "变化延伸音", ["G 的 13 是 E，b13 是 Eb。"], ["G7(b13) 表示 G 属七上加入降十三音 Eb。"]),
        ],
      },
      hell: {
        badge: "多写法互认",
        description: "同一个和弦类型的多个标记互相识别。",
        questions: [
          q("Bø7", "Bø7 的等价常见写法是什么？", "写法", "Bm7b5", ["Bmin7b5", "B-7b5", "B half diminished"], "多写法", ["ø7 就是 m7b5。"], ["Bø7、Bm7b5、Bmin7b5 都是 B 半减七。"]),
          q("C△7", "C△7 / CM7 / Cmaj7 都表示什么？", "类型", "大七和弦", ["maj7", "major7", "大七"], "多写法", ["三角符号常表示 major。"], ["C△7、CM7、Cmaj7 都是 C 大七。"]),
        ],
      },
    },
  },
  {
    id: "extensions-omissions",
    title: "延伸音与省略音判断",
    subtitle: "9、11、13 与课堂 voicing",
    description: "专门巩固 Dm9、G13、G13sus4、G7(b13) 里的延伸音、省略音和声部解决。",
    lessonRefs: "第4课",
    difficultySeeds: {
      easy: {
        badge: "延伸音来源",
        description: "只问 9、11、13 分别来自哪个基本级数。",
        questions: [
          q("9 的来源", "9 音来自哪个级数？", "级数", "2", ["2级", "二级", "2音"], "延伸音来源", ["超过八度后，2 变成 9。"], ["2 -> 9。"]),
          q("13 的来源", "13 音来自哪个级数？", "级数", "6", ["6级", "六级", "6音"], "延伸音来源", ["超过八度后，6 变成 13。"], ["6 -> 13。"]),
        ],
      },
      medium: {
        badge: "写完整结构",
        description: "给和弦名，写出核心结构。",
        questions: [
          q("Dm9", "Dm9 的完整和弦音是什么？", "音名", "D F A C E", ["D,F,A,C,E", "D F A C E"], "九和弦结构", ["Dm9 = Dm7 + 9。"], ["Dm9 完整结构是 D F A C E；课堂 D F C E 是省略五音 A。"]),
          q("G13", "G13 的核心完整结构至少要包含哪些身份音？", "音名", "G B F E", ["G B D F E", "G B F E", "G,F,B,E"], "十三和弦结构", ["属十三要有 3、b7、13。"], ["G13 的身份音是 G、B、F、E；五音 D 可省略。"]),
        ],
      },
      hard: {
        badge: "课堂 voicing 省略音",
        description: "给课堂按法音，判断省略了哪个音。",
        questions: [
          q("Dm9(no5)", "课堂 Dm9 写成 D F C E，省略了哪个音？", "省略音", "A", ["五音A", "5音A", "A音"], "省略五音", ["Dm9 完整是 D F A C E。"], ["D F C E 是 Dm9(no5)，省略五音 A。"]),
          q("G13(no5)", "课堂 G13 写成 G F B E，省略了哪个音？", "省略音", "D", ["五音D", "5音D", "D音"], "省略五音", ["G13 完整包含 1 3 5 b7 13。"], ["G F B E 是 G13(no5)，省略五音 D。"]),
        ],
      },
      hell: {
        badge: "声部解决",
        description: "给两个和弦，判断哪个音在移动。",
        questions: [
          q("G13sus4 到 G13", "G13sus4 -> G13 中哪个音解决到哪个音？", "声部", "C -> B", ["C到B", "C-B", "4到3", "sus4到3"], "sus 解决", ["sus4 的 C 回到第三音 B。"], ["G13sus4 到 G13 是 C -> B。"]),
          q("G13 到 G7(b13)", "G13 -> G7(b13) 中哪个音下降？", "声部", "E -> Eb", ["E到Eb", "E-Eb", "13到b13"], "变化延伸音", ["G 的 13 是 E，b13 是 Eb。"], ["G13 到 G7(b13) 是 E -> Eb。"]),
        ],
      },
    },
  },
  {
    id: "progression-transpose",
    title: "级数进行转调",
    subtitle: "把 1-6-2-5 落到具体 key",
    description: "训练把级数谱翻译成真实和弦名，避免只会移动 shape 却写错升降号。",
    lessonRefs: "第3、4、7课",
    difficultySeeds: {
      easy: {
        badge: "C 大调级数",
        description: "先在 C 大调内练级数和七和弦属性。",
        questions: [
          q("C 的 1-6-2-5", "C 大调 1-6-2-5 七和弦是什么？", "和弦进行", "Cmaj7 Am7 Dm7 G7", ["Cmaj7-Am7-Dm7-G7", "Cmaj7 Am7 Dm7 G7"], "级数转和弦", ["C 大调无升降号。"], ["C 的 1-6-2-5 是 Cmaj7 Am7 Dm7 G7。"]),
          q("C 的 ii-V-I", "C 大调 ii-V-I 是什么？", "和弦进行", "Dm7 G7 Cmaj7", ["Dm7-G7-Cmaj7"], "ii-V-I", ["ii 是 Dm7，V 是 G7，I 是 Cmaj7。"], ["C 大调 ii-V-I = Dm7 G7 Cmaj7。"]),
        ],
      },
      medium: {
        badge: "常见 key",
        description: "转到 G、D、F、Bb 等常见 key。",
        questions: [
          q("Bb 的 1-6-2-5", "Bb 大调 1-6-2-5 七和弦是什么？", "和弦进行", "Bbmaj7 Gm7 Cm7 F7", ["Bbmaj7-Gm7-Cm7-F7"], "级数转调", ["Bb 大调音阶含 Bb、Eb。"], ["Bb 的 1-6-2-5 是 Bbmaj7 Gm7 Cm7 F7。"]),
          q("D 的 ii-V-I", "D 大调 ii-V-I 是什么？", "和弦进行", "Em7 A7 Dmaj7", ["Em7-A7-Dmaj7"], "ii-V-I", ["D 大调 ii 是 E，V 是 A。"], ["D 大调 ii-V-I = Em7 A7 Dmaj7。"]),
        ],
      },
      hard: {
        badge: "升降号较多 key",
        description: "练 A、E、Ab、Db 等更容易拼错的 key。",
        questions: [
          q("A 的 1-6-2-5", "A 大调 1-6-2-5 七和弦是什么？", "和弦进行", "Amaj7 F#m7 Bm7 E7", ["Amaj7-F#m7-Bm7-E7"], "级数转调", ["A 大调有 F# C# G#。"], ["A 的 1-6-2-5 是 Amaj7 F#m7 Bm7 E7。"]),
          q("Ab 的 ii-V-I", "Ab 大调 ii-V-I 是什么？", "和弦进行", "Bbm7 Eb7 Abmaj7", ["Bbm7-Eb7-Abmaj7"], "ii-V-I", ["Ab 大调 ii 是 Bb，V 是 Eb。"], ["Ab 大调 ii-V-I = Bbm7 Eb7 Abmaj7。"]),
        ],
      },
      hell: {
        badge: "反推 key 与级数",
        description: "给具体和弦，反推 key 和级数。",
        questions: [
          q("Amaj7 F#m7 Bm7 E7", "Amaj7 F#m7 Bm7 E7 是哪个 key 的什么级数进行？", "key 与级数", "A大调 1-6-2-5", ["A 1-6-2-5", "A大调1-6-2-5"], "反推级数", ["看第一个大七和最后的 E7。"], ["这是 A 大调 1-6-2-5。"]),
          q("Bbm7 Eb7 Abmaj7", "Bbm7 Eb7 Abmaj7 是哪个 key 的什么进行？", "key 与级数", "Ab大调 ii-V-I", ["Ab ii-V-I", "Ab大调2-5-1"], "反推级数", ["Eb7 强烈指向 Abmaj7。"], ["这是 Ab 大调 ii-V-I。"]),
        ],
      },
    },
  },
  {
    id: "key-signatures",
    title: "调号与五度圈速算",
    subtitle: "升降号顺序与关系小调",
    description: "训练 key、调号、五度圈和关系小调，解决会移动 shape 但写不对 key 的问题。",
    lessonRefs: "第7课",
    difficultySeeds: {
      easy: {
        badge: "基础调号",
        description: "C、G、D、F、Bb 等入门 key。",
        questions: [
          q("G major 调号", "G major 有哪些升号？", "调号", "F#", ["F♯", "升F", "一个升号F#"], "升号调", ["升号顺序从 F 开始。"], ["G major 是 1 个升号：F#。"]),
          q("Bb major 调号", "Bb major 有哪些降号？", "调号", "Bb Eb", ["Bb,Eb", "B♭ E♭", "降B降E"], "降号调", ["降号顺序 B E A D G C F。"], ["Bb major 有两个降号：Bb Eb。"]),
        ],
      },
      medium: {
        badge: "中等调号",
        description: "A、E、Eb、Ab 等常见但更容易错的 key。",
        questions: [
          q("A major 调号", "A major 有哪些升号？", "调号", "F# C# G#", ["F# C# G#", "F♯ C♯ G♯"], "升号调", ["A 是升号调第 3 个。"], ["A major 有 F# C# G#。"]),
          q("Ab major 调号", "Ab major 有哪些降号？", "调号", "Bb Eb Ab Db", ["Bb Eb Ab Db", "B♭ E♭ A♭ D♭"], "降号调", ["Ab 是降号调第 4 个。"], ["Ab major 有 Bb Eb Ab Db。"]),
        ],
      },
      hard: {
        badge: "复杂调号",
        description: "B、F#、Db、Gb 等升降号较多的 key。",
        questions: [
          q("B major 调号", "B major 有哪些升号？", "调号", "F# C# G# D# A#", ["F# C# G# D# A#"], "升号调", ["B 是升号调第 5 个。"], ["B major 有 F# C# G# D# A#。"]),
          q("Db major 调号", "Db major 有哪些降号？", "调号", "Bb Eb Ab Db Gb", ["Bb Eb Ab Db Gb"], "降号调", ["Db 是降号调第 5 个。"], ["Db major 有 Bb Eb Ab Db Gb。"]),
        ],
      },
      hell: {
        badge: "反推与关系小调",
        description: "给调号或关系小调，反推大调并保证拼写正确。",
        questions: [
          q("A major 关系小调", "A major 的关系小调是什么？", "小调", "F# minor", ["F#m", "F#minor", "F#小调"], "关系大小调", ["大调第 6 级是关系小调。"], ["A major 的关系小调是 F# minor，不是 Gb minor。"]),
          q("F# C# G#", "调号 F# C# G# 对应哪个大调？", "key", "A major", ["A", "A大调"], "调号反推", ["三个升号对应 A。"], ["F# C# G# 是 A major 的调号。"]),
        ],
      },
    },
  },
  {
    id: "relative-pentatonic",
    title: "关系大小调与五声音阶",
    subtitle: "同一批音，不同中心",
    description: "训练关系大小调、同主音大小调，以及大小调五声音阶的音名和中心感。",
    lessonRefs: "第5、7课",
    difficultySeeds: {
      easy: {
        badge: "常见关系大小调",
        description: "C/A、G/E、F/D 等关系大小调。",
        questions: [
          q("G 的关系小调", "G major 的关系小调是什么？", "小调", "E minor", ["Em", "E小调"], "关系大小调", ["大调第 6 级是关系小调。"], ["G major 的关系小调是 E minor。"]),
          q("E minor 关系大调", "E minor 的关系大调是什么？", "大调", "G major", ["G", "G大调"], "关系大小调", ["小调上方小三度找关系大调。"], ["E minor 的关系大调是 G major。"]),
        ],
      },
      medium: {
        badge: "自然音 key 五声",
        description: "写自然音 key 的大/小调五声音阶。",
        questions: [
          q("E 小调五声", "E minor pentatonic 是哪五个音？", "音名", "E G A B D", ["E,G,A,B,D"], "小调五声", ["公式：1 b3 4 5 b7。"], ["E 小调五声是 E G A B D。"]),
          q("G 大调五声", "G major pentatonic 是哪五个音？", "音名", "G A B D E", ["G,A,B,D,E"], "大调五声", ["公式：1 2 3 5 6。"], ["G 大调五声是 G A B D E。"]),
        ],
      },
      hard: {
        badge: "带升降号 key",
        description: "加入 A/F#、Bb/G 等带升降号关系。",
        questions: [
          q("A 的关系小调", "A major 的关系小调是什么？", "小调", "F# minor", ["F#m", "F#小调"], "关系大小调", ["A major 有 F#，不要写 Gb。"], ["A major 的关系小调是 F# minor。"]),
          q("Bb 大调五声", "Bb major pentatonic 是哪五个音？", "音名", "Bb C D F G", ["Bb,C,D,F,G", "B♭ C D F G"], "大调五声", ["大调五声公式 1 2 3 5 6。"], ["Bb 大调五声是 Bb C D F G。"]),
        ],
      },
      hell: {
        badge: "五音反推中心",
        description: "给五个音，判断可能的大调五声和小调五声中心。",
        questions: [
          q("E G A B D", "E G A B D 可以是哪组关系大小调五声？", "中心", "E minor / G major", ["Em/G", "E小调/G大调", "E minor G major"], "五声中心", ["同一批音，中心不同。"], ["E G A B D 是 E 小调五声，也可看作 G 大调五声。"]),
          q("A C D E G", "A C D E G 可以是哪组关系大小调五声？", "中心", "A minor / C major", ["Am/C", "A小调/C大调", "A minor C major"], "五声中心", ["A 小调五声的关系大调是 C。"], ["A C D E G 是 A 小调五声，也可看作 C 大调五声。"]),
        ],
      },
    },
  },
  {
    id: "minor-function",
    title: "自然小调与和声小调功能",
    subtitle: "V7 回 i 与减七替代",
    description: "理解和声小调为何升高 7 级，以及 E7/G#°7 为什么更想回 Am。",
    lessonRefs: "第5、6课",
    difficultySeeds: {
      easy: {
        badge: "音阶差异",
        description: "对比 A 自然小调与 A 和声小调。",
        questions: [
          q("A自然小调", "A 自然小调是哪七个音？", "音名", "A B C D E F G", ["A,B,C,D,E,F,G"], "自然小调", ["A 自然小调无升降号。"], ["A 自然小调是 A B C D E F G。"]),
          q("A和声小调", "A 和声小调是哪七个音？", "音名", "A B C D E F G#", ["A,B,C,D,E,F,G#"], "和声小调", ["自然小调 b7 升高为 7。"], ["A 和声小调是 A B C D E F G#。"]),
        ],
      },
      medium: {
        badge: "v7 / V7 / vii°7",
        description: "写 A 小调里的 v7、V7、vii°7。",
        questions: [
          q("A小调 V7", "A 和声小调里的 V7 是什么？", "和弦", "E7", ["E dominant7", "E属七"], "小调属功能", ["A 的五级是 E。"], ["A 和声小调把 G 升成 G#，所以 V7 是 E7。"]),
          q("A小调 vii°7", "A 和声小调里的 vii°7 是什么？", "和弦", "G#°7", ["G#dim7", "G# diminished7"], "导音减七", ["导音是 G#。"], ["A 和声小调 vii°7 是 G#°7。"]),
        ],
      },
      hard: {
        badge: "换小调",
        description: "换到 Dm、Em、Cm 等小调。",
        questions: [
          q("D小调 V7", "D harmonic minor 的 V7 是什么？", "和弦", "A7", ["A属七"], "小调属功能", ["D 的五级是 A，和声小调升 C#。"], ["D 小调的 V7 是 A7。"]),
          q("E小调 V7", "E harmonic minor 的 V7 是什么？", "和弦", "B7", ["B属七"], "小调属功能", ["E 的五级是 B，和声小调升 D#。"], ["E 小调的 V7 是 B7。"]),
        ],
      },
      hell: {
        badge: "减七替代",
        description: "由减七判断它是哪一个属七 b9 的无根形式。",
        questions: [
          q("G#°7 功能", "G#°7 可以理解成哪个属七 b9 的无根形式？", "无根属和弦", "E7(b9)", ["E7b9", "rootless E7b9", "E属七降九"], "减七替代", ["E7(b9)=E G# B D F，去掉 E。"], ["G#°7 = G# B D F，可理解为 rootless E7(b9)。"]),
          q("C#°7 功能", "C#°7 导向 Dm 时，可理解成哪个属七 b9 的无根形式？", "无根属和弦", "A7(b9)", ["A7b9", "rootless A7b9"], "减七替代", ["A7(b9)=A C# E G Bb，去掉 A。"], ["C#°7 可理解为 rootless A7(b9)，导向 Dm。"]),
        ],
      },
    },
  },
  {
    id: "borrowed-chords",
    title: "借用和弦判断",
    subtitle: "Key 是中心，不是监狱",
    description: "判断和弦来自 C major 还是借自 C minor，理解同主音借用的颜色。",
    lessonRefs: "第4课",
    difficultySeeds: {
      easy: {
        badge: "C 内外判断",
        description: "判断和弦是否属于 C major。",
        questions: [
          q("Ebmaj7", "Ebmaj7 属于 C major 顺阶和弦吗？", "判断", "不属于", ["不是", "否", "不在C大调"], "C 内外", ["C major 没有 Eb。"], ["Ebmaj7 不属于 C major，常可借自 C minor。"], ["属于", "不属于"]),
          q("Fmaj7", "Fmaj7 属于 C major 顺阶和弦吗？", "判断", "属于", ["是", "属于", "在C大调"], "C 内外", ["C 大调 4 级是 Fmaj7。"], ["Fmaj7 属于 C major。"], ["属于", "不属于"]),
        ],
      },
      medium: {
        badge: "C minor 借用",
        description: "识别 bIIImaj7、bVImaj7、bVII7。",
        questions: [
          q("bIIImaj7", "C minor 借来的 bIIImaj7 是哪个和弦？", "和弦", "Ebmaj7", ["Eb△7", "EbM7"], "借用级数", ["C 的 b3 是 Eb。"], ["C minor 的 bIIImaj7 是 Ebmaj7。"]),
          q("bVImaj7", "C minor 借来的 bVImaj7 是哪个和弦？", "和弦", "Abmaj7", ["Ab△7", "AbM7"], "借用级数", ["C 的 b6 是 Ab。"], ["C minor 的 bVImaj7 是 Abmaj7。"]),
        ],
      },
      hard: {
        badge: "进行标注",
        description: "给课堂进行，标出借用和弦。",
        questions: [
          q("Cmaj7 Ebmaj7 Abmaj7 Gm7", "Cmaj7 Ebmaj7 Abmaj7 Gm7 中哪些是从 C minor 借来的？", "借用和弦", "Ebmaj7 Abmaj7 Gm7", ["Ebmaj7,Abmaj7,Gm7"], "借用进行", ["Cmaj7 是主中心；其它来自 C minor。"], ["Ebmaj7、Abmaj7、Gm7 都可从 C minor 借来。"]),
        ],
      },
      hell: {
        badge: "换 key 借用",
        description: "换到 G、F、Bb 等 key 做同主音借用判断。",
        questions: [
          q("G 的 bVImaj7", "G major 从 G minor 借 bVImaj7，会得到哪个和弦？", "和弦", "Ebmaj7", ["Eb△7", "EbM7"], "换 key 借用", ["G 的 b6 是 Eb。"], ["G 的 bVImaj7 是 Ebmaj7。"]),
          q("F 的 bIIImaj7", "F major 从 F minor 借 bIIImaj7，会得到哪个和弦？", "和弦", "Abmaj7", ["Ab△7", "AbM7"], "换 key 借用", ["F 的 b3 是 Ab。"], ["F 的 bIIImaj7 是 Abmaj7。"]),
        ],
      },
    },
  },
  {
    id: "rhythm-grid",
    title: "16分网格与重音移位",
    subtitle: "3+3+3+3+4 回到 one",
    description: "把律动理论做成可检查的节奏脑内训练：16 分网格、重音移位、ghost note 固定位置。",
    lessonRefs: "第6、7课",
    difficultySeeds: {
      easy: {
        badge: "16 分基础",
        description: "确认一小节里有多少格，以及每拍如何数。",
        questions: [
          q("4/4 的 16 分格", "4/4 一小节有几个 16 分音符格？", "数量", "16", ["16个", "十六个"], "16 分网格", ["每拍 4 个 16 分，4 拍共 16 个。"], ["4/4 一小节有 16 个 16 分格。"]),
          q("每拍口令", "每拍四个 16 分常念成什么？", "口令", "1 e & a", ["1e&a", "one e and a", "1 e and a"], "16 分口令", ["老师希望心里有小拍子。"], ["每拍可念 1 e & a。"]),
        ],
      },
      medium: {
        badge: "重音位置判断",
        description: "给 pattern，判断是否是三音重音移位。",
        questions: [
          q("X..X..X..X....", "X..X..X..X.... 表示哪种分组？", "分组", "3+3+3+3+4", ["3 3 3 3 4", "三三三三四"], "重音移位", ["每个 X 后面两个点，前四组都是 3。"], ["这是 3+3+3+3+4。"]),
          q("三音一组", "课堂里的三音一组是三连音吗？", "判断", "不是", ["否", "不是三连音"], "概念区分", ["它是在 16 分网格里每三个格子一组。"], ["这里的三音一组不是三连音。"], ["是", "不是"]),
        ],
      },
      hard: {
        badge: "排 16 格",
        description: "用文本排出一小节重音网格。",
        questions: [
          q("排出 3+3+3+3+4", "用 X 和 . 写出 3+3+3+3+4 的 16 格重音 pattern。", "pattern", "X..X..X..X....", ["X..X..X..X....", "X.. X.. X.. X...."], "网格输入", ["X 是重音，. 是经过的 16 分格。"], ["3+3+3+3+4 可写成 X..X..X..X....。"]),
        ],
      },
      hell: {
        badge: "能否回 one",
        description: "判断错位 pattern 是否能在小节末回到 one。",
        questions: [
          q("四组三音加四格", "3+3+3+3+4 能在一小节末回到 one 吗？", "判断", "能", ["可以", "能回到one", "能"], "回 one", ["总数 16。"], ["3+3+3+3+4 正好等于 16，所以能回到下一小节 one。"], ["能", "不能"]),
          q("五组三音", "如果一小节只排 3+3+3+3+3，会不会完整回到 one？", "判断", "不能", ["不会", "不能回到one", "不能"], "回 one", ["总数只有 15。"], ["3+3+3+3+3 只有 15 格，少 1 格，不能完整回到 one。"], ["能", "不能"]),
        ],
      },
    },
  },
];

export const THEORY_CHAPTERS: TheoryChapter[] = COURSE_DEFINITIONS.map((chapter) => ({
  id: chapter.id,
  title: chapter.title,
  subtitle: chapter.subtitle,
  description: chapter.description,
  lessonRefs: chapter.lessonRefs,
  difficulties: (Object.keys(chapter.difficultySeeds) as TheoryDifficultyId[]).map((difficultyId) => ({
    id: difficultyId,
    title: DIFFICULTY_TITLES[difficultyId],
    badge: chapter.difficultySeeds[difficultyId].badge,
    description: chapter.difficultySeeds[difficultyId].description,
    questions: chapter.difficultySeeds[difficultyId].questions.map((question, index) => ({
      ...question,
      id: `${chapter.id}-${difficultyId}-${index}`,
      chapterId: chapter.id,
      difficultyId,
      acceptedAnswers: [question.expectedAnswer, ...(question.acceptedAnswers ?? [])],
    })),
  })),
}));

export function getTheoryChapter(chapterId: string): TheoryChapter {
  return THEORY_CHAPTERS.find((chapter) => chapter.id === chapterId) ?? THEORY_CHAPTERS[0];
}

export function getTheoryDifficulty(chapterId: string, difficultyId: TheoryDifficultyId): TheoryDifficultyConfig {
  const chapter = getTheoryChapter(chapterId);
  return chapter.difficulties.find((difficulty) => difficulty.id === difficultyId) ?? chapter.difficulties[0];
}

export function createRandomTheoryQuestion(config: TheoryDifficultyConfig, previous?: TheoryQuestion): TheoryQuestion {
  let question = randomItem(config.questions);
  if (previous && config.questions.length > 1 && question.id === previous.id) {
    question = randomItem(config.questions.filter((item) => item.id !== previous.id));
  }
  return question;
}

export function evaluateTheoryAnswer(question: TheoryQuestion, answer: string): TheoryEvaluationResult {
  const normalizedUserAnswer = normalizeAnswer(answer);
  const isFullyCorrect = question.acceptedAnswers.some((accepted) => answersMatch(normalizedUserAnswer, normalizeAnswer(accepted)));

  return {
    isFullyCorrect,
    expectedFinal: question.expectedAnswer,
    typeLabel: question.typeLabel,
    explanation: question.explanation,
    normalizedUserAnswer,
  };
}

function q(
  label: string,
  prompt: string,
  answerLabel: string,
  expectedAnswer: string,
  acceptedAnswers: string[] | undefined,
  typeLabel: string,
  hint: string[],
  explanation: string[],
  options?: string[],
): QuestionSeed {
  return {
    label,
    prompt,
    answerLabel,
    expectedAnswer,
    acceptedAnswers,
    typeLabel,
    hint,
    explanation,
    options,
  };
}

function normalizeAnswer(value: string): string {
  return value
    .trim()
    .replace(/♯/g, "#")
    .replace(/♭/g, "b")
    .replace(/，|、|\/|\||→|->|—|–|-/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function answersMatch(userAnswer: string, acceptedAnswer: string): boolean {
  return userAnswer === acceptedAnswer || compact(userAnswer) === compact(acceptedAnswer);
}

function compact(value: string): string {
  return value.replace(/\s+/g, "");
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
