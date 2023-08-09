import React from "react";
import { observer } from "mobx-react";
import { VscInspect } from "react-icons/vsc";
import Highlighter from "react-highlight-words";
import { Spinner, Text, tokens } from "@fluentui/react-components";

import { Copy, useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils/";

import { FilterBar } from "./filterBar";

export const ConstructorList = observer(() => {
  const csSrv = useService(ConstructorService);
  const constructors = csSrv.filteredConstructors;
  const inited = csSrv.viewModel.inited;

  return (
    <div className="split-root">
      <FilterBar
        filter={{
          constructorName: csSrv.viewModel.filter.constructorName,
          onConstructorNameChanged: (value) =>
            csSrv.viewModel.setFilter("constructorName", value),
        }}
        sort={{
          sortMode: csSrv.viewModel.sortConstructorMode,
          toggleSortMode: () =>
            csSrv.viewModel.toggleSortConstructorMode("sortConstructorMode"),
        }}
      />

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
                    <Text
                      font="monospace"
                      size={200}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Highlighter
                        searchWords={[csSrv.viewModel.filter.constructorName]}
                        autoEscape={true}
                        textToHighlight={item.name}
                        highlightStyle={{
                          background: "transparent",
                          textDecoration: "underline",
                          textDecorationStyle: "wavy",
                          textDecorationColor:
                            tokens.colorPaletteLightGreenBorder2,
                          textDecorationThickness: "auto",
                          color: tokens.colorNeutralForeground1,
                        }}
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
              row: (item) => <Text size={200}>{item.count}</Text>,
              rowTitle: (item) => item.count.toString(),
              width: 60,
            },
            {
              columnTitle: "Self Size",
              row: (item) => <Text size={200}>{item.selfSize}</Text>,
              rowTitle: (item) => item.selfSize.toString(),
              width: 80,
            },
          ]}
        />
      ) : null}
    </div>
  );
});
