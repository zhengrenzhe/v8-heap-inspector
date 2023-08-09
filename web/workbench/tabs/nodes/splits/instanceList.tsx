import React from "react";
import { observer } from "mobx-react";
import { Badge, Text } from "@fluentui/react-components";

import { useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils";

export const InstanceList = observer(() => {
  const csSrv = useService(ConstructorService);

  if (!csSrv.viewModel.instancesReady) {
    return null;
  }

  if (csSrv.viewModel.instances.length === 0) {
    return <span>No instances</span>;
  }

  return (
    <div className="split-root">
      <TableList
        data={csSrv.viewModel.instances}
        column={[
          {
            columnTitle: "Name",
            row: (item) => (
              <Text font="monospace" size={200}>
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
