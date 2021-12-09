const rawData = require("./raw/raw.json");
const log = console.log.bind(console);
const { saveToFile } = require("./saveToFile");

function saveByChar(dict, outputDir) {
  Object.entries(dict).forEach(([k, v]) => {
    saveToFile({ data: JSON.stringify(v), fileName: `${k}.json`, outputDir });
  });
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
  saveByChar(tailWordDict, "./output/tail");
  console.timeEnd();
  log("done");
}

main();
