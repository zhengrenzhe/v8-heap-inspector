import React from "react";
import {
  VscSymbolArray,
  VscSymbolClass,
  VscSymbolString,
  VscSymbolVariable,
} from "react-icons/vsc";

import { NodeFullInfoReturnValue } from "@/binding";

type NODE_TYPE =
  | "hidden"
  | "array"
  | "string"
  | "object"
  | "code"
  | "closure"
  | "regexp"
  | "number"
  | "native"
  | "synthetic"
  | "concatenated string"
  | "sliced string"
  | "symbol"
  | "bigint"
  | "object shape";

export function getNodeType(node: NodeFullInfoReturnValue): NODE_TYPE {
  if (node.info.nodeType === "object") {
    if (node.info.name === "Array") {
      return "array";
    }
    return "object";
  }
  return node.info.nodeType as NODE_TYPE;
}

export function getNodeIcon(node: NodeFullInfoReturnValue) {
  switch (getNodeType(node)) {
    case "object":
      return <VscSymbolClass />;
    case "array":
      return <VscSymbolArray />;
    case "string":
      return <VscSymbolString />;
    case "object shape":
      return <VscSymbolVariable />;
    default:
      return null;
  }
}
