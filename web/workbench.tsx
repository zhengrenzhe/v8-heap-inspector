import * as React from "react";
import {
  Divider,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from "@fluentui/react-components";
import { atom, useRecoilState } from "recoil";
import { SearchTab } from "./search/searchTab";

const workbenchState = atom({
  key: "workbench",
  default: {
    items: ["search", "statistics"],
    currentIndex: 0,
  },
});

const i18n: Record<string, string> = {
  search: "搜索",
  statistics: "统计",
};

export const Workbench = () => {
  const [state, setState] = useRecoilState(workbenchState);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setState((old) => ({
      ...old,
      currentIndex: old.items.findIndex((item) => item === data.value),
    }));
  };

  return (
    <>
      <TabList
        selectedValue={state.items[state.currentIndex]}
        onTabSelect={onTabSelect}
        size="small"
      >
        {state.items.map((item) => (
          <Tab id={item} value={item} key={item}>
            <span style={{ fontSize: 12 }}>{i18n[item]}</span>
          </Tab>
        ))}
      </TabList>
      <Divider appearance="subtle" />
      <div className="tab-root">
        <SearchTab
          style={{
            display: state.currentIndex === 0 ? "block" : "none",
            height: "100%",
          }}
        />
      </div>
    </>
  );
};
