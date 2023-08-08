import React from "react";
import { FaCircleNodes } from "react-icons/fa6";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Caption1Strong } from "@fluentui/react-components";

import { contributionImplement } from "@/web/utils";
import { WorkbenchTabContribution } from "@/web/contribution";

import { ConstructorList } from "./splits/constructorList";
import { InstanceList } from "./splits/instanceList";
import { ReferenceGraph } from "./splits/referenceGraph";
import "./style.less";

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
    render: ReferenceGraph,
    minSize: 0,
  },
];

@contributionImplement()
export class NodesTabContribution extends WorkbenchTabContribution {
  public name = "Nodes";

  public icon = (<FaCircleNodes />);

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
              <Caption1Strong className="nodes-pane-title">
                {p.title}
              </Caption1Strong>
              <p.render />
            </div>
          </Allotment.Pane>
        ))}
      </Allotment>
    </div>
  );
}
