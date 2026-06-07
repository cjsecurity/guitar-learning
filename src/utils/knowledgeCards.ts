export interface KnowledgeCardContent {
  chapterId: string;
  title: string;
  rule: string;
  example: string;
  selfCheck: string;
}

const KNOWLEDGE_CARDS: Record<string, KnowledgeCardContent> = {
  interval: {
    chapterId: "interval",
    title: "音程先数字母，再数半音",
    rule: "度数只看字母距离，性质再用半音数量判断。C 到 F# 和 C 到 Gb 声音相同，但一个按字母数到 F，是增四度；一个数到 G，是减五度。",
    example: "例：C -> E。字母 C-D-E 是三度，半音数是 4，所以是大三度；基础分类是不完全协和。",
    selfCheck: "过关标准：看到 B -> E# 时，能先说“这是四度字母”，再解释为什么不能直接写成 F。",
  },
  chord: {
    chapterId: "chord",
    title: "和弦先搭字母骨架，再补升降号",
    rule: "1、3、5、7、9 先按隔一个字母叠三度决定字母，再按和弦类型公式调整大小三、纯五、七音或九音。",
    example: "例：D 大三和弦。字母骨架是 D F A；大三公式 1 3 5 要求三音是大三度，所以 F 要升成 F#，答案是 D F# A。",
    selfCheck: "过关标准：能按 1-3-5-7-9 顺序写答案，并知道九和弦省略五音不等于五音不存在。",
  },
  "fretboard-root": {
    chapterId: "fretboard-root",
    title: "先找根音，再决定系统和右手落点",
    rule: "吉他伴奏里根音不能错。5 弦根音和 6 弦根音会决定常用和弦系统，也会影响 ghost note 更自然落在哪个弦区。",
    example: "例：Cmaj7 用六弦根音系统，C 在 6 弦 8 品；所以右手闷音更自然靠近 6 弦区域。",
    selfCheck: "过关标准：看到 6 弦 8 品能立刻说 C，并能用 3 品 G -> 5 品 A -> 7 品 B -> 8 品 C 推出来。",
  },
  "diatonic-chords": {
    chapterId: "diatonic-chords",
    title: "三和弦口诀和七和弦口诀要分开",
    rule: "C 大调三和弦是 I、ii、iii、IV、V、vi、vii°；七和弦才是 Imaj7、ii7、iii7、IVmaj7、V7、vi7、viiø7。",
    example: "例：C 大调 5 级三和弦是 G，不是 G7；5 级七和弦才是 G7。",
    selfCheck: "过关标准：看到 Bm7b5-E7-Am7，能写 viiø7 - V7/vi - vi7，也能用 viio7/viim7b5 这种可打字写法。",
  },
  "chord-symbols": {
    chapterId: "chord-symbols",
    title: "和弦符号先判断类型，不要被 7 骗到",
    rule: "C7 是属七，不是大七；Cmaj7/CM7/C△7 才是大七。Cø7/Cm7b5 是半减七，Cdim7/C°7 是减七。",
    example: "例：Cadd9 常表示 C E G D；C9 默认表示 C E G Bb D，因为 9 和弦默认带 b7。",
    selfCheck: "过关标准：能区分 Cdim7 和 Cm7b5，也能说明 C/E 是 E 在低音，不是改变和弦类型。",
  },
  "extensions-omissions": {
    chapterId: "extensions-omissions",
    title: "延伸音是 2、4、6 超过八度后的名字",
    rule: "9 来自 2，11 来自 4，13 来自 6。吉他 voicing 里可以省略五音，但要分清“省略写法”和“理论完整结构”。",
    example: "例：Dm9 完整结构是 D F A C E；课堂写 D F C E 是 Dm9(no5)，省略五音 A。",
    selfCheck: "过关标准：能解释 G13 常抓 G、B、F、E，因为它们表达根音、3 音、b7 和 13 色彩。",
  },
  "progression-transpose": {
    chapterId: "progression-transpose",
    title: "级数是模板，key 决定真实和弦名",
    rule: "1-6-2-5 在大调七和弦语境里就是 Imaj7-vi7-ii7-V7。换 key 时保留级数功能，重新拼写每个和弦。",
    example: "例：1-6-2-5 在 A 大调是 Amaj7 F#m7 Bm7 E7。",
    selfCheck: "过关标准：能从 Bbmaj7 Gm7 Cm7 F7 反推这是 Bb 大调的 1-6-2-5。",
  },
  "key-signatures": {
    chapterId: "key-signatures",
    title: "调号用五度圈速算法，不要硬背每个调",
    rule: "升号调可用“最后一个升号上行半音 = 调名”；降号调两个以上降号时，可用“倒数第二个降号 = 调名”。",
    example: "例：F# C# G# 的最后一个升号是 G#，上行半音到 A，所以是 A major。",
    selfCheck: "过关标准：能写出 Bb major 有 Bb、Eb，并能说明它在五度圈上是降号调。",
  },
  "relative-pentatonic": {
    chapterId: "relative-pentatonic",
    title: "同一批五声音，可以有两个中心",
    rule: "小调五声公式是 1 b3 4 5 b7；大调五声公式是 1 2 3 5 6。关系大小调会共用同一批音，但落点中心不同。",
    example: "例：E G A B D 是 E minor pentatonic；同一批音也可看作 G major pentatonic。",
    selfCheck: "过关标准：能在同一个 box 里指出 6 弦开放 E 是小调中心，6 弦 3 品 G 是关系大调中心。",
  },
  "minor-function": {
    chapterId: "minor-function",
    title: "和声小调升 7 级，是为了制造导音",
    rule: "自然小调的 v7 回 i 力量较弱；把第 7 级升高后形成导音，V7 -> i 的回家感会更强。",
    example: "例：A 自然小调里是 Em7 -> Am；A 和声小调升 G 到 G#，所以能形成 E7 -> Am。",
    selfCheck: "过关标准：能同时说出 G#°7 是 A 小调的导音减七，也可在吉他/爵士语境理解为省略根音的 E7(b9)。",
  },
  "borrowed-chords": {
    chapterId: "borrowed-chords",
    title: "借用和弦来自同主音大小调，不是随便外来",
    rule: "同主音大小调借用就是在同一个主音中心下，从平行小调或大调借来和弦色彩。C major 可以从 C minor 借 bIII、iv、bVI、bVII。",
    example: "例：C - F - Fm - C 里的 Fm 是 borrowed iv，来自 C minor。也可以用 Radiohead《Creep》的 G - B - C - Cm 记住这个声音：Cm 是 G major 里的 borrowed iv。",
    selfCheck: "过关标准：看到 Cmaj7 Ebmaj7 Abmaj7 Gm7 能指出借用和弦；听到或弹到 C -> Cm，也能说这是 IV -> iv 的暗色变化。",
  },
  "rhythm-grid": {
    chapterId: "rhythm-grid",
    title: "十六分网格里数重音，不要把错位当三连音",
    rule: "4/4 一小节有 16 个十六分格。3+3+3+3+4 是十六分网格里的重音移位，不是三连音。",
    example: "例：X..X..X..X..X... 的重音落在第 1、4、7、10、13 格，合计 16 格后回到下一小节 one。",
    selfCheck: "过关标准：能在 16 步网格里点出 3+3+3+3+4，也能听出它仍然回到下一小节第一拍。",
  },
};

export function getKnowledgeCard(chapterId: string): KnowledgeCardContent {
  return KNOWLEDGE_CARDS[chapterId] ?? KNOWLEDGE_CARDS.interval;
}
