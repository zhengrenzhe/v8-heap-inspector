import React from "react";
import { observer } from "mobx-react";
import { Badge, Text } from "@fluentui/react-components";

import { useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils";

import { FilterBar } from "./filterBar";

export const InstanceList = observer(() => {
  const csSrv = useService(ConstructorService);

  if (!csSrv.viewModel.instancesReady) {
    return (
      <Text align="center" style={{ margin: "auto" }}>
        No constructor selected
      </Text>
    );
  }

  if (csSrv.viewModel.instances.length === 0) {
    return (
      <Text align="center" style={{ margin: "auto" }}>
        No instances
      </Text>
    );
  }

  return (
    <div className="split-root">
      <FilterBar
        sort={{
          sortMode: csSrv.viewModel.sortInstanceMode,
          toggleSortMode: () =>
            csSrv.viewModel.toggleSortConstructorMode("sortInstanceMode"),
        }}
      />

      <TableList
        data={csSrv.filtedInstances}
        column={[
          {
            columnTitle: "Name",
            row: (item) => (
              <Text
                font="monospace"
                size={200}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.name}
              </Text>
            ),
          },
          {
            columnTitle: "ID",
            row: (item) => <Text size={200}>{item.id}</Text>,
          },
          {
            columnTitle: "Type",
            row: (item) => (
              <Badge appearance="tint" size="small">
                <Text font="monospace" size={200}>
                  {item.nodeType}
                </Text>
              </Badge>
            ),
          },
          {
            columnTitle: "Self Size",
            row: (item) => <Text size={200}>{item.selfSize}</Text>,
          },
        ]}
        onRowClick={(item) => csSrv.getInitialNodeReference(item.nodeIdx)}
      />
    </div>
  );
});
