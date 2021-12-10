import React from "react";
// import {} from "antd";
// import './Author.less'
// import  {log} from ''
interface Props {}

const Author: React.FC<Props> = function () {
  // const [loading, setLoading] = useState(false)
  return (
    <div className="Author" style={{ textAlign: "center" }}>
      <p>作者: holynova</p>
      <a href="https://github.com/holynova/head_tail_poem">
        <p>Fork me on Github</p>
      </a>
    </div>
  );
};

export default Author;
