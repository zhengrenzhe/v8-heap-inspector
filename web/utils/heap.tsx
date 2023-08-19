import React from "react";
import { VscJson, VscSymbolArray, VscSymbolString } from "react-icons/vsc";

import { NodeFullInfoReturnValue } from "@/binding";

export function getNodeType(node: NodeFullInfoReturnValue) {
  if (node.info.nodeType === "object") {
    if (node.info.name === "Array") {
      return "array";
    }
    return "object";
  }
  if (node.info.nodeType === "string") {
    return "string";
  }
  if (node.info.nodeType === "object shape") {
    return "object shape";
  }
  return "unknown";
}

export function getNodeIcon(node: NodeFullInfoReturnValue) {
  switch (getNodeType(node)) {
    case "object":
      return <VscJson />;
    case "array":
      return <VscSymbolArray />;
    case "string":
      return <VscSymbolString />;
    default:
      return null;
  }
}
