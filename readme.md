<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="藏头诗生成器 — 四列竖排诗句，首字朱红标出：清、风、明、月">
</p>

<p align="center">
  <a href="https://head-tail-poem.xiaosang.cc/">▶ 在线生成 Try Online</a>
  ·
  <a href="https://github.com/holynova/head_tail_poem">GitHub 仓库</a>
</p>

藏头诗生成器：输入任意文字（名字、祝福、口号），逐字从古诗库里取句，拼成一首藏头诗或藏尾诗。默认示例「清风明月水落石出」一键生成 8 句七律，每句都标注出处（朝代 / 作者 / 篇名）。手机端优先，打开即用。

A Chinese acrostic and telestich poem generator: type any phrase — a name, a blessing, a slogan — and it picks classical verse line by line to hide your words at the start (or end) of each line. The default example "清风明月水落石出" composes an 8-line poem in one tap, with the source of every line cited. Mobile-first, no setup.

## 截图 / Screenshots

<p align="center">
  <img src="./assets/readme/screenshot-poem.png" width="300" alt="藏头诗生成结果：输入清风明月水落石出，生成 8 句七律，每句首字朱红高亮，下方标注出处如杜甫《登高》">
</p>

## 功能 / Features

- **藏头 / 藏尾**：一键切换，藏在句首还是句尾随你选。
- **七律 / 五绝**：两种句长，默认七律。
- **逐句换句**：对某一句不满意，点它旁边的 ↻ 只换这一句，不用整首重来。
- **出处标注**：每句下方标注朝代、作者、篇名；可一键隐藏出处，只看诗。
- **一键复制**：整首诗复制到剪贴板，直接发朋友圈或贺卡。

## 词库 / The Corpus

诗句库来自 599 首古诗，按首字 / 尾字建成两套索引（各 2,693 句），再按字拆成单字 JSON 按需加载，首屏不背全库：

| 索引 | 字数 | 句数 |
|------|------|------|
| 藏头（head） | 936 字 | 2,693 句 |
| 藏尾（tail） | 968 字 | 2,693 句 |

词库生成脚本在 `backend/`（`raw.json` → `makeDict.js` 按字拆分）。

## 本地运行 / Run Locally

```bash
npm install
npm run dev      # 开发
npm run build    # 构建，产物在 docs/（GitHub Pages 直接用 docs 目录部署）
```

## 技术 / Tech

- React 17 + TypeScript + Vite 2，UI 用 antd-mobile 5，移动端优先。
- 词典按字分包：`import.meta.glob` 动态加载，只拉用到的字。
- 构建产物提交在 `docs/` 目录，GitHub Pages 开箱即用。

```
src/pages/PoemPage.tsx   主页面：输入 / 选择器 / 生成 / 复制
src/pages/components/    PoemRow（单句 + 换句）、HighlightString（高亮藏字）
src/common/dict/         词典：head/ 936 字、tail/ 968 字
backend/                 词库生成：raw.json + makeDict.js
docs/                    构建产物（Pages 部署目录）
```

## English

**Head & Tail Poem Generator** turns any phrase into a classical Chinese acrostic poem: each character of your input becomes the first (or last) character of a verse line drawn from a corpus of 599 poems.

- **Acrostic / telestich toggle**, **7-char / 5-char lines** — pick your form.
- **Per-line refresh**: tap ↻ next to any line to swap just that line.
- **Citations**: every line shows its dynasty, author, and poem title; hide them with one tap.
- **One-tap copy** of the whole poem.
- **Corpus**: 936 head-characters and 968 tail-characters, 2,693 lines each, split into per-character JSON chunks loaded on demand.
- **Tech**: React 17 + TypeScript + Vite 2 + antd-mobile 5. `npm run dev` to run, `npm run build` outputs to `docs/` for GitHub Pages.

## 许可 / License

仓库未附 LICENSE 文件。No license file is included in this repository.
