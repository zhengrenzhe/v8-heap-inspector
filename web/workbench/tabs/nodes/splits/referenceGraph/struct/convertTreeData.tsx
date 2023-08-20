import React from "react";
import { DataNode } from "rc-tree/lib/interface";
import { Text, Tooltip } from "@fluentui/react-components";

import { NodeFullInfoReturnValue } from "@/binding";
import { filterNotNullable, getNodeIcon, joinElements } from "@/web/utils";

import { EDGE_STYLE_MAP, NODE_STYLE_MAP } from "./colorMap";
import { capitalize } from "lodash";

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
  startNodeIdx: number,
  nodeTreeMap: Record<number, NodeFullInfoReturnValue>,
  fromNodeIdx: string,
  expandedKeys: string[],
): DataNode | null {
  const node = nodeTreeMap[startNodeIdx];
  if (!node) return null;

  const key = `${fromNodeIdx}-${node.info.id}`;

  const title = (
    <div>
      {joinElements(
        [...getEdgeInfo(node), getNodeInfo(node)],
        <Text key="spliter" className="node-info-spliter">
          ::
        </Text>,
      )}
    </div>
  );

  const children = (() => {
    if (!expandedKeys.includes(key)) return [];

    return node.childNodesIdx
      .map((n) => convertTreeData(n, nodeTreeMap, key, expandedKeys))
      .filter(filterNotNullable)
      .sort((a, b) => {
        const a_edge_type: string = (a as any).heapNodePayload.fromEdges
          ?.map((e: any) => e.edgeType)
          .join("-");

        const b_edge_type: string = (b as any).heapNodePayload.fromEdges
          ?.map((e: any) => e.edgeType)
          .join("-");

        if (a_edge_type !== b_edge_type) {
          return a_edge_type.localeCompare(b_edge_type);
        }

        return a.key.toString().localeCompare(b.key.toString());
      });
  })();

  return {
    title,
    icon: getNodeIcon(node),
    key,
    isLeaf: !node.hasChildren,
    children,
    heapNodePayload: node,
  } as DataNode;
}
