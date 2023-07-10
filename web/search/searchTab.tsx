import * as React from "react";
import { CSSProperties } from "react";
import { List } from "./list";
import { Retained } from "./retained";
import { Graph } from "./graph";

export const SearchTab = (props: { style: CSSProperties }) => {
  return (
    <div style={props.style}>
      <List style={{ width: "400px", height: "100%" }} />
      <Retained />
      <Graph />
    </div>
  );
};
