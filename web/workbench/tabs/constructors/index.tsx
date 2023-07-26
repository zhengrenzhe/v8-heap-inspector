import React from "react";
import { H2 } from "@leafygreen-ui/typography";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { contributionImplement } from "@/web/utils";
import { WorkbenchTabContribution } from "@/web/contribution";

import { ConstructorList } from "./splits/constructorList";
import { InstanceList } from "./splits/instanceList";
import "./style.less";

function ConstructorsView() {
  return (
    <div className="constructors-view">
      <Allotment separator={false}>
        <Allotment.Pane
          minSize={300}
          preferredSize={450}
          className="constructors-col"
        >
          <div className="constructors-card">
            <H2 className="constructors-title">List</H2>
            <ConstructorList />
          </div>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={200}
          preferredSize={300}
          className="constructors-col"
        >
          <div className="constructors-card">
            <H2 className="constructors-title">Instances</H2>
            <InstanceList />
          </div>
        </Allotment.Pane>
        <Allotment.Pane className="constructors-col">
          <div className="constructors-card">
            <H2 className="constructors-title">Reference Graph</H2>
            Pane 2
          </div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

@contributionImplement()
export class ConstructorsTabContribution extends WorkbenchTabContribution {
  public name = "Constructors";

  public render = ConstructorsView;
}
