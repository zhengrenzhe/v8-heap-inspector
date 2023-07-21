import React, { useState } from "react";
import Card from "@leafygreen-ui/card";
import { Allotment } from "allotment";
import { H1, H2 } from "@leafygreen-ui/typography";
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
          <Card className="constructors-card">
            <H2 className="constructors-title">Constructors</H2>
            <ConstructorsItems />
          </Card>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={300}
          preferredSize={340}
          className="constructors-col"
        >
          <Card className="constructors-card">
            <H2 className="constructors-title">Instances</H2>
            Pane 1
          </Card>
        </Allotment.Pane>
        <Allotment.Pane minSize={300} className="constructors-col">
          <Card className="constructors-card">
            <H2 className="constructors-title">Reference Graph</H2>
            Pane 2
          </Card>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
