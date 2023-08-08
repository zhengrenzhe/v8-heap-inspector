import React from "react";
import { observer } from "mobx-react";
import { BsSortDown, BsSortUp, BsFilterCircle } from "react-icons/bs";
import { VscInspect } from "react-icons/vsc";
import Highlighter from "react-highlight-words";
import { Button, Input, Spinner } from "@fluentui/react-components";

import { Copy, useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils/";

const FilterBar = observer(() => {
  const csSrv = useService(ConstructorService);
  const { showFilters, sortSizeMode, toggleSortSizeMode, setFilter, setData } =
    csSrv.viewModel;

  return (
    <div className="filter-actions" style={{ padding: "0 8px" }}>
      <Button
        aria-label="filter"
        title="filter by name"
        icon={<BsFilterCircle />}
        onClick={() => {
          setData("showFilters", !showFilters);
          setFilter("constructorName", "");
        }}
      />

      <Button
        aria-label="filter"
        title="sory by self size"
        onClick={() => toggleSortSizeMode()}
        style={{ margin: 4 }}
        icon={
          sortSizeMode === "asc" ? (
            <BsSortUp />
          ) : sortSizeMode === "desc" ? (
            <BsSortDown />
          ) : (
            <BsSortDown />
          )
        }
      />

      {showFilters && (
        <Input
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
                    <span>
                      <Highlighter
                        searchWords={[csSrv.viewModel.filter.constructorName]}
                        autoEscape={true}
                        textToHighlight={item.name}
                      />
                    </span>
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
              row: (item) => <span>{item.count}</span>,
              rowTitle: (item) => item.count.toString(),
              width: 60,
            },
            {
              columnTitle: "Self Size",
              row: (item) => <span>{item.selfSize}</span>,
              rowTitle: (item) => item.selfSize.toString(),
              width: 80,
            },
          ]}
        />
      ) : null}
    </div>
  );
});
