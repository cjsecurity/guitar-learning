import { readFileSync } from "node:fs";
import { register } from "node:module";

register("./ts-extension-loader.mjs", import.meta.url);

const files = {
  courseTheory: readFileSync("src/utils/courseTheory.ts", "utf8"),
  musicTheory: readFileSync("src/utils/musicTheory.ts", "utf8"),
  intervalTheory: readFileSync("src/utils/intervalTheory.ts", "utf8"),
  audioEngine: readFileSync("src/utils/audioEngine.ts", "utf8"),
  app: readFileSync("src/App.tsx", "utf8"),
  quizTypes: readFileSync("src/types/quiz.ts", "utf8"),
  knowledgeCards: readFileSync("src/utils/knowledgeCards.ts", "utf8"),
  knowledgeCardComponent: readFileSync("src/components/KnowledgeCard.tsx", "utf8"),
  quizPage: readFileSync("src/components/QuizPage.tsx", "utf8"),
  quizCard: readFileSync("src/components/QuizCard.tsx", "utf8"),
  intervalQuizPage: readFileSync("src/components/IntervalQuizPage.tsx", "utf8"),
  intervalQuizCard: readFileSync("src/components/IntervalQuizCard.tsx", "utf8"),
  theoryQuizPage: readFileSync("src/components/TheoryQuizPage.tsx", "utf8"),
  theoryQuizCard: readFileSync("src/components/TheoryQuizCard.tsx", "utf8"),
  rhythmStepSequencer: readFileSync("src/components/RhythmStepSequencer.tsx", "utf8"),
  rhythmTapTrainer: readFileSync("src/components/RhythmTapTrainer.tsx", "utf8"),
  minorFunctionAudioPanel: readFileSync("src/components/MinorFunctionAudioPanel.tsx", "utf8"),
  pentatonicBoxDiagram: readFileSync("src/components/PentatonicBoxDiagram.tsx", "utf8"),
  circleOfFifthsDiagram: readFileSync("src/components/CircleOfFifthsDiagram.tsx", "utf8"),
  speedTimer: readFileSync("src/components/SpeedTimer.tsx", "utf8"),
  reviewQueue: readFileSync("src/utils/reviewQueue.ts", "utf8"),
  reviewQueueNotice: readFileSync("src/components/ReviewQueueNotice.tsx", "utf8"),
};

const source = Object.values(files).join("\n");
const failures = [];

const bannedSourceTerms = [
  ["地狱", "UI 难度名使用“综合”，不要把游戏口语当课程分级"],
  ["7ø - 37 - 6m7", "副属和弦应用标准罗马数字，例如 viiø7 - V7/vi - vi7"],
  ["rootless", "面向学生展示时使用“省略根音”，英文爵士口语只可作为可接受输入"],
  ["Key 是中心，不是监狱", "借用和弦课程使用 modal mixture / borrowed chords 的标准概念"],
  ["完整结构至少", "区分理论完整结构与实际 voicing，避免混用"],
  ["三音一组", "节奏题使用“三个十六分音符一组”，避免和三连音混淆"],
];

for (const [term, reason] of bannedSourceTerms) {
  if (source.includes(term)) {
    failures.push(`发现不推荐术语“${term}”：${reason}`);
  }
}

