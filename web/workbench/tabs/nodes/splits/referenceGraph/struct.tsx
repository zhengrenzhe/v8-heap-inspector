import React, { useCallback } from "react";
import { observer } from "mobx-react";
import Tree from "rc-tree";
import { VscJson, VscSymbolArray, VscSymbolString } from "react-icons/vsc";
import { DataNode, EventDataNode } from "rc-tree/lib/interface";
import "rc-tree/assets/index.css";
import { Text } from "@fluentui/react-components";

import { ConstructorService } from "@/web/service";
import { useService } from "@/web/utils";
import { NodeFullInfoReturnValue } from "@/binding";

function getType(node: NodeFullInfoReturnValue) {
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

function getNodeIcon(node: NodeFullInfoReturnValue) {
  switch (getType(node)) {
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

function convertTreeData(
  start: NodeFullInfoReturnValue,
  pathIdx: number[],
): DataNode {
  const path = pathIdx.concat(start.info.nodeIdx);
  const currentNode: DataNode = {
    title: (
      <span>{`${start.fromEdgeName} :: ${start.info.name} @${start.info.id}`}</span>
    ),
    icon: getNodeIcon(start),
    key: path.join("-"),
    children: start.children.map((toNode) => convertTreeData(toNode, path)),
  };

  return currentNode;
}

export const Struct = observer(() => {
  const csSrv = useService(ConstructorService);
  const nodeReferences = csSrv.viewModel.nodeReferences;

  const loadData = useCallback((treeNode: EventDataNode<DataNode>) => {
    return new Promise<void>(async (r) => {
      const path = treeNode.key
        .toString()
        .split("-")
        .map((x) => parseInt(x));
      await csSrv.loadNodeReference(path);
      r();
    });
  }, []);

  if (!nodeReferences) {
    return (
      <Text align="center" style={{ margin: "auto" }}>
        No instance selected
      </Text>
    );
  }

  return (
    <div className="split-root">
      <Tree
        treeData={[convertTreeData(nodeReferences, [])]}
        height={300}
        virtual={true}
        loadData={loadData}
      />
    </div>
  );
});
