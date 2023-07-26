import React, { ReactNode } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";

interface ITableListProps<D> {
  data: D[];
  column: {
    columnTitle: string;
    row: (item: D) => ReactNode;
    rowTitle?: (item: D) => string;
    width?: number;
  }[];
}

export function TableList<D>(props: ITableListProps<D>) {
  return (
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
          <tr
            {...props}
            style={{
              ...style,
              backgroundColor:
                props["data-index"] % 2 ? palette.gray.light3 : undefined,
            }}
            className="list-table-row"
          />
        ),
      }}
      totalCount={props.data.length}
      fixedItemHeight={24}
      fixedHeaderContent={() => (
        <tr className="list-table-head">
          {props.column.map((item) => (
            <th style={{ width: item.width }} key={item.columnTitle}>
              <Body weight="medium">{item.columnTitle}</Body>
            </th>
          ))}
        </tr>
      )}
      itemContent={(index) => {
        const item = props.data[index];
        if (!item) {
          return null;
        }
        return (
          <>
            {props.column.map((col, index) => (
              <td
                title={col.rowTitle?.(item)}
                className={
                  index === 0 ? "list-table-td-name" : "list-table-td-other"
                }
                key={col.columnTitle}
              >
                {col.row(item)}
              </td>
            ))}
          </>
        );
      }}
    />
  );
}