const requiredSnippets = [
  ["viiø7 - V7/vi - vi7", "C 大调中的 Bm7b5-E7-Am7 应使用标准罗马数字"],
  ["省略根音的 E7(b9)", "减七替代需要说明省略根音的属七降九语境"],
  ["同主音大小调借用", "借用和弦需要落到 modal mixture / borrowed chords"],
  ["纯四度", "音程协和分类需要明确纯四度"],
  ["preserveRomanCase", "罗马数字大小写必须保留"],
  ["replaceChineseNumbers", "指板弦品答案需要支持中文数字输入"],
  ["difficultyId === \"hard\"", "音程困难档应只要求完整音程名，降低四字段填写摩擦"],
  ["本题不能直接写成", "音程等音目标音反馈首句应解释为何不能改写成常见等音名"],
  ["getIntervalAudioFrequencies", "音程音频应按从根音向上数的半音距离生成目标频率"],
  ["interval.semitones / 12", "F -> D 这类回绕音名应播放为向上的大六度，而不是固定八度里的下降小三度"],
  ["目标音也会放在根音上方", "音程解释区应提示默认向上数音程，避免听感和理论答案打架"],
  ["Cdim7", "和弦标记题应区分减七和半减七"],
  ["Cadd9", "和弦标记题应区分 add9 与属九"],
  ["C6", "和弦标记题应区分 6 和 13 的语境"],
  ["Csus2", "和弦标记题应覆盖 sus2"],
  ["getSkeletonPlaceholder", "和弦骨架输入框应按三/七/九和弦动态提示 1-3-5-7-9 顺序"],
  ["getFinalNotesPlaceholder", "最终和弦音输入框应明确按 1-3-5-7-9 顺序输入，避免转位答案误判"],
  ["实际谱面常会按调性改用更易读的等音根音", "升降号九和弦出现双升/双降时，应桥接理论拼写与实用记谱"],
  ["shouldReviewOnly", "音程困难档和反向拼写题未要求填写的字段应显示为参考，不应标成正确"],
  ["status=\"reference\"", "和弦公式等系统复盘字段应显示为参考，不应假装用户答对了该字段"],
  ["Dm9 省略辨认", "省略音题目标签不应预先写 no5 泄露答案"],
  ["G13 省略辨认", "属十三省略音题目标签不应预先写 no5 泄露答案"],
  ["!isRhythmGrid && !question.options", "已有选项的理论题应隐藏自由文本输入框，避免选择题和填空题混用"],
  ["\"Bm7b5\", \"Bmaj7\", \"B7\", \"Bdim7\"", "Bø7 多写法互认应使用选择题并包含高频干扰项"],
  ["最后一个升号", "调号题应包含升号调经典速算法"],
  ["倒数第二个降号", "调号题应包含降号调经典速算法"],
  ["CircleOfFifthsDiagram", "调号章节应提供五度圈视觉辅助"],
  ["C G D A E B F# C#", "五度圈图应显示升号方向调名顺序"],
  ["C F Bb Eb Ab Db Gb Cb", "五度圈图应显示降号方向调名顺序"],
  ["最后一个升号 + 半音", "五度圈图应显示升号调反推规则"],
  ["倒数第二个降号 = 调名", "五度圈图应显示降号调反推规则"],
  ["buildMinorDominantQuestions([\"A\"])", "小调功能题应对比 A 自然小调 v7 与和声小调 V7"],
  ["borrowed iv", "借用和弦题应覆盖流行乐高频的小四级借用"],
  ["buildBorrowedDegreeQuestions", "借用和弦级数题应由 key + borrowed degree 参数化生成"],
  ["buildBorrowedProgressionQuestions", "借用和弦进行题应由 key 参数化生成"],
  ["getBorrowedChord", "借用和弦应从同主音自然小调自动拼写"],
  ["bVII 三和弦", "借用和弦题应覆盖流行/摇滚高频 bVII 三和弦"],
  ["buildBorrowedIvSongAnchorQuestion", "borrowed iv 应有歌曲级听觉锚点题"],
  ["G - B - C - Cm", "borrowed iv 应用 G - B - C - Cm 作为无歌词听觉锚点"],
  ["playRhythmPattern", "节奏网格应支持音频播放"],
  ["RhythmStepSequencer", "16 分 pattern 题应使用点击式 step sequencer"],
  ["RhythmTapTrainer", "16 分 pattern 题应提供 tap-along 跟拍检测"],
  ["跟拍检测", "节奏题应把网格训练进一步连接到身体跟拍"],
  ["TOLERANCE_MS", "跟拍检测应有明确误差容忍范围"],
  ["6+6+4", "节奏题应覆盖 3+3+3+3+4 以外的分组"],
  ["起点偏移", "节奏题应覆盖重音起点偏移"],
  ["buildDiatonicDegreeQuestions", "顺阶和弦题库应由级数生成，避免手写小题池"],
  ["buildProgressionQuestions", "级数转调题库应由 key + progression 参数化生成"],
  ["KEY_SIGNATURES", "调号题库应由标准大调调号表生成，避免手写小题池"],
  ["buildKeySignatureQuestions", "调号题应由 key 列表参数化生成"],
  ["buildReverseKeySignatureQuestions", "调号反推题应由 key 列表参数化生成"],
  ["buildCircleNeighborQuestions", "五度圈相邻调题应由五度圈顺序参数化生成"],
  ["buildRelativeMinorQuestions", "关系小调题应由调号表参数化生成"],
  ["buildRelativeMajorQuestions", "关系大调题应由关系小调表参数化生成"],
  ["buildMajorPentatonicQuestions", "大调五声音阶题应由公式参数化生成"],
  ["buildMinorPentatonicQuestions", "小调五声音阶题应由公式参数化生成"],
  ["buildPentatonicCenterQuestions", "五声中心反推题应由关系大小调参数化生成"],
  ["getMinorPentatonic", "小调五声应按 1 b3 4 5 b7 正确拼写"],
  ["buildMinorScaleQuestions", "自然小调与和声小调音阶题应由小调根音参数化生成"],
  ["buildMinorDominantQuestions", "小调 v7/V7/vii°7 题应由小调根音参数化生成"],
  ["buildHarmonicMinorReasonQuestions", "和声小调升高 7 级的原因题应由导音规则生成"],
  ["buildLeadingToneDiminishedQuestions", "导音减七到属七降九题应由小调根音参数化生成"],
  ["getMinorScale", "自然小调与和声小调应按标准间隔拼写"],
  ["playChordProgression", "小调功能与其它和声听感题应能播放和弦进行"],
  ["MinorFunctionAudioPanel", "自然小调 v7 与和声小调 V7 应提供听觉对比"],
  ["Em7 -> Am", "小调功能题应听自然小调 v7 回 i"],
  ["E7 -> Am", "小调功能题应听和声小调 V7 回 i"],
  ["PentatonicBoxDiagram", "关系大小调五声题应提供共用盒子指板图"],
  ["E minor / G major 共用五声盒子", "E 小调五声与 G 大调五声应落到同一指板盒子"],
  ["A minor / C major 共用五声盒子", "A 小调五声与 C 大调五声应落到同一指板盒子"],
  ["G minor / Bb major 共用五声盒子", "Bb 大调五声应连接到关系小调盒子"],
  ["REVIEW_DRAW_RATE", "练习引擎应保留错题优先回炉概率"],
  ["getReviewQuestionLabels", "练习引擎应从最近历史里提取未纠正错题"],
  ["getRecentQuestionLabels", "练习引擎应避开最近几题，减少小题池连续重复"],
  ["withoutRecent", "候选池应优先排除最近出现过的题目"],
  ["SHOWN_QUESTION_MEMORY_LIMIT", "练习引擎应记住本轮已展示题，覆盖连续点下一题但未提交的情况"],
  ["mergeRecentQuestionLabels", "练习引擎应合并已答历史与本轮已展示题"],
  ["shownLabels", "三个答题页应维护本轮已展示题短记忆队列"],
  ["recentLabels", "三个出题器页面应把最近题目标签传入候选选择器"],
  ["pickQuestionCandidate", "三个出题器应共用错题优先与避开上一题逻辑"],
  ["SpeedTimer", "带“速算”的课程应显示本题计时"],
  ["responseSeconds", "答题历史与统计应记录每题用时"],
  ["timedAnswers", "平均用时应只统计已有秒表记录的答题"],
  ["normalizeLoadedStats", "旧 localStorage 统计应能迁移到含用时字段的新结构"],
  ["bestResponseSeconds", "统计模块应保留最快速答"],
  ["KnowledgeCard", "每个章节进入测验前应有 30 秒知识卡"],
  ["knowledge-card-toggle", "知识卡折叠按钮需要稳定测试定位"],
  ["30 秒知识卡", "知识卡标题需要明确它是进测验前的快速规则预习"],
  ["getKnowledgeCard", "答题页应通过统一入口读取章节知识卡"],
  ["selfCheck", "知识卡应包含过关自查标准"],
];

