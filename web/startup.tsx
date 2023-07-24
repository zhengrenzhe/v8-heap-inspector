import * as React from "react";
import { createRoot } from "react-dom/client";
import "reflect-metadata";
import { configure } from "mobx";

configure({
  useProxies: "always",
  enforceActions: "always",
});

import { Workbench } from "./workbench/workbench";

const App = () => <Workbench />;

const root = createRoot(document.getElementById("app-root")!);
root.render(<App />);
