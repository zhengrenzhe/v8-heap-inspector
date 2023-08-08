import React from "react";
import { observer } from "mobx-react";
import { Badge } from "@fluentui/react-components";

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
          { columnTitle: "Name", row: (item) => <span>{item.name}</span> },
          { columnTitle: "ID", row: (item) => <span>{item.id}</span> },
          {
            columnTitle: "Type",
            row: (item) => <Badge>{item.nodeType}</Badge>,
          },
          {
            columnTitle: "Self Size",
            row: (item) => <span>{item.selfSize}</span>,
          },
        ]}
        onRowClick={(item) => csSrv.getInitialNodeReference(item.nodeIdx)}
      />
    </div>
  );
});
