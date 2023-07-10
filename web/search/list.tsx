import { CSSProperties, useEffect, useState } from "react";
import * as React from "react";
import axios from "axios";
import { Virtuoso } from "react-virtuoso";

import { LocalAnalyzerNodeInfo } from "../../binding";

export const List = (props: { style: CSSProperties }) => {
  const [listData, setListData] = useState<LocalAnalyzerNodeInfo[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/entries").then((res) => {
      const data = res.data as LocalAnalyzerNodeInfo[];
      setListData(data);
    });
  }, []);

  return (
    <div style={{ ...props.style, borderRight: "1px solid red" }}>
      <Virtuoso
        totalCount={listData.length}
        itemContent={(index) => (
          <div style={{ height: 24 }}>{listData[index]?.name}</div>
        )}
      />
    </div>
  );
};
