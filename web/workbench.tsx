import * as React from "react";
import {
  Divider,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from "@fluentui/react-components";
import { atom, useRecoilState } from "recoil";

import "./workbench.less";

import { Constructors } from "./constructors";
import { Statistics } from "./statistics";

const Tabs = [Constructors, Statistics];

const workbenchState = atom({
  key: "workbenchState",
  default: {
    items: Tabs.map((t) => t.name),
    currentIndex: 0,
  },
});

export const Workbench = () => {
  const [state, setState] = useRecoilState(workbenchState);

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setState((old) => ({
      ...old,
      currentIndex: data.value as number,
    }));
  };

  return (
    <>
      <TabList
        selectedValue={state.currentIndex}
        onTabSelect={onTabSelect}
        size="small"
      >
        {state.items.map((item, index) => (
          <Tab id={item} value={index} key={item}>
            <span style={{ fontSize: 12 }}>{item}</span>
          </Tab>
        ))}
      </TabList>
      <Divider appearance="subtle" />
      <div className="tab-root">
        {Tabs.map((t, idx) => (
          <t.render
            key={t.name}
            style={{
              height: "100%",
              display: idx === state.currentIndex ? "flex" : "none",
            }}
          />
        ))}
      </div>
    </>
  );
};
