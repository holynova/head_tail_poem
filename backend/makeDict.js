const rawData = require("./raw/raw.json");

const log = console.log.bind(console);
const { saveToFile } = require("./saveToFile");
const { pinyin } = require("pinyin-pro");

function saveByChar(dict, outputDir) {
  Object.entries(dict).forEach(([k, v]) => {
    saveToFile({ data: JSON.stringify(v), fileName: `${k}.json`, outputDir });
  });
}
function convertCharDictToPinyinDict(dict) {
  const res = {};
  Object.entries(dict).forEach(([char, poemList]) => {
    const pinyinKey = pinyin(char, { toneType: "num" });
    if (pinyinKey in res) {
      res[pinyinKey] = [...res[pinyinKey], ...poemList];
    } else {
      res[pinyinKey] = poemList;
    }
  });
  return res;
}

function main() {
  console.time();
  log("ready");
  const { poemDict, headWordDict, tailWordDict } = rawData;

  saveToFile({
    data: JSON.stringify(poemDict),
    outputDir: "./output",
    fileName: "poem.json",
  });

  saveByChar(headWordDict, "./output/head");
  saveByChar(convertCharDictToPinyinDict(headWordDict), "./output/head_pinyin");
  saveByChar(tailWordDict, "./output/tail");
  saveByChar(convertCharDictToPinyinDict(tailWordDict), "./output/tail_pinyin");

  console.timeEnd();
  log("done");
}

main();
