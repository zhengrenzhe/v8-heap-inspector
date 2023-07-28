import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import Tree from "rc-tree";
import { DataNode, EventDataNode } from "rc-tree/lib/interface";
import "rc-tree/assets/index.css";

import { ConstructorService } from "@/web/service";
import { useService } from "@/web/utils";
import { EdgeInfoReturnValue, NodeFullInfoReturnValue } from "@/binding";

function convertTreeData(
  current: NodeFullInfoReturnValue,
  fromEdge?: EdgeInfoReturnValue,
): DataNode {
  return {
    title: `${current.abstractInfo.name} ${fromEdge?.edgeType}`,
    key: current.abstractInfo.nodeIdx,
  };
}

function walkDownFind(
  node: DataNode,
  tester: (n: DataNode) => boolean,
): DataNode | undefined {
  if (tester(node)) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const n = walkDownFind(child, tester);
      if (n) {
        return n;
      }
    }
  }

  return undefined;
}

export const Struct = observer(() => {
  const csSrv = useService(ConstructorService);

  const nodeReferences = csSrv.viewModel.nodeReferences;
  const startNode = nodeReferences.find(
    (n) => n.abstractInfo.nodeIdx === csSrv.viewModel.startNodeIdx,
  );

  const [treeData, setTreeData] = useState<DataNode | null>(null);

  useEffect(() => {
    if (startNode) {
      setTreeData(convertTreeData(startNode));
    }
  }, [startNode]);

  const loadData = useCallback((treeNode: EventDataNode<DataNode>) => {
    return new Promise<void>(async (resolve) => {
      if (treeNode.children) {
        resolve();
        return;
      }

      const d = await csSrv.getNodeReference(
        parseInt(treeNode.key.toString()),
        1,
      );

      setTreeData((prev) => {
        if (!prev) {
          return prev;
        }

        const target = walkDownFind(prev, (n) => n.key === treeNode.key);
        if (target) {
          const children = d
            .filter((n) => n.abstractInfo.nodeIdx !== treeNode.key)
            .map((n) => convertTreeData(n));

          target.children = children;
        }

        return prev;
      });

      resolve();
    });
  }, []);

  if (!treeData) {
    return null;
  }

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
