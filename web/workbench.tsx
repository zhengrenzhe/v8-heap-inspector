import * as React from "react";
import { observer } from "mobx-react";
import { Tab, Tabs } from "@leafygreen-ui/tabs";

import "./workbench.less";
import { useService } from "./di";
import { WorkbenchService } from "./workbenchModel";
import { Constructors } from "./constructors";
import { Statistics } from "./statistics";

const tabList = [Constructors, Statistics];

export const Workbench = observer(() => {
  const srv = useService(WorkbenchService);

  return (
    <Tabs
      selected={srv.model.tabIndex}
      setSelected={srv.model.setTabIndex}
      aria-label="tab"
      className="workbench-main"
    >
      <Tab
        className="tab-logo"
        disabled
        name={<img src="https://v8.dev/_img/v8-outline.svg" />}
      />
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
