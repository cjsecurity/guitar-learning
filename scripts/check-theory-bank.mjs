import { readFileSync } from "node:fs";

const files = {
  courseTheory: readFileSync("src/utils/courseTheory.ts", "utf8"),
  musicTheory: readFileSync("src/utils/musicTheory.ts", "utf8"),
  intervalTheory: readFileSync("src/utils/intervalTheory.ts", "utf8"),
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

if (failures.length > 0) {
  console.error("乐理题库自检未通过：");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("乐理题库自检通过。");
