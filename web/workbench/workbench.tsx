import React, { cloneElement } from "react";
import { observer } from "mobx-react";
import {
  Button,
  Divider,
  FluentProvider,
  Tooltip,
  webLightTheme,
  Image,
} from "@fluentui/react-components";

import { useContributions, useService } from "@/web/utils";
import { WorkbenchTabContribution } from "@/web/contribution";
import { WorkbenchService } from "@/web/service";

import "./tabs";
import "./workbench.less";

const SideBar = observer(() => {
  const tabList = useContributions(WorkbenchTabContribution);
  const wbService = useService(WorkbenchService);

  return (
    <div id="workbench-sidebar">
      <Image src="https://v8.dev/_img/v8-outline.svg" style={{ width: 26 }} />
      {tabList.map((t, i) => (
        <Tooltip
          key={t.name}
          content={t.name}
          relationship="description"
          positioning="after"
        >
          <Button
            appearance="subtle"
            icon={cloneElement(t.icon, {
              style: {
                fontSize: "15px",
              },
            })}
            className={[
              wbService.model.activeTab
                ? wbService.model.activeTab === t.name
                  ? "workbench-sidebar-button-active"
                  : ""
                : i === 0
                ? "workbench-sidebar-button-active"
                : "",
              "workbench-sidebar-button",
            ].join(" ")}
            onClick={() => wbService.model.setActiveTabName(t.name)}
          />
        </Tooltip>
      ))}
    </div>
  );
});

const Pane = observer(() => {
  const tabList = useContributions(WorkbenchTabContribution);
  const wbService = useService(WorkbenchService);

  return (
    <div id="workbench-pane-container">
      {tabList.map((t, i) => (
        <div
          key={t.name}
          className="workbench-pane-wapper"
          style={{
            display: wbService.model.activeTab
              ? wbService.model.activeTab === t.name
                ? "block"
                : "none"
              : i === 0
              ? "block"
              : "none",
          }}
        >
          <t.render />
        </div>
      ))}
    </div>
  );
});

export const Workbench = observer(() => {
  return (
    <FluentProvider theme={webLightTheme} id="FluentProvider">
      <div id="workbench-root">
        <SideBar />
        <Divider vertical id="workbench-divider" />
        <Pane />
      </div>
    </FluentProvider>
  );
});
