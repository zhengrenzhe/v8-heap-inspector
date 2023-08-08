import React from "react";
import { observer } from "mobx-react";
import { BsFilter, BsSortDown, BsSortUp } from "react-icons/bs";
import { VscInspect } from "react-icons/vsc";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Spinner,
  Text,
} from "@fluentui/react-components";

import { Copy, useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils/";

const FilterBar = observer(() => {
  const csSrv = useService(ConstructorService);
  const { sortSizeMode, toggleSortSizeMode, setFilter } = csSrv.viewModel;

  return (
    <div className="filter-actions" style={{ padding: "0 8px 4px" }}>
      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button
            size="small"
            icon={<BsFilter style={{ fontSize: 15 }} />}
            style={{ borderRadius: "100%" }}
          />
        </PopoverTrigger>

        <PopoverSurface>
          <div>
            <Input
              style={{ margin: "6px 0" }}
              placeholder="filter by constructor name"
              autoFocus
              onChange={(e) =>
                setFilter("constructorName", e.target.value.trim())
              }
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
          </div>
        </PopoverSurface>
      </Popover>
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
                    <Text font="monospace">
                      <Highlighter
                        searchWords={[csSrv.viewModel.filter.constructorName]}
                        autoEscape={true}
                        textToHighlight={item.name}
                      />
                    </Text>
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
