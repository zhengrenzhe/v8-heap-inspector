import React from "react";
import { Body } from "@leafygreen-ui/typography";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { contributionImplement } from "@/web/utils";
import { WorkbenchTabContribution } from "@/web/contribution";

import { ConstructorList } from "./splits/constructorList";
import { InstanceList } from "./splits/instanceList";
import "./style.less";
import { palette } from "@leafygreen-ui/palette";

const pane = [
  {
    title: "Constructors",
    render: ConstructorList,
    minSize: 280,
    preferredSize: 340,
  },
  {
    title: "Instances",
    render: InstanceList,
    minSize: 280,
    preferredSize: 340,
  },
  {
    title: "Reference Graph",
    render: () => null,
    minSize: 0,
  },
];

@contributionImplement()
export class NodesTabContribution extends WorkbenchTabContribution {
  public name = "Nodes";

  public render = () => (
    <div className="nodes-view">
      <Allotment>
        {pane.map((p) => (
          <Allotment.Pane
            minSize={p.minSize}
            preferredSize={p.preferredSize}
            key={p.title}
          >
            <div className="nodes-pane">
              <Body
                className="nodes-pane-title"
                style={{ background: palette.gray.light3 }}
              >
                {p.title}
              </Body>
              <p.render />
            </div>
          </Allotment.Pane>
        ))}
      </Allotment>
    </div>
  );
}
