import * as React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";

import { Workbench } from "./workbench";

const App = () => {
  return (
    <RecoilRoot>
      <Workbench />
    </RecoilRoot>
  );
};

const root = createRoot(document.getElementById("app-root")!);
root.render(<App />);
