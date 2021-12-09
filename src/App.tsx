import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import PoemPage from "./pages/PoemPage";
// import './App.less'
// import  {log} from ''
interface Props {}

const App: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false)
  return (
    <div className="App">
      <PoemPage></PoemPage>
    </div>
  );
};

export default App;
