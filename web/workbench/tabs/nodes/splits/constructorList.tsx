import React from "react";
import { observer } from "mobx-react";
import { BsSortDown, BsSortUp, BsFilterCircle } from "react-icons/bs";
import { VscInspect } from "react-icons/vsc";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import IconButton from "@leafygreen-ui/icon-button";
import TextInput from "@leafygreen-ui/text-input";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import Highlighter from "react-highlight-words";

import { Copy, useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils/";
import "./constructorList.less";

const FilterBar = observer(() => {
  const csSrv = useService(ConstructorService);
  const { showFilters, sortSizeMode, toggleSortSizeMode, setFilter, setData } =
    csSrv.viewModel;

  return (
    <div className="filter-actions">
      <IconButton
        aria-label="filter"
        title="filter by name"
        active={showFilters}
        onClick={() => {
          setData("showFilters", !showFilters);
          setFilter("constructorName", "");
        }}
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
              setData("showFilters", false);
            }
          }}
        />
      )}
    </div>
  );
});

export const ConstructorList = observer(() => {
  const csSrv = useService(ConstructorService);
  const constructors = csSrv.filtedConstructors;
  const inited = csSrv.viewModel.inited;

  return (
    <div className="split-root">
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
        <TableList
          data={constructors}
          column={[
            {
              columnTitle: "Names",
              row: (item) => {
                return (
                  <>
                    <InlineCode>
                      <Highlighter
                        searchWords={[csSrv.viewModel.filter.constructorName]}
                        autoEscape={true}
                        textToHighlight={item.name}
                      />
                    </InlineCode>
                    <Copy value={item.name} cls="list-table-td-name-copy" />
                    <VscInspect
                      onClick={() => csSrv.getInstances(item.name)}
                      className="list-table-td-name-inspect"
                    />
                  </>
                );
              },
              rowTitle: (item) => item.name,
            },
            {
              columnTitle: "Count",
              row: (item) => <Body>{item.count}</Body>,
              rowTitle: (item) => item.count.toString(),
              width: 60,
            },
            {
              columnTitle: "Self Size",
              row: (item) => <Body>{item.selfSize}</Body>,
              rowTitle: (item) => item.selfSize.toString(),
              width: 80,
            },
          ]}
        />
      ) : null}
    </div>
  );
});
