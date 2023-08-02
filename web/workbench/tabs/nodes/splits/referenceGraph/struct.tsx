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
  pathIdx: number[]
): DataNode {
  const path = pathIdx.concat(start.info.nodeIdx);
  const currentNode: DataNode = {
    title: `${start.info.name} @${start.info.id}`,
    key: path.join("-"),
    children: start.children.map((toNode) =>
      convertTreeData(toNode, path),
    ),
  };

  return currentNode;
}

export const Struct = observer(() => {
  const csSrv = useService(ConstructorService);
  const nodeReferences = csSrv.viewModel.nodeReferences;

  const loadData = useCallback((treeNode: EventDataNode<DataNode>) => {
    return new Promise<void>(async (r) => {
      const path = treeNode.key.toString().split("-").map((x) => parseInt(x));
      await csSrv.loadNodeReference(path);
      r();
    });
  }, []);

  if (!nodeReferences) {
    return null;
  }

  const treeData = convertTreeData(nodeReferences, []);

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
