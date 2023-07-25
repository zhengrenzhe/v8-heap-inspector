import React from "react";
import Card from "@leafygreen-ui/card";
import { H2 } from "@leafygreen-ui/typography";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { ConstructorList } from "./constructorList";
import { InstanceList } from "./instanceList";
import "./style.less";

export function ConstructorsView() {
  return (
    <div className="constructors-view">
      <Allotment separator={false}>
        <Allotment.Pane
          minSize={300}
          preferredSize={450}
          className="constructors-col"
        >
          <Card className="constructors-card">
            <H2 className="constructors-title">Constructors</H2>
            <ConstructorList />
          </Card>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={200}
          preferredSize={300}
          className="constructors-col"
        >
          <Card className="constructors-card">
            <H2 className="constructors-title">Instances</H2>
            <InstanceList />
          </Card>
        </Allotment.Pane>
        <Allotment.Pane className="constructors-col">
          <Card className="constructors-card">
            <H2 className="constructors-title">Reference Graph</H2>
            Pane 2
          </Card>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
