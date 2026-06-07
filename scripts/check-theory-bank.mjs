import { readFileSync } from "node:fs";

const files = {
  courseTheory: readFileSync("src/utils/courseTheory.ts", "utf8"),
  musicTheory: readFileSync("src/utils/musicTheory.ts", "utf8"),
  intervalTheory: readFileSync("src/utils/intervalTheory.ts", "utf8"),
  audioEngine: readFileSync("src/utils/audioEngine.ts", "utf8"),
  rhythmStepSequencer: readFileSync("src/components/RhythmStepSequencer.tsx", "utf8"),
  minorFunctionAudioPanel: readFileSync("src/components/MinorFunctionAudioPanel.tsx", "utf8"),
  pentatonicBoxDiagram: readFileSync("src/components/PentatonicBoxDiagram.tsx", "utf8"),
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
  ["Cdim7", "和弦标记题应区分减七和半减七"],
  ["Cadd9", "和弦标记题应区分 add9 与属九"],
  ["C6", "和弦标记题应区分 6 和 13 的语境"],
  ["Csus2", "和弦标记题应覆盖 sus2"],
  ["最后一个升号", "调号题应包含升号调经典速算法"],
  ["倒数第二个降号", "调号题应包含降号调经典速算法"],
  ["A小调 v7", "小调功能题应对比自然小调 v7 与和声小调 V7"],
  ["borrowed iv", "借用和弦题应覆盖流行乐高频的小四级借用"],
  ["playRhythmPattern", "节奏网格应支持音频播放"],
  ["RhythmStepSequencer", "16 分 pattern 题应使用点击式 step sequencer"],
  ["6+6+4", "节奏题应覆盖 3+3+3+3+4 以外的分组"],
  ["起点偏移", "节奏题应覆盖重音起点偏移"],
  ["buildDiatonicDegreeQuestions", "顺阶和弦题库应由级数生成，避免手写小题池"],
  ["buildProgressionQuestions", "级数转调题库应由 key + progression 参数化生成"],
  ["playChordProgression", "小调功能与其它和声听感题应能播放和弦进行"],
  ["MinorFunctionAudioPanel", "自然小调 v7 与和声小调 V7 应提供听觉对比"],
  ["Em7 -> Am", "小调功能题应听自然小调 v7 回 i"],
  ["E7 -> Am", "小调功能题应听和声小调 V7 回 i"],
  ["PentatonicBoxDiagram", "关系大小调五声题应提供共用盒子指板图"],
  ["E minor / G major 共用五声盒子", "E 小调五声与 G 大调五声应落到同一指板盒子"],
  ["A minor / C major 共用五声盒子", "A 小调五声与 C 大调五声应落到同一指板盒子"],
  ["G minor / Bb major 共用五声盒子", "Bb 大调五声应连接到关系小调盒子"],
];

for (const [snippet, reason] of requiredSnippets) {
  if (!source.includes(snippet)) {
    failures.push(`缺少关键审校片段“${snippet}”：${reason}`);
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

if (failures.length > 0) {
  console.error("乐理题库自检未通过：");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("乐理题库自检通过。");