for (const [snippet, reason] of requiredSnippets) {
  if (!source.includes(snippet)) {
    failures.push(`缺少关键审校片段“${snippet}”：${reason}`);
  }
}

const requiredKnowledgeCards = [
  "interval",
  "chord",
  "fretboard-root",
  "diatonic-chords",
  "chord-symbols",
  "extensions-omissions",
  "progression-transpose",
  "key-signatures",
  "relative-pentatonic",
  "minor-function",
  "borrowed-chords",
  "rhythm-grid",
];

for (const chapterId of requiredKnowledgeCards) {
  if (!files.knowledgeCards.includes(`chapterId: "${chapterId}"`)) {
    failures.push(`缺少章节 ${chapterId} 的 30 秒知识卡`);
  }
}

const rhythmPattern = "X..X..X..X..X...";
if (!files.courseTheory.includes(rhythmPattern)) {
  failures.push(`缺少正确 16 格重音 pattern：${rhythmPattern}`);
}

if (rhythmPattern.length !== 16) {
  failures.push(`${rhythmPattern} 长度应为 16，当前为 ${rhythmPattern.length}`);
}

const accentPositions = [...rhythmPattern]
  .map((char, index) => (char === "X" ? index + 1 : null))
  .filter(Boolean)
  .join(",");

if (accentPositions !== "1,4,7,10,13") {
  failures.push(`3+3+3+3+4 的重音位置应为 1,4,7,10,13，当前为 ${accentPositions}`);
}

