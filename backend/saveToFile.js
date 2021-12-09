// const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;

const fileUtil = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkdir: promisify(fs.mkdir),
};
const log = console.log.bind(console);
const logJson = (data) => {
  log(JSON.stringify(data, null, 2));
};

function saveToFile({ data, outputDir = "./output", fileName }) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const name = fileName || `output${Date.now()}.txt`;
  const dataStr = data;
  return fileUtil
    .writeFile(path.join(outputDir, name), dataStr)
    .then((res) => {
      // log(`写入成功, 文件位置 ${path.join(outputDir, name)}`);
    })
    .catch((e) => log(e));
}

module.exports = {
  saveToFile,
};
