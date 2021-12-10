import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
//  import {} from 'antd'
// import './PoemRow.less'
// import  {log} from ''
import { RedoOutline } from "antd-mobile-icons";
import List from "antd-mobile/es/components/list";
import DebugPanel from "../../common/components/DebugPanel";
import Button from "_antd-mobile@5.0.0-rc.3@antd-mobile/es/components/button";
import { HeadTailItem, RowDataModel } from "../poem";
import poemDict from "../../common/dict/poem.json";
import HighlightString from "./HighlightString";
import { between, choose } from "../../utils/rand";
import CSS from "csstype";

interface Props {
  data: RowDataModel;
  sourceVisible: boolean;
}

let getSource = (row: HeadTailItem) => {
  if (row && row.poemId) {
    // @ts-ignore
    let myDict: PoemDictModel = poemDict;
    let poem = myDict[row.poemId];
    return `[${poem.dynasty}] ${poem.author || "佚名"} <${poem.title}>`;
  } else {
    return null;
  }
};
const styles: { [key: string]: CSS.Properties } = {
  source: {
    fontSize: "12px",
    textAlign: "center",
  },
};

const PoemRow: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false)
  const [poem, setPoem] = useState<HeadTailItem>();
  const [folded, setFolded] = useState(true);
  const [current, setCurrent] = useState(-1);
  const toggle = useCallback(() => {
    setFolded((prev) => !prev);
  }, []);

  useEffect(() => {
    setFolded(true);
  }, [props.data]);

  // const pickOne = useCallback(() => {}, []);
  const len = props.data?.results?.length || 0;
  if (len === 0) {
    return (
      <List.Item>
        <HighlightString
          str={`${props.data.char}: 翻遍字典, 没找到答案`}
          positions={[0]}
        ></HighlightString>
      </List.Item>
    );
  }

  const refresh = useCallback(() => {
    // setPoem((prev) => {});
    setPoem((prev) => {
      console.time("refresh");
      let start = Date.now();
      let res = prev;
      while (Date.now() - start < 1000) {
        let newPoem = choose(props.data?.results);
        if (newPoem?.line !== prev?.line) {
          res = newPoem;
          break;
        }
      }
      console.timeEnd("refresh");
      return res;
    });
  }, []);

  useEffect(() => {
    setPoem(len === 1 ? props.data.results[0] : choose(props.data?.results));
  }, [len, props.data]);

  // const poem = len === 1 ? props.data.results[0] : choose(props.data?.results);

  return (
    <List.Item
      description={props.sourceVisible ? getSource(poem) : false}
      extra={len > 1 ? <RedoOutline onClick={refresh}></RedoOutline> : null}
    >
      <div className="line-part">
        <HighlightString
          str={poem?.line || ""}
          positions={props.data.position === "TAIL" ? [-1] : [0]}
        ></HighlightString>
      </div>
      {/* {folded ? null : (
        <div>
          <div className="source-part" style={styles.source}>
            {source}
          </div>
          {len === 1 ? null : (
            <div className="refresh-part">
              <Button>换一首</Button>
            </div>
          )}
        </div>
      )} */}
    </List.Item>
  );
};

export default PoemRow;
