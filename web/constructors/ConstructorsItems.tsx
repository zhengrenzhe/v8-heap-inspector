import React, { useState } from "react";
import axios from "axios";
import { TableVirtuoso } from "react-virtuoso";

import { API_get_all_constructors } from "../api";
import { useRequest } from "ahooks";
import { GetAllConstructorsReturnValue } from "../../binding";
import { Body, InlineCode } from "@leafygreen-ui/typography";

export function ConstructorsItems() {
  const { data } = useRequest<GetAllConstructorsReturnValue, any>(
    async () => (await axios.get(API_get_all_constructors)).data,
    {
      cacheKey: "GetAllConstructorsReturnValue",
      staleTime: Number.MAX_SAFE_INTEGER,
    },
  );

  const [filterName, setFilterName] = useState("");

  const constructors = (data?.constructors || [])
    .filter((c) => c.name.toLowerCase().includes(filterName.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
  const constructorsLength = constructors.length;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableVirtuoso
        style={{
          height: "100%",
          width: "100%",
        }}
        components={{
          Table: ({ style, ...props }) => (
            <table {...props} style={style} className="list-table" />
          ),
          TableRow: ({ style, ...props }) => (
            <tr {...props} style={style} className="list-table-row" />
          ),
        }}
        totalCount={constructorsLength}
        fixedItemHeight={24}
        fixedHeaderContent={() => (
          <tr>
            <th>
              <Body weight="medium">Names</Body>
            </th>
            <th style={{ width: 40 }}>
              <Body weight="medium">Count</Body>
            </th>
            <th style={{ width: 70 }}>
              <Body weight="medium">Self Size</Body>
            </th>
          </tr>
        )}
        itemContent={(index) => {
          const item = constructors[index];
          return (
            <>
              <td className="list-table-td-name" title={item.name}>
                <InlineCode>{item.name}</InlineCode>
              </td>
              <td className="list-table-td-other" title={item.count.toString()}>
                <Body>{item.count}</Body>
              </td>
              <td
                className="list-table-td-other"
                title={item.selfSize.toString()}
              >
                <Body>{item.selfSize}</Body>
              </td>
            </>
          );
        }}
      />
    </div>
  );
}
