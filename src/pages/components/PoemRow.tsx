import React, { useState, useCallback, useEffect } from "react";
//  import {} from 'antd'
// import './PoemRow.less'
// import  {log} from ''
import { RedoOutline } from "antd-mobile-icons";
import List from "antd-mobile/es/components/list";
import { HeadTailItem, RowDataModel } from "../poem";
import poemDict from "../../common/dict/poem.json";
import HighlightString from "./HighlightString";
import { choose } from "../../utils/rand";

interface Props {
  data: RowDataModel;
  sourceVisible: boolean;
  onChange: (res: string) => void;
}

const getSource = (row: HeadTailItem | undefined) => {
  if (row && row.poemId) {
    // @ts-ignore
    const poem = poemDict[row.poemId];
    return `[${poem.dynasty}] ${poem.author || "佚名"} <${poem.title}>`;
  }
  return "";
};
// const styles: { [key: string]: CSS.Properties } = {
//   source: {
//     fontSize: "12px",
//     textAlign: "center",
//   },
// };

const PoemRow: React.FC<Props> = function (props) {
  const { data, sourceVisible, onChange } = props;
  const [poem, setPoem] = useState<HeadTailItem>();

  const len = data?.results?.length || 0;
  useEffect(() => {
    setPoem(len === 1 ? data.results[0] : choose(data?.results));
  }, [len, data]);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(poem?.line || "");
    }
  }, [poem, onChange]);

  const refresh = useCallback(() => {
    setPoem((prev) => {
      // console.time("refresh");
      const start = Date.now();
      let res = prev;
      while (Date.now() - start < 1000) {
        const newPoem = choose(data?.results);
        if (newPoem?.line !== prev?.line) {
          res = newPoem;
          break;
        }
      }
      // console.timeEnd("refresh");
      return res;
    });
  }, [data.results]);

  // const poem = len === 1 ? props.data.results[0] : choose(props.data?.results);
  if (len === 0) {
    return (
      <List.Item>
        <HighlightString
          str={`${data.char}: 翻遍字典, 没找到答案`}
          positions={[0]}
        />
      </List.Item>
    );
  }
  return (
    <List.Item
      description={sourceVisible ? getSource(poem) : false}
      extra={len > 1 ? <RedoOutline onClick={refresh} /> : null}
    >
      <div className="line-part">
        <HighlightString
          str={poem?.line || ""}
          positions={data.position === "TAIL" ? [-1] : [0]}
        />
      </div>
    </List.Item>
  );
};

export default PoemRow;
