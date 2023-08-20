import React from "react";
import {
  VscSymbolArray,
  VscSymbolConstant,
  VscSymbolNamespace,
  VscSymbolNumeric,
  VscSymbolString,
  VscSymbolVariable,
} from "react-icons/vsc";
import { PiFunction } from "react-icons/pi";
import { BsRegex } from "react-icons/bs";

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
      return <VscSymbolNamespace />;
    case "array":
      return <VscSymbolArray />;
    case "string":
      return <VscSymbolString />;
    case "object shape":
      return <VscSymbolVariable />;
    case "number":
    case "bigint":
      return <VscSymbolNumeric />;
    case "regexp":
      return <BsRegex />;
    case "closure":
    case "code":
      return <PiFunction />;
    default:
      return <VscSymbolConstant />;
  }
}
