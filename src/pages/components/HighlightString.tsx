import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
// import {} from "antd";
import CSS from "csstype";
// import './HighlightString.less'
// import  {log} from ''
interface Props {
  str: string;
  positions: number[]; // 可以接受负数
  highlightStyle?: CSS.Properties;
}

const HighlightString: React.FC<Props> = function ({
  str,
  positions,
  highlightStyle = { color: "red" },
}) {
  // const [loading, setLoading] = useState(false)
  if (!str) {
    return null;
  }
  return (
    <span className="HighlightString">
      {/* <h3>HighlightString</h3> */}
      {str?.split("").map((c, index) => {
        const posList = positions.map((x) => (x < 0 ? x + str.length : x));
        if (posList?.includes(index)) {
          return (
            <span key={index} className="highlight" style={highlightStyle}>
              {c}
            </span>
          );
        }
        return <span key={index}>{c}</span>;
      })}
    </span>
  );
};

export default HighlightString;
