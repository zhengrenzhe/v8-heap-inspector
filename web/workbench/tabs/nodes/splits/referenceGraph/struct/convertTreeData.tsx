import React from "react";
import { DataNode } from "rc-tree/lib/interface";
import { Text, Tooltip } from "@fluentui/react-components";

import { NodeFullInfoReturnValue } from "@/binding";
import { filterNotNullable, getNodeIcon, joinElements } from "@/web/utils";

import { EDGE_STYLE_MAP, NODE_STYLE_MAP } from "./colorMap";

function getEdgeInfo(node: NodeFullInfoReturnValue) {
  if (!node.fromEdges) return [];

  return joinElements(
    node.fromEdges.map((e, i) => (
      <Tooltip
        content={e.edgeType}
        relationship="description"
        key={`${e.edgeName}-${i}`}
        appearance="inverted"
      >
        <Text font="monospace" size={200} style={EDGE_STYLE_MAP[e.edgeType]}>
          {e.edgeName}
        </Text>
      </Tooltip>
    )),
    " / ",
  );
}

function getNodeInfo(node: NodeFullInfoReturnValue) {
  const {
    info: { nodeIdx, nodeType, name },
  } = node;

  const nodeTypeStr = (() => {
    if (nodeType.includes("string")) return `"${name}"`;
    if (nodeType === "closure") return `${name}()`;
    if (nodeType === "regexp") return `/${name}/`;
    return name;
  })();

  return (
    <Tooltip
      content={nodeType}
      relationship="description"
      key={nodeIdx}
      appearance="inverted"
    >
      <Text>
        <Text font="monospace" size={200} style={NODE_STYLE_MAP[nodeType]}>
          {nodeTypeStr}
        </Text>
        <Text font="monospace" size={200} className="node-id">
          @{node.info.id}
        </Text>
      </Text>
    </Tooltip>
  );
}

export function convertTreeData(
  startNode: NodeFullInfoReturnValue,
  nodeTreeMap: Record<number, NodeFullInfoReturnValue>,
  fromPath: string,
  expandedKeys: string[],
): DataNode {
  const key = `${fromPath}-${startNode.info.nodeIdx}`;

  const title = (
    <div>
      {joinElements(
        [...getEdgeInfo(startNode), getNodeInfo(startNode)],
        <Text key="spliter" className="node-info-spliter">
          ::
        </Text>,
      )}
    </div>
  );

  const children = (
    startNode.children.length !== 0
      ? startNode.children
      : startNode.childrenIdx
          .map((i) => nodeTreeMap[i])
          .filter(filterNotNullable)
  )
    .sort((a, b) => {
      if (a.info.nodeType !== b.info.nodeType) {
        return a.info.nodeType.localeCompare(b.info.nodeType);
      }

      return a.info.name.localeCompare(b.info.name);
    })
    .map((c) => convertTreeData(c, nodeTreeMap, key, expandedKeys));

  return {
    title,
    icon: getNodeIcon(startNode),
    key,
    isLeaf: !startNode.hasChildren,
    children,
    heapNodePayload: startNode,
  } as DataNode;
}
