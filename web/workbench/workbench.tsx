import * as React from "react";
import { observer } from "mobx-react";
import { Tab, Tabs } from "@leafygreen-ui/tabs";

import { useContributions, useService } from "@/web/utils";
import { WorkbenchService } from "@/web/service";
import { WorkbenchTabContribution } from "@/web/contribution";

import "./tabs";
import "./workbench.less";

export const Workbench = observer(() => {
  const wbService = useService(WorkbenchService);
  const tabList = useContributions(WorkbenchTabContribution);

  return (
    <Tabs
      selected={wbService.model.tabIndex}
      setSelected={wbService.model.setTabIndex}
      aria-label="tab"
      className="workbench-main"
    >
      {tabList.map((t) => (
        <Tab
          name={t.name}
          key={t.name}
          data-tab={t.name}
          className="workbench-tab-pane"
        >
          <div className="workbench-tab-pane-wrap">
            <t.render />
          </div>
        </Tab>
      ))}
    </Tabs>
  );
});