if (files.courseTheory.includes('"X..X..X..X...."')) {
  failures.push("旧 pattern X..X..X..X.... 不是 16 格，不能继续出现在题库源码中");
}

const requiredRhythmPatterns = [
  ["X..X..X.X..X..X.", "3+3+2+3+3+2"],
  ["X.....X.....X...", "6+6+4"],
  [".X..X..X..X..X..", "第2格起 3+3+3+3+4"],
];

for (const [pattern, label] of requiredRhythmPatterns) {
  if (pattern.length !== 16) {
    failures.push(`${label} 的 pattern 长度应为 16，当前为 ${pattern.length}`);
  }

  if (!files.courseTheory.includes(pattern)) {
    failures.push(`缺少 ${label} 的 16 格 pattern：${pattern}`);
  }
}

await runRuntimeTheoryChecks();

if (failures.length > 0) {
  console.error("乐理题库自检未通过：");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("乐理题库自检通过。");

async function runRuntimeTheoryChecks() {
  try {
    const [musicTheory, intervalTheory, courseTheory] = await Promise.all([
      import("../src/utils/musicTheory.ts"),
      import("../src/utils/intervalTheory.ts"),
      import("../src/utils/courseTheory.ts"),
    ]);

    const dSharpMaj9 = musicTheory.buildQuestion("D#", "maj9");
    const dSharpMaj9Notes = musicTheory.getChordNotes(dSharpMaj9).join(" ");
    assertRuntime(dSharpMaj9Notes === "D# F## A# C## E#", `D#maj9 应严格拼写为 D# F## A# C## E#，当前为 ${dSharpMaj9Notes}`);
    assertRuntime(
      musicTheory.buildHint(dSharpMaj9).some((line) => line.includes("Ebmaj9")),
      "D#maj9 出现双升时应提示实际谱面常可写作 Ebmaj9",
    );

    const dMajor = musicTheory.buildQuestion("D", "maj");
    assertRuntime(
      musicTheory.evaluateAnswer(dMajor, "D F A", "D F# A", false).isFullyCorrect,
      "D 大三和弦按 1-3-5 顺序写 D F# A 应判为正确",
    );
    assertRuntime(
      !musicTheory.evaluateAnswer(dMajor, "D F A", "F# A D", false).isFullyCorrect,
      "和弦音构成题应保持 1-3-5 顺序，不应把转位顺序 F# A D 判为全对",
    );

    const majorSixth = intervalTheory.INTERVALS.find((interval) => interval.id === "M6");
    const octave = intervalTheory.INTERVALS.find((interval) => interval.id === "P8");
    assertRuntime(Boolean(majorSixth && octave), "音程定义应包含 M6 与 P8");
    const [fRoot, upperD] = intervalTheory.getIntervalAudioFrequencies("F", majorSixth);
    assertRuntime(isCloseRatio(upperD / fRoot, 2 ** (9 / 12)), `F -> D 的音频应播放向上大六度，当前频率比为 ${upperD / fRoot}`);
    const [cRoot, highC] = intervalTheory.getIntervalAudioFrequencies("C", octave);
    assertRuntime(isCloseRatio(highC / cRoot, 2), `八度音频应播放同音名高一组，当前频率比为 ${highC / cRoot}`);

    const diatonicHell = courseTheory.getTheoryDifficulty("diatonic-chords", "hell");
    const secondaryDominant = diatonicHell.questions.find((question) => question.label === "Bm7b5-E7-Am7");
    assertRuntime(Boolean(secondaryDominant), "顺阶和弦综合档应包含 Bm7b5-E7-Am7");
    assertRuntime(
      courseTheory.evaluateTheoryAnswer(secondaryDominant, "viio7 V7/vi vi7").isFullyCorrect,
      "Bm7b5-E7-Am7 应接受 viio7 V7/vi vi7 这种可打字写法",
    );

    const fretboardHell = courseTheory.getTheoryDifficulty("fretboard-root", "hell");
    const cmaj7Root = fretboardHell.questions.find((question) => question.label === "Cmaj7 六弦系统");
    assertRuntime(Boolean(cmaj7Root), "指板根音综合档应包含 Cmaj7 六弦系统");
    assertRuntime(
      courseTheory.evaluateTheoryAnswer(cmaj7Root, "六弦八品拍六弦").isFullyCorrect,
      "指板根音题应接受全中文数字输入：六弦八品拍六弦",
    );
  } catch (error) {
    failures.push(`运行时乐理自检无法执行：${error.message}`);
  }
}

function assertRuntime(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function isCloseRatio(actual, expected) {
  return Math.abs(actual - expected) < 0.000001;
}
