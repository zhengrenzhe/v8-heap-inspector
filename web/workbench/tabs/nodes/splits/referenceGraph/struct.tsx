import React, { useCallback } from "react";
import { observer } from "mobx-react";
import Tree from "rc-tree";
import { DataNode, EventDataNode } from "rc-tree/lib/interface";
import "rc-tree/assets/index.css";

import { ConstructorService } from "@/web/service";
import { useService } from "@/web/utils";
import { NodeFullInfoReturnValue } from "@/binding";

function convertTreeData(
  start: NodeFullInfoReturnValue,
  pos: number[]
): DataNode {
  const currentNode: DataNode = {
    title: `${start.abstractInfo.name} @${start.abstractInfo.id}`,
    nodeIdx: start.abstractInfo.nodeIdx,
    key: `${pos.join("-")}`,
    children: start.children
      .map((toNode, idx) => convertTreeData(toNode, pos.concat(idx)))
  };

  return currentNode;
}

export const Struct = observer(() => {
  const csSrv = useService(ConstructorService);
  const nodeReferences = csSrv.viewModel.nodeReferences;

  const loadData = useCallback((treeNode: EventDataNode<DataNode>) => {
    return new Promise<void>(async (r) => {
      console.log(treeNode);
      await csSrv.loadNodeReference(parseInt(treeNode.nodeIdx.toString()));
      r();
    });
  }, []);

  if (!nodeReferences) {
    return null;
  }

  const treeData = convertTreeData(nodeReferences, [0]);

  return (
    <div className="split-root">
      <Tree
        treeData={[treeData]}
        height={300}
        virtual={true}
        loadData={loadData}
      />
    </div>
  );
});
