import React from "react";
import { DataNode } from "rc-tree/lib/interface";
import { Text } from "@fluentui/react-components";

import { NodeFullInfoReturnValue } from "@/binding";
import { filterNotNullable, getNodeIcon } from "@/web/utils";

export function convertTreeData(
  startNodeIdx: number,
  nodeTreeMap: Record<number, NodeFullInfoReturnValue>,
  fromNodeIdx: string,
  expandedKeys: string[],
): DataNode | null {
  const node = nodeTreeMap[startNodeIdx]!;
  if (!node) {
    return null;
  }

  const key = `${fromNodeIdx}-${node.info.id}`;

  const currentNode: DataNode = {
    title: (
      <Text font="monospace" size={200}>
        {[
          node.fromEdges?.map((e) => e.edgeName).join("::"),
          `${node.info.name} @${node.info.id}`,
        ]
          .filter(filterNotNullable)
          .join(" :: ")}
      </Text>
    ),
    icon: getNodeIcon(node),
    key,
    isLeaf: !node.hasChildren,
    children: expandedKeys.includes(key)
      ? node.childNodesIdx
          .map((toNodeIdx) =>
            convertTreeData(toNodeIdx, nodeTreeMap, key, expandedKeys),
          )
          .filter(filterNotNullable)
          .sort((a, b) => a.key.toString().localeCompare(b.key.toString()))
      : [],
    heapNodePayload: node,
  } as DataNode;

  return currentNode;
}
