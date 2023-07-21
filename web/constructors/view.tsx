import React, { useState } from "react";
import Card from "@leafygreen-ui/card";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import "./style.less";
import { ConstructorsItems } from "./ConstructorsItems";

export function ConstructorsView() {
  return (
    <div className="constructors-view">
      <Allotment separator={false}>
        <Allotment.Pane
          minSize={300}
          preferredSize={340}
          className="constructors-col"
        >
          <Card darkMode={false} className="constructors-card">
            <ConstructorsItems />
          </Card>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={300}
          preferredSize={340}
          className="constructors-col"
        >
          <Card>Pane 1</Card>
        </Allotment.Pane>
        <Allotment.Pane minSize={300} className="constructors-col">
          <Card>Pane 2</Card>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
