import React from "react";
import { observer } from "mobx-react";
import { Body } from "@leafygreen-ui/typography";

import { useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "@/web/utils";
import Badge from "@leafygreen-ui/badge";

export const InstanceList = observer(() => {
  const csSrv = useService(ConstructorService);

  if (!csSrv.viewModel.instancesReady) {
    return <Body>Please select constructor</Body>;
  }

  if (csSrv.viewModel.instances.length === 0) {
    return <Body>No instances</Body>;
  }

  return (
    <div className="split-root">
      <TableList
        data={csSrv.viewModel.instances}
        column={[
          { columnTitle: "Name", row: (item) => <Body>{item.name}</Body> },
          { columnTitle: "ID", row: (item) => <Body>{item.id}</Body> },
          {
            columnTitle: "Type",
            row: (item) => <Badge variant="green">{item.nodeType}</Badge>,
          },
          {
            columnTitle: "Self Size",
            row: (item) => <Body>{item.selfSize}</Body>,
          },
        ]}
        onRowClick={(item) => csSrv.getInitialNodeReference(item.nodeIdx)}
      />
    </div>
  );
});
