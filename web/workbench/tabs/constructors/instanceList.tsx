import React from "react";
import { observer } from "mobx-react";
import { Body } from "@leafygreen-ui/typography";

import { useService } from "@/web/utils";
import { ConstructorService } from "@/web/service";
import { TableList } from "./tableView";

export const InstanceList = observer(() => {
  const csSrv = useService(ConstructorService);

  if (!csSrv.viewModel.instancesReady) {
    return <Body>Please select constructor</Body>;
  }

  if (csSrv.viewModel.instances.length === 0) {
    return <Body>No instances</Body>;
  }

  return (
    <div className="instance-list">
      <TableList
        data={csSrv.viewModel.instances}
        column={[
          { columnTitle: "Name", row: (item) => item.name },
          { columnTitle: "ID", row: (item) => item.id },
          { columnTitle: "Type", row: (item) => item.nodeType },
          { columnTitle: "Self Size", row: (item) => item.selfSize },
        ]}
      />
    </div>
  );
});
