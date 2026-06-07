# 题库逐项审校索引

本索引用于证明当前题库已按正统乐理概念逐项审查。标准答案采用通用音乐理论术语；吉他课堂口语只保留在解释或可接受输入中。

后续新增课程文档时，先判断其中的乐理点是否需要训练。需要训练的标准是：可迁移、易错、可客观判题、属于当前吉他学习主线，或是后续课程的前置能力。满足条件时，应优先补进现有分支，并同步更新本索引。

## 审校来源

- Open Music Theory: Intervals and dyads  
  https://open-musictheory.github.io/docs/fundamentals/intervals/
- Open Music Theory: Roman Numerals and SATB Chord Construction  
  https://pressbooks.nebraska.edu/openmusictheory/chapter/roman-numerals/
- Open Music Theory: Seventh Chords  
  https://viva.pressbooks.pub/openmusictheory/chapter/seventh-chords/
- Open Music Theory: Chord Symbols  
  https://viva.pressbooks.pub/openmusictheory/chapter/chord-symbols/
- Open Music Theory: Applied Chords  
  https://viva.pressbooks.pub/openmusictheorycopy/chapter/applied-chords/
- Open Music Theory: Key Signatures  
  https://openmusictheory.github.io/keySignatures.html
- Open Music Theory: Modal Mixture  
  https://openmusictheory.github.io/modalMixture.html
- 课程历史：第 1-7 课吉他乐理、指板、和弦、调号、律动记录

## 随机生成题

| 模块 | 覆盖范围 | 审校结论 |
| --- | --- | --- |
| 音程距离速算 | P1、m2、M2、m3、M3、P4、A4、d5、P5、m6、M6、m7、M7、P8 | 度数按字母，性质按半音；A4/d5 区分等音异名；B -> E# 这类题首句解释不能直接写成 F；基础协和分类保留纯四度为完全协和，并在反馈说明严格声部写作语境。 |
| 和弦音构成速算 | maj、m、dim、aug、maj7、7、m7、m7b5、maj9、9、m9 | 按字母骨架叠三度，再按公式调整音程；输入框按三/七/九和弦动态提示 1-3-5-7-9 顺序，避免转位顺序误判；理论拼写保留 E#、B#、Fb、Cb、双升/双降，等音只作为解释，并在 D#/A# 等根音下桥接实际谱面常用的 Eb/Bb 等音记法。 |

## 静态题库审校

