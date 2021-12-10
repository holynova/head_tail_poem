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
  RowDataModel,
} from "./poem";
import PoemRow from "./components/PoemRow";
import Author from "../common/components/Author";
import { Space } from "_antd-mobile@5.0.0-rc.3@antd-mobile";

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

// log("dict", { poemDict, type: typeof poemDict });
const buttonProps = {
  // size: "small",
};
function PoemPage() {
  let [size, setSize] = useState([7]);
  let [position, setPosition] = useState(["HEAD"]);
  let [keyWord, setKeyWord] = useState("清风明月水落石出");
  let [rows, setRows] = useState<RowDataModel[]>([]);
  let [results, setResults] = useState<string[]>([]);
  let [sourceVisible, setSourceVisible] = useState(true);
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
      let rowDataList: RowDataModel[] = [];
      let input: string = word.trim();
      if (!input) {
        return;
      }
      // log("compose", { word, input, length });
      loadChosenDicts(position[0] !== "TAIL", input.split("")).then(
        (mergedHeadTailDict) => {
          input.split("").forEach((char) => {
            const currentRowData: RowDataModel = {
              position: position[0],
              char,
              results: [],
            };

            let found: HeadTailItem[] = mergedHeadTailDict[char];
            // const notFoundData: ResultRowModel = {
            //   line: "翻遍字典没找到，你快过来自己编",
            //   poemId: "",
            //   alter: [],
            //   count: 0,
            //   index: 0,
            // };
            if (found) {
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
              // let rowData = results ? genRandomRowData(results) : notFoundData;
              // log("debug", { lengthDict, rowData, found });
              // let rowData = results || [];
              currentRowData.results = results || [];
            }
            rowDataList.push(currentRowData);
          });
          setRows(rowDataList);
        }
      );
    },
    [position, size]
  );

  useEffect(() => {
    composePoem(keyWord, size[0]);
  }, [composePoem, keyWord, size]);

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

        <div className="button-part">
          <Space>
            <Button {...buttonProps} onClick={() => composePoem(keyWord, size)}>
              刷新
            </Button>
            <Button {...buttonProps} onClick={1}>
              复制
            </Button>
            <Button {...buttonProps} onClick={2}>
              截图
            </Button>
            <Button
              {...buttonProps}
              onClick={() => setSourceVisible((prev) => !prev)}
            >
              {sourceVisible ? "隐藏出处" : "显示出处"}
            </Button>
          </Space>
        </div>
      </div>

      <div className="result">
        <div className="title">{keyWord}</div>
        {/* <div className="author">李白</div> */}
        <List>
          {rows.map((x, index) => (
            <PoemRow
              key={index}
              data={x}
              sourceVisible={sourceVisible}
            ></PoemRow>
          ))}
        </List>
      </div>

      <Author></Author>
      {/* <pre>
        {JSON.stringify({ size, keyWord, position }, null, 2)}
      </pre> */}
    </div>
  );
}

export default PoemPage;
