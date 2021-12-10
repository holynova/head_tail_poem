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
  positions: number[]; //可以接受负数
  highlightStyle?: CSS.Properties;
}

const HighlightString: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false)
  if (!props?.str) {
    return null;
  }
  return (
    <span className="HighlightString">
      {/* <h3>HighlightString</h3> */}
      {props?.str?.split("").map((c, index) => {
        const positions = props.positions.map((x) => {
          return x < 0 ? x + props.str.length : x;
        });
        if (positions?.includes(index)) {
          return (
            <span
              key={index}
              className="highlight"
              style={props?.highlightStyle || { color: "red" }}
            >
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