| 题目 label | 对应标准概念 | 结论 |
| --- | --- | --- |
| C/D/E/F/G 在五弦；A/B/F/C/G 在六弦 | 标准调弦下 5、6 弦根音定位 | 通过，简单档覆盖常用自然音锚点，并提示 +12 品同名 |
| Bb 在五弦 / Eb 在五弦 / Ab 在六弦 | 等音位置与降号调拼写 | 通过，问品位时只接受品位，不把等音名当品位答案 |
| 6弦8品 / 5弦6品 / 6弦4品 | 品位反推音名 | 通过，等音名只在反推音名题中接受 |
| Cmaj7 六弦系统 / Dm9 五弦系统 | 吉他根音系统与右手落点 | 通过，属于课程演奏技术，不伪装成通用和声概念 |
| C 大调 1-7 级三和弦 | 大调顺阶三和弦 I ii iii IV V vi vii° | 通过，由 `buildDiatonicDegreeQuestions` 参数化生成；三和弦口诀与七和弦口诀分层，不把 G 三和弦误导为 G7 |
| C 大调 1-7 级七和弦 | 大调顺阶七和弦 Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7 | 通过，由 `buildDiatonicDegreeQuestions` 参数化生成 |
| Am7 级数 / Fmaj7 级数 | 罗马数字大小写与和弦性质 | 通过，判题保留 IV/iv、vi/VI 大小写差异 |
| Bm7b5-E7-Am7 / Dm7-G7-Cmaj7 | 副属和弦 / applied chord；ii-V-I | 通过，标准写法为 viiø7 - V7/vi - vi7；同时接受 viio7、vii07、viim7b5 等可打字写法 |
| Cm / Cdim / Caug | 三和弦标记 | 通过，已改为选择题优先 |
| C7 / Cø7 / Cdim7 | 属七、半减七、减七标记 | 通过，Cdim7 与 Cm7b5 区分为不同和弦 |
| G13sus4 / G7(b13) / Cadd9 vs C9 / C6 vs C13 / Csus2 / C/E | sus、变化延伸音、add9、六和弦、slash chord | 通过 |
| Bø7 / C△7 | 和弦符号多写法 | 通过，综合档也改为选择题，避免依赖自由文本同义词匹配 |
| 9 的来源 / 11 的来源 / 13 的来源 | 延伸音 2->9、4->11、6->13 | 通过 |
| Dm9 | 九和弦完整结构 | 通过，强调 D F C E 是 Dm9(no5) |
| G13 | lead-sheet / guitar voicing 的属十三核心音 | 通过，题干已避免把核心 voicing 说成完整叠三度结构 |
| Dm9 省略辨认 / G13 省略辨认 / 属和弦自然11 | 省略五音；属和弦自然 11 与 3 音冲突 | 通过，题目标签不预先泄露 no5，提交后再解释 no5 写法 |
| G13sus4 到 G13 / G13 到 G7(b13) | sus 解决与 13 到 b13 的声部变化 | 通过 |
| C 大调 1-6-2-5 / ii-V-I / iii-vi-ii-V / IV-iii-ii-I / 1-6-2-5 映射 | C 大调级数进行；数字级数到罗马数字 | 通过 |
| G、D、F、Bb 的四类进行 | 常见调转调 | 通过，由 `buildProgressionQuestions` 参数化生成 |
| A、E、B、F#、Eb、Ab、Db 的四类进行 | 带升降号调转调 | 通过，由 `buildProgressionQuestions` 参数化生成 |
| 12 个常用拼写大调的 1-6-2-5 / ii-V-I 反推 | 和弦反推调与级数 | 通过，由 `buildReverseProgressionQuestions` 参数化生成 |
| C/G/D/F/Bb 调号 + 五度圈相邻调 | 基础调号与五度圈方向 | 通过，由 `buildKeySignatureQuestions` 与 `buildCircleNeighborQuestions` 参数化生成，题卡提供五度圈速查图 |
| A/E/Eb/Ab 调号与反推 | 中等调号 | 通过，由标准调号表生成，提示包含“最后一个升号+半音=调名”和“倒数第二个降号=调名” |
| B/F#/C#/Db/Gb/Cb 调号与反推 | 复杂调号 | 通过，覆盖升号多、降号多的大调拼写 |
| C/G/D/F/Bb/Eb/A/E/Ab/Db 关系小调 + 12 个常用调号反推 | 关系小调与调号反推 | 通过，由 `buildRelativeMinorQuestions` 与 `buildReverseKeySignatureQuestions` 参数化生成 |
| C/G/F 的关系小调 + A/E/D minor 的关系大调 | 关系大小调 | 通过，由 `buildRelativeMinorQuestions` 与 `buildRelativeMajorQuestions` 参数化生成 |
| A/E/D 小调五声 + C/G/F 大调五声 | 小调五声与大调五声公式 | 通过，由公式生成，题卡保留 E minor / G major 与 A minor / C major 共用五声盒子 |
| A/E/Bb/Eb 大调关系小调与五声 + F#/C#/G/C 小调五声 | 带升降号调的关系小调与五声音阶 | 通过，Bb 大调五声题卡连接 G minor / Bb major 共用盒子 |
| C/G/F/Bb/Eb/A 的五声集合中心反推 | 同音集合下的大小调五声中心 | 通过，由 `buildPentatonicCenterQuestions` 参数化生成，题卡标出小调中心与关系大调中心 |
| A/D/E 自然小调与和声小调 | 自然小调与和声小调音阶差异 | 通过，由 `buildMinorScaleQuestions` 参数化生成 |
| A小调 v7 / A小调 V7 / A小调 vii°7 / 为何升7级 | 自然小调 v7、和声小调属七、导音减七与导音功能 | 通过，由 `buildMinorDominantQuestions` 与 `buildHarmonicMinorReasonQuestions` 生成，题卡提供 Em7->Am、E7->Am、G#°7->Am 音频对比 |
| D/E/C/G 小调的 v7 / V7 / vii°7 | 换小调后的属功能 | 通过，由小调根音参数化生成 |
| A/D/E/C/G 小调的导音减七功能 | 导音减七与省略根音的属七降九 | 通过，由 `buildLeadingToneDiminishedQuestions` 生成，反馈区区分功能和声与爵士/吉他语境 |
| Ebmaj7 / Fmaj7 | C major 内外判断 | 通过 |
| C 的 bIIImaj7 / bVImaj7 / bVII7 / iv / bVII | C major 从同主音 C minor 借用 | 通过，由 `buildBorrowedDegreeQuestions` 参数化生成，覆盖流行/摇滚高频 borrowed iv 与 bVII |
| C/G/F 的 bIII-bVI-v、IV-iv、bVII 进行 + G-B-C-Cm | 同主音小调借用进行，含 borrowed iv 与 bVII | 通过，由 `buildBorrowedProgressionQuestions` 生成，并用 `G - B - C - Cm` 作为 borrowed iv 听觉锚点 |
| G/F/Bb/Eb 的 bIIImaj7 / bVImaj7 / bVII7 / iv / bVII | 换调后的同主音借用 | 通过，由 key + borrowed degree 参数化生成 |
| 4/4 的 16 分格 / 每拍口令 | 十六分音符细分 | 通过 |
| X..X..X..X..X... | 3+3+3+3+4 的 16 格重音移位 | 通过，长度 16，重音在 1、4、7、10、13 |
| 三个十六分一组 | 十六分重音移位与三连音区别 | 通过 |
| 排出 3+3+3+3+4 / 排出 3+3+2+3+3+2 / 排出 6+6+4 / 第2格起 3+3+3+3+4 / ghost note 落点 | 16 格 pattern 输入；起点偏移；右手弦区 | 通过，pattern 题已接入 16 步 step sequencer 与音频播放；补充五弦根音系统的 ghost note 弦区 |
| 四组三音加四格 / 五组三音 | 是否回到下一小节第一拍 | 通过 |

