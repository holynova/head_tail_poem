import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
// import {} from "antd";
// import './DebugPanel.less'
// import  {log} from ''
interface Props {
  data: any;
}
const style = {
  fontSize: "12px",
  background: "#ffe",
  overflow: "auto",
  maxHeight: "300px",
};

const DebugPanel: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false)
  return (
    <pre style={style} className="DebugPanel">
      {JSON.stringify(props.data, null, 2)}
    </pre>
  );
};

export default DebugPanel;
