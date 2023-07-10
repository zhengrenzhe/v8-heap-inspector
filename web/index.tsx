import * as React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";

import { Workbench } from "./workbench";

const App = () => {
  return (
    <FluentProvider
      theme={webLightTheme}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <RecoilRoot>
        <Workbench />
      </RecoilRoot>
    </FluentProvider>
  );
};

const root = createRoot(document.getElementById("app-root")!);
root.render(<App />);
