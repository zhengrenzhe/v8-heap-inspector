import { Allotment } from "allotment";
import React from "react";
import { Struct } from "./struct";

export const ReferenceGraph = () => {
  return (
    <div className="split-root">
      <Allotment vertical>
        <Allotment.Pane minSize={300} preferredSize={300} key="struct">
          <Struct />
        </Allotment.Pane>
        <Allotment.Pane key="graph">B</Allotment.Pane>
      </Allotment>
    </div>
  );
};
