import { useRequest } from "ahooks";
import axios from "axios";
import React from "react";

import { API_get_all_constructors } from "../api";
import { GetAllConstructorsReturnValue } from "../../binding";
import { TableVirtuoso } from "react-virtuoso";
import { useMantineTheme } from "@mantine/core";

export function ConstructorsView() {
  const { data, loading } = useRequest<GetAllConstructorsReturnValue, any>(
    async () => (await axios.get(API_get_all_constructors)).data,
    {
      cacheKey: "GetAllConstructorsReturnValue",
      staleTime: Number.MAX_SAFE_INTEGER,
    },
  );

  const theme = useMantineTheme();
  const lineColor = theme.colors.gray[theme.colorScheme === "dark" ? 8 : 0];

  return (
    <div className="tab-pane-content" data-type="ConstructorsView">
      <TableVirtuoso
        style={{
          height: "100%",
          width: 340,
          borderRight: `1px solid ${lineColor}`,
        }}
        components={{
          Table: ({ style, ...props }) => (
            <table {...props} style={style} className="list-table" />
          ),
          TableRow: ({ style, ...props }) => (
            <tr {...props} style={style} className="list-table-row" />
          ),
        }}
        totalCount={data?.count || 0}
        fixedItemHeight={24}
        fixedHeaderContent={() => (
          <tr
            style={{
              backgroundColor: lineColor,
            }}
          >
            <th style={{ width: 200 }}>Names</th>
            <th>Count</th>
            <th>Self Size</th>
          </tr>
        )}
        itemContent={(index) => {
          const item = data?.constructors[index];
          return (
            <>
              <td className="list-table-td-name">{item?.name}</td>
              <td className="list-table-td-other">{item?.count}</td>
              <td className="list-table-td-other">{item?.selfSize}</td>
            </>
          );
        }}
      />
    </div>
  );
}
