import * as React from "react";
import { createRoot } from "react-dom/client";

import { Workbench } from "./workbench";

const App = () => <Workbench />;

const root = createRoot(document.getElementById("app-root")!);
root.render(<App />);
