import * as React from "react";
import { observer } from "mobx-react";
import { Tab, Tabs } from "@leafygreen-ui/tabs";

import "./workbench.less";
import { useService } from "./di";
import { WorkbenchService } from "./workbenchModel";

export const Workbench = observer(() => {
  const srv = useService(WorkbenchService);
  console.log(srv.model);

  return (
    <Tabs
      selected={srv.model.tabIndex}
      setSelected={(v) => srv.model.setTabIndex(v)}
      aria-label="tab"
    >
      <Tab name="First Tab">Tab 1</Tab>
      <Tab name="Second Tab">Tab 2</Tab>
    </Tabs>
  );
});
