import React, { useCallback, useState, useEffect } from "react";

import Input from "antd-mobile/es/components/input";
import Button from "antd-mobile/es/components/button";
import Selector from "antd-mobile/es/components/selector";
import List from "antd-mobile/es/components/list";

import poemDict from "../common/dict/poem.json";

const log = console.log.bind(console);
import * as rand from "../utils/rand";
import "./PoemPage.scss";
import {
  HeadTailDict,
  HeadTailItem,
  PoemDictItemModel,
  PoemDictModel,
  ResultRowModel,
} from "./poem";

function getModuleFullName(isHead = true, name = "*") {
  return `../common/dict/${isHead ? "head" : "tail"}/${name}.json`;
}

const headModules = import.meta.glob("../common/dict/head/*.json");
const tailModules = import.meta.glob("../common/dict/tail/*.json");

const loadChosenDicts = (isHead = true, names: string[]) => {
  let pList = names.map((x) => {
    let fullName = getModuleFullName(isHead, x);
    let moduleDict = isHead ? headModules : tailModules;
    if (typeof moduleDict[fullName] === "function") {
      return moduleDict[fullName]();
    }
    return Promise.reject(new Error(`${fullName}不存在`));
  });
  return Promise.allSettled(pList).then((arr) => {
    let dict: HeadTailDict = {};
    arr.forEach((promiseResult, index) => {
      let key = names[index];
      if (promiseResult.status === "fulfilled")
        dict[key] = promiseResult.value.default;
    });
    return dict;
  });
};

log("dict", { poemDict, type: typeof poemDict });

function PoemPage() {
  let [size, setSize] = useState([7]);
  let [position, setPosition] = useState(["HEAD"]);
  let [keyWord, setKeyWord] = useState("清风明月水落石出");
  let [rows, setRows] = useState<ResultRowModel[]>([]);

  const genRandomRowData = (resultList: HeadTailItem[]): ResultRowModel => {
    let count = resultList.length;
    let randomIndex = rand.between(0, count);
    let row = resultList[randomIndex];
    // let row = rand.choose(found)
    return {
      ...row,
      alter: resultList,
      count,
      index: randomIndex,
    };
  };

  const composePoem = useCallback(
    (word = "", length = 7) => {
      let res: ResultRowModel[] = [];
      let input: string = word.trim();
      if (!input) {
        return;
      }
      // log("compose", { word, input, length });
      loadChosenDicts(position[0] !== "TAIL", input.split("")).then(
        (mergedHeadTailDict) => {
          input.split("").forEach((char) => {
            let found: HeadTailItem[] = mergedHeadTailDict[char];

            // let countDict = {}
            const notFoundData: ResultRowModel = {
              line: "翻遍字典没找到，你快过来自己编",
              poemId: "",
              alter: [],
              count: 0,
              index: 0,
            };
            if (!found) {
              res.push(notFoundData);
            } else {
              interface LengthDictModel {
                [key: string]: HeadTailItem[];
              }
              // 将找到的诗句, 根据字数来放到字典里, 以便区分五言, 七言等
              // key 为字数, value 为诗句
              const groupByLengthDict: LengthDictModel = found.reduce(
                (pre, cur, index) => {
                  let res: LengthDictModel = { ...pre };
                  // 减去中间的标点1个字符, 再除以二, 就是半句的长度
                  let key: string = `${Math.floor((cur.line.length - 1) / 2)}`;
                  if (key in res) {
                    res[key] = [...res[key], cur];
                  } else {
                    res[key] = [cur];
                  }
                  return res;
                },
                {}
              );

              let results = groupByLengthDict[`${length}`];
              let rowData = results ? genRandomRowData(results) : notFoundData;
              // log("debug", { lengthDict, rowData, found });
              res.push(rowData);
            }
          });
          setRows(res);
        }
      );
    },
    [position, size]
  );

  const onChangeRow = (index: number) => {
    setRows((prevRows) => {
      const { alter, index: prevIndex } = prevRows[index];
      let i = 0;
      let row = null;
      do {
        row = genRandomRowData(alter);
        if (i++ > 999) {
          break;
        }
      } while (row.index === prevIndex);
      // // let newRows = prevRows.splice()
      prevRows[index] = row;
      return [...prevRows];
    });
  };

  const renderRow = (row: ResultRowModel, index: number) => {
    let charList = row.line.split("");
    let tail = charList.pop();
    let head = charList.shift();
    let middle = charList.join("");
    let getSource = (row: ResultRowModel) => {
      if (row && row.poemId) {
        // @ts-ignore
        let myDict: PoemDictModel = poemDict;
        let poem = myDict[row.poemId];
        return `[${poem.dynasty}] ${poem.author || "佚名"} <${poem.title}>`;
      } else {
        return null;
      }
    };
    const sourcePart = (
      <div>
        <span className="source">{getSource(row)}</span>
        <div>
          {row.count > 1 ? (
            <Button
              onClick={() => {
                onChangeRow(index);
              }}
              // fill="none"
            >{`换一首 (共${row.count}首) `}</Button>
          ) : // <span
          //   className="change-button"
          //   onClick={() => {
          //     onChangeRow(index);
          //   }}
          // >
          //   {`换一个(共${row.count}首)`}
          // </span>
          null}
        </div>
      </div>
    );
    return (
      <List.Item key={index}>
        <div className="poem-row">
          <span className={`head ${position[0] === "HEAD" ? "highlight" : ""}`}>
            {head}
          </span>
          <span className="rest">{middle}</span>
          <span className={`head ${position[0] === "TAIL" ? "highlight" : ""}`}>
            {tail}
          </span>
        </div>
        {sourcePart}
      </List.Item>
    );
  };

  useEffect(() => {
    composePoem(keyWord, 7);
  }, [composePoem, keyWord]);

  return (
    <div className="PoemPage">
      <div>
        <List>
          <List.Item>
            <div className="title">藏头诗生成器</div>
          </List.Item>
          <List.Item title="请输入">
            <Input value={keyWord} onChange={setKeyWord} clearable></Input>
          </List.Item>
          <List.Item>
            <Selector
              value={size}
              onChange={setSize}
              columns={2}
              options={[
                { label: "七律", value: 7 },
                { label: "五绝", value: 5 },
              ]}
            ></Selector>
          </List.Item>
          <List.Item>
            <Selector
              value={position}
              columns={2}
              options={[
                { label: "藏头", value: "HEAD" },
                { label: "藏尾", value: "TAIL" },
              ]}
              onChange={setPosition}
            ></Selector>
          </List.Item>
        </List>
        <Button
          color="primary"
          block
          onClick={() => composePoem(keyWord, size)}
        >
          开始作诗
        </Button>
      </div>

      <div className="result">
        <div className="title">{keyWord}</div>
        {/* <div className="author">李白</div> */}
        <List>{rows.map((row, index) => renderRow(row, index))}</List>
      </div>
      {/* <pre>
        {JSON.stringify({ size, keyWord, position }, null, 2)}
      </pre> */}
    </div>
  );
}

export default PoemPage;
