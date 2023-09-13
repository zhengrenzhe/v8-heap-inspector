import React, { useCallback } from "react";
import { observer } from "mobx-react";
import Tree from "rc-tree";
import { DataNode, EventDataNode } from "rc-tree/lib/interface";
import "rc-tree/assets/index.css";
import { Text, tokens } from "@fluentui/react-components";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";

import { ConstructorService } from "@/web/service";
import { useService } from "@/web/utils";
import { NodeFullInfoReturnValue } from "@/binding";

import { convertTreeData } from "./convertTreeData";
import "./tree.less";

export const Struct = observer(() => {
  const csSrv = useService(ConstructorService);
  const { startNodeIdx, nodeTreeMap, expandedKeys } = csSrv.viewModel;

  const loadData = useCallback((treeNode: EventDataNode<DataNode>) => {
    return new Promise<void>(async (r) => {
      const node = (treeNode as any).heapNodePayload as NodeFullInfoReturnValue;
      const fromNode = (treeNode as any)
        .fromHeapNodePayload as NodeFullInfoReturnValue;
      await csSrv.loadNodeReference(node.info.nodeIdx, fromNode?.info.nodeIdx);
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

  const tree = convertTreeData(
    nodeTreeMap[startNodeIdx]!,
    nodeTreeMap,
    "root",
    expandedKeys,
  );
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
        switcherIcon={(p) => (
          <span
            className="switcher-icon"
            style={{ background: tokens.colorNeutralBackground1 }}
          >
            {p.isLeaf ? null : p.expanded ? (
              <VscChevronDown />
            ) : (
              <VscChevronRight />
            )}
          </span>
        )}
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
