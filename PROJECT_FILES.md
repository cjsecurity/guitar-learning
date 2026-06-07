# 当前网站文件清单

当前网站已经统一放在这个目录下管理：

```text
/Users/joeyfu/Documents/Playground/guitar-learning
```

这个目录本身就是 Git 仓库，远端仓库为：

```text
git@github.com:cjsecurity/guitar-learning.git
```

## Git 管理边界

当前网站以 `guitar-learning/` 作为唯一项目根目录。后续开发、提交、构建、运行都应该在这个目录内完成：

```bash
cd /Users/joeyfu/Documents/Playground/guitar-learning
```

纳入 Git 的内容包括：React 源码、Vite/Tailwind/TypeScript 配置、乐理题库、音频与判题工具、题库审核脚本、项目说明文档。Playground 外层的旧备份、压缩包、飞书课程笔记和其他安全分析文件不属于当前网站源码。

## 网站运行必需文件

### 项目入口与构建配置

- `package.json`：项目依赖与 npm scripts。
- `package-lock.json`：锁定依赖版本。
- `index.html`：Vite 页面入口。
- `vite.config.ts`：Vite 配置。
- `tsconfig.json`：TypeScript 主配置。
- `tsconfig.node.json`：Vite/Node 侧 TypeScript 配置。
- `tailwind.config.js`：Tailwind CSS 配置。
- `postcss.config.js`：PostCSS 配置。
- `.gitignore`：Git 忽略规则。

### React 应用源码

- `src/main.tsx`：React 挂载入口。
- `src/App.tsx`：页面路由状态与全局统计逻辑。
- `src/index.css`：Tailwind 引入与全局样式。
- `src/types/quiz.ts`：通用题目与统计类型。

### 页面与练习组件

- `src/components/HomePage.tsx`：主页面课程入口。
- `src/components/CircleOfFifthsDiagram.tsx`：五度圈与调号方向图。
- `src/components/DifficultySelect.tsx`：和弦课程难度选择。
- `src/components/QuizPage.tsx`：和弦练习页。
- `src/components/QuizCard.tsx`：和弦答题卡片。
- `src/components/IntervalDifficultySelect.tsx`：音程课程难度选择。
- `src/components/IntervalQuizPage.tsx`：音程练习页。
- `src/components/IntervalQuizCard.tsx`：音程答题卡片与音频按钮。
- `src/components/TheoryDifficultySelect.tsx`：通用乐理分支难度选择。
- `src/components/TheoryQuizPage.tsx`：通用乐理练习页。
- `src/components/TheoryQuizCard.tsx`：通用乐理答题卡片。
- `src/components/StatsPanel.tsx`：成绩统计。
- `src/components/HistoryPanel.tsx`：最近答题记录。
- `src/components/KnowledgeCard.tsx`：30 秒知识卡。
- `src/components/ReviewQueueNotice.tsx`：错题复习提示。
- `src/components/SpeedTimer.tsx`：速答计时。
- `src/components/FretboardDiagram.tsx`：指板根音图。
- `src/components/PentatonicBoxDiagram.tsx`：五声音阶指型图。
- `src/components/MinorFunctionAudioPanel.tsx`：小调功能音频示例。
- `src/components/RhythmStepSequencer.tsx`：16 分节奏网格播放。
- `src/components/RhythmTapTrainer.tsx`：节奏跟拍检测。

### 乐理与判题逻辑

- `src/utils/musicTheory.ts`：和弦构成、字母骨架、公式、判题。
- `src/utils/intervalTheory.ts`：音程题库、音程判题、协和分类。
- `src/utils/courseTheory.ts`：通用乐理课程分支题库。
- `src/utils/audioEngine.ts`：浏览器 Web Audio 合成音。
- `src/utils/knowledgeCards.ts`：各章节知识卡内容。
- `src/utils/reviewQueue.ts`：错题复习队列。

### 审核与文档

- `scripts/check-theory-bank.mjs`：乐理题库自检脚本。
- `docs/music-theory-audit.md`：乐理正确性与教学设计审计。
- `docs/question-bank-review.md`：题库覆盖与术语 review。
- `README.md`：项目说明。
- `PROJECT_FILES.md`：当前文件清单。

## 不纳入 Git 的文件

这些文件是本地缓存、依赖或构建产物，不属于源码，不应该提交：

- `node_modules/`
- `dist/`
- `.vite/`
- `.DS_Store`
- `src/.DS_Store`

## Playground 目录里的旧文件说明

`/Users/joeyfu/Documents/Playground` 下还有旧备份和压缩包，例如：

- `guitar-learning-backup-20260607-141707/`
- `guitar-learning.zip`

它们不是当前网站运行所需文件，也不属于当前 Git 仓库。当前应以 `guitar-learning/` 目录为准。
