import React, { useState } from "react";
import axios from "axios";
import { TableVirtuoso } from "react-virtuoso";
import { BsSortDown, BsFilterCircle, BsRecycle } from "react-icons/bs";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import IconButton from "@leafygreen-ui/icon-button";
import TextInput from "@leafygreen-ui/text-input";
import Highlighter from "react-highlight-words";
import { useRequest } from "ahooks";

import { API_get_all_constructors } from "../api";
import { GetAllConstructorsReturnValue } from "../../binding";

export function ConstructorsItems() {
  const { data } = useRequest<GetAllConstructorsReturnValue, any>(
    async () => (await axios.get(API_get_all_constructors)).data,
    {
      cacheKey: "GetAllConstructorsReturnValue",
      staleTime: Number.MAX_SAFE_INTEGER,
    },
  );

  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [sortBySize, setSortBySize] = useState(false);

  let constructors = (data?.constructors || [])
    .filter((c) => c.name.toLowerCase().includes(filterName.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (sortBySize) {
    constructors = constructors.sort((a, b) => b.selfSize - a.selfSize);
  }

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
      <div>
        <IconButton
          aria-label="filter"
          title="filter by name"
          active={showFilter}
          onClick={() => setShowFilter(!showFilter)}
        >
          <BsFilterCircle />
        </IconButton>
        <IconButton
          aria-label="filter"
          title="sory by self size"
          active={sortBySize}
          onClick={() => setSortBySize(!sortBySize)}
          style={{ margin: 4 }}
        >
          <BsSortDown />
        </IconButton>
      </div>
      {showFilter && (
        <TextInput
          aria-labelledby="filter"
          sizeVariant="xsmall"
          baseFontSize={13}
          style={{ margin: "6px 0" }}
          placeholder="filter by constructor name"
          autoFocus
          onChange={(e) => setFilterName(e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setFilterName("");
              setShowFilter(false);
            }
          }}
        />
      )}
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
          <tr className="list-table-head">
            <th>
              <Body weight="medium">Names</Body>
            </th>
            <th style={{ width: 60 }}>
              <Body weight="medium">Count</Body>
            </th>
            <th style={{ width: 80 }}>
              <Body weight="medium">Self Size</Body>
            </th>
          </tr>
        )}
        itemContent={(index) => {
          const item = constructors[index];
          return (
            <>
              <td className="list-table-td-name" title={item.name}>
                <InlineCode>
                  <Highlighter
                    searchWords={[filterName]}
                    autoEscape={true}
                    textToHighlight={item.name}
                  />
                </InlineCode>
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