## 自动护栏

`npm run check:theory` 会检查：

- 出题器必须保留错题优先回炉逻辑、上一题避重逻辑、最近题避让逻辑、本题计时、每题用时记录、平均用时和最快速答统计。
- 最近题避让必须合并已提交历史和本轮已展示题，防止用户连续点击“下一题”时在小题池里反复看到同一题。
- 每个可进入章节必须保留 30 秒知识卡，内容包含规则、例子和自查标准。
- 源码题库不出现“地狱”“37”“rootless”等非标准展示词。
- `3+3+3+3+4` 的 pattern 必须是 16 格。
- 额外节奏 pattern 如 `3+3+2+3+3+2`、`6+6+4`、起点偏移必须保持 16 格。
- 节奏 pattern 题必须保留 16 步点击网格、播放能力与跟拍检测。
- 标准副属和弦、导音减七、同主音借用、纯四度说明、罗马数字大小写保护必须存在。
- 借用和弦必须保留 `buildBorrowedDegreeQuestions`、`buildBorrowedProgressionQuestions` 与 `getBorrowedChord`，避免退回 C 调静态小题池。
- 顺阶和弦、级数转调、调号与五度圈、关系大小调与五声、小调功能必须保留参数化生成函数，避免回到静态小题池。
- 小调功能章节必须保留 v7/V7/vii°7 到 i 的音频对比。
- 关系大小调五声题必须保留共用五声盒子指板图，帮助学生把中心感落到吉他指板。
