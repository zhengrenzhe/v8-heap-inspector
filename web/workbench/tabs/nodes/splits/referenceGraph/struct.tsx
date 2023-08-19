import React, { useCallback } from "react";
import { observer } from "mobx-react";
import Tree from "rc-tree";
import { DataNode, EventDataNode } from "rc-tree/lib/interface";
import "rc-tree/assets/index.css";
import { Text, tokens } from "@fluentui/react-components";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";

import { ConstructorService } from "@/web/service";
import { filterNotNullable, getNodeIcon, useService } from "@/web/utils";
import { NodeFullInfoReturnValue } from "@/binding";

import "./struct.less";

function convertTreeData(
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
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  } as DataNode;

  return currentNode;
}

export const Struct = observer(() => {
  const csSrv = useService(ConstructorService);
  const { startNodeIdx, nodeTreeMap, expandedKeys } = csSrv.viewModel;

  const loadData = useCallback((treeNode: EventDataNode<DataNode>) => {
    return new Promise<void>(async (r) => {
      const node = (treeNode as any).heapNodePayload as NodeFullInfoReturnValue;
      await csSrv.loadNodeReference(node.info.nodeIdx);
      r();
    });
  }, []);

  if (!nodeTreeMap[startNodeIdx]) {
    return (
      <Text align="center" style={{ margin: "auto" }}>
        No instance selected
      </Text>
    );
  }

  const tree = convertTreeData(startNodeIdx, nodeTreeMap, "root", expandedKeys);
  if (!tree) {
    return (
      <Text align="center" style={{ margin: "auto" }}>
        convertTreeData failed
      </Text>
    );
  }

  return (
    <div className="split-root">
      <Tree
        treeData={[tree]}
        selectable={false}
        itemHeight={24}
        switcherIcon={(p) => {
          return (
            <span
              style={{
                background: tokens.colorNeutralBackground1,
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.isLeaf ? null : p.expanded ? (
                <VscChevronDown />
              ) : (
                <VscChevronRight />
              )}
            </span>
          );
        }}
        rootClassName="struct-tree"
        showLine
        loadData={loadData}
        expandedKeys={expandedKeys}
        onExpand={(keys) =>
          csSrv.viewModel.setData("expandedKeys", keys as string[])
        }
      />
    </div>
  );
});
