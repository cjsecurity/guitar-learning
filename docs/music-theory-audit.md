# 乐理题库术语审校说明

本项目题库优先使用正统乐理术语，课堂口语只作为辅助解释，不作为标准答案名称。

主要外部审校依据：

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

课程内部依据来自 7 节课历史记录；若课堂口语与正统术语并存，页面标准答案采用正统术语，解释区再补课堂语境。

## 新文档进入题库流程

后续如果用户发送新的课程文档、逐字稿、截图或课堂整理，需要先判断其中是否包含可训练的乐理知识。不是所有知识都要进题库；只有满足下面至少一项，才应转成练习：

- 它是可迁移规则：可以换根音、换调、换把位、换节奏 pattern 继续使用。
- 它容易错：老师反复纠正、学生常混淆，或错了会影响后续学习。
- 它能被客观判题：可以用填空、选择、排序、点击、音频对比、节奏网格等形式检查。
- 它和当前课程主线有关：音程、和弦构成、和弦标记、级数、调号、大小调、五声音阶、小调功能、借用和弦、指板根音、节奏细分。
- 它是过关前置能力：不会这个点，就不能可靠理解后续课程。

如果需要训练，优先补进现有分支；只有现有分支放不下时，才新增课程分支。新增或修改题目时必须同步更新本审校文档和 `docs/question-bank-review.md`，并运行：

```bash
npm run check:theory
npm run build
```

新增题目的显示名称、标准答案和反馈文案必须先对照正统乐理术语；课堂口语可以保留在解释区，但不能取代标准概念。

## 音程

- 音程度数先看字母/谱表位置，升降号不改变“几度”。
- 音程性质使用标准分类：纯、大、小、增、减。
- 本课程基础阶段把纯一度、纯四度、纯五度、八度归入完全协和；大小三度、大小六度归入不完全协和；二度、七度、增四/减五归入不协和。
- 若后续进入严格对位或四部和声，纯四度在低音上方的处理可单独开章节讲语境差异。

## 和弦标记

- `C7` 是属七和弦，不是大七和弦。
- `Cmaj7`、`CM7`、`C△7` 表示大七和弦。
- `Cm7`、`Cmin7`、`C-7` 表示小七和弦。
- `Cø7` 与 `Cm7b5` 表示半减七和弦。
- `sus4` 表示三音被四音替代。

## 延伸和弦与省略音

- 9、11、13 是叠三度超过七音后的延伸音；2、4、6 是它们的单八度来源。
- 在 lead-sheet / jazz / guitar voicing 语境中，十三和弦常用根音、3音、b7、13音表达功能与色彩。
- 五音常可省略；十三和弦中的自然 11 常因与大三音冲突而省略。
- 题目必须区分“理论完整结构”和“实际伴奏 voicing”，不能把省略写法说成完整叠三度结构。

## 级数与功能

- 大调顺阶三和弦标准级数为 I、ii、iii、IV、V、vi、vii°。
- 大调顺阶七和弦标准级数为 Imaj7、ii7、iii7、IVmaj7、V7、vi7、viiø7。
- 罗马数字大小写代表和弦性质，`IV` 和 `iv` 不能互换；判题时必须保留罗马数字大小写。
- 副属和弦使用斜杠罗马数字，例如 `V7/vi`，不要写成 `37` 这类非标准简写。
- `Bm7b5 - E7 - Am7` 在 C 大调视角下应写作 `viiø7 - V7/vi - vi7`；若临时把 A minor 当中心听，可解释为 A 小调 `iiø7 - V7 - i7`。

## 借用和弦

- 借用和弦使用 `modal mixture / borrowed chords` 的概念：从同主音大小调或平行调式借用和弦。
- 页面上使用“同主音大小调借用”作为中文说明，避免把课堂口语当成概念名。

## 导音减七与属七降九

- `G#°7` 在 A 小调中是导音减七和弦 `vii°7`。
- 在爵士/吉他语境中，也可把 `G#°7 = G# B D F` 理解为省略根音的 `E7(b9)`。
- 题目反馈必须同时说明两种说法的语境：功能和声称“导音减七”，吉他/爵士伴奏常说“省略根音的属七降九”。

## 节奏

- `3+3+3+3+4` 描述的是十六分音符网格中的重音移位，不是三连音。
- 正确 16 格文本 pattern 是 `X..X..X..X..X...`，重音落在第 1、4、7、10、13 格。
- “回到 one”在页面中写作“回到下一小节第一拍（one）”，让课堂口语对应到正式节拍概念。
