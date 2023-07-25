import React from "react";
import { observer } from "mobx-react";
import { TableVirtuoso } from "react-virtuoso";
import { BsSortDown, BsSortUp, BsFilterCircle } from "react-icons/bs";
import { VscInspect } from "react-icons/vsc";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import IconButton from "@leafygreen-ui/icon-button";
import TextInput from "@leafygreen-ui/text-input";
import { palette } from "@leafygreen-ui/palette";
import Highlighter from "react-highlight-words";

import { Copy, useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { Spinner } from "@leafygreen-ui/loading-indicator";

const FilterBar = observer(() => {
  const csSrv = useService(ConstructorService);
  const {
    showFilters,
    sortSizeMode,
    toggleSortSizeMode,
    toggleFilters,
    setFilter,
  } = csSrv.viewModel;

  return (
    <>
      <div>
        <IconButton
          aria-label="filter"
          title="filter by name"
          active={showFilters}
          onClick={() => toggleFilters()}
        >
          <BsFilterCircle />
        </IconButton>
        <IconButton
          aria-label="filter"
          title="sory by self size"
          active={!!sortSizeMode}
          onClick={() => toggleSortSizeMode()}
          style={{ margin: 4 }}
        >
          {sortSizeMode === "asc" ? (
            <BsSortUp />
          ) : sortSizeMode === "desc" ? (
            <BsSortDown />
          ) : (
            <BsSortDown />
          )}
        </IconButton>
      </div>
      {showFilters && (
        <TextInput
          aria-labelledby="filter"
          sizeVariant="xsmall"
          baseFontSize={13}
          style={{ margin: "6px 0" }}
          placeholder="filter by constructor name"
          autoFocus
          onChange={(e) => setFilter("constructorName", e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setFilter("constructorName", "");
              toggleFilters(false);
            }
          }}
        />
      )}
    </>
  );
});

export const ConstructorList = observer(() => {
  const csSrv = useService(ConstructorService);
  const constructors = csSrv.filtedConstructors;
  const inited = csSrv.viewModel.inited;

  return (
    <div className="constructors-list">
      <FilterBar />
      {!inited ? (
        <Spinner
          description="Loading constructors..."
          displayOption="xlarge-vertical"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
          }}
        />
      ) : null}
      {inited ? (
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
          totalCount={constructors.length}
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
            if (!item) {
              return null;
            }
            return (
              <>
                <td className="list-table-td-name" title={item.name}>
                  <InlineCode>
                    <Highlighter
                      searchWords={[csSrv.viewModel.filter.constructorName]}
                      autoEscape={true}
                      textToHighlight={item.name}
                    />
                  </InlineCode>
                  <Copy value={item.name} cls="list-table-td-name-copy" />
                  <VscInspect
                    onClick={() => {}}
                    className="list-table-td-name-inspect"
                  />
                </td>
                <td
                  className="list-table-td-other"
                  title={item.count.toString()}
                >
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
      ) : null}
    </div>
  );
});
