import * as React from "react";

import "./workbench.less";
import { Tab, Tabs } from "@leafygreen-ui/tabs";

export const Workbench = () => {
  return (
    <Tabs selected={0} aria-label="tab">
      <Tab name="First Tab">Tab 1</Tab>
      <Tab name="Second Tab">Tab 2</Tab>
    </Tabs>
  );
};
