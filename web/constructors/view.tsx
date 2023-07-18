import { Divider } from "@fluentui/react-components";
import { useRequest } from "ahooks";
import axios from "axios";
import React from "react";
import {
  Tree,
  TreeItem,
  TreeItemLayout,
  useFlatTree_unstable,
  FlatTreeItemProps,
} from "@fluentui/react-components/unstable";
import { API_get_all_constructors } from "../api";
import { GetAllConstructorsReturnValue } from "../../binding";

type Item = FlatTreeItemProps & {
  name: string;
  selfSize: number;
  count: number;
};

export function ConstructorsView() {
  const { data } = useRequest<GetAllConstructorsReturnValue, any>(
    async () => (await axios.get(API_get_all_constructors)).data,
    {
      cacheKey: "GetAllConstructorsReturnValue",
      staleTime: Number.MAX_SAFE_INTEGER,
    },
  );

  const flatTree = useFlatTree_unstable(
    (data?.constructors ?? []).map<Item>((c) => ({
      value: c.name,
      name: c.name,
      selfSize: c.selfSize,
      count: c.count,
    })),
  );

  return (
    <div className="tab-pane-content" data-type="ConstructorsView">
      <div style={{ height: "100%", width: 500, overflow: "auto" }}>
        <Tree
          {...flatTree.getTreeProps()}
          aria-label="Tree"
          style={{ overflowX: "hidden" }}
        >
          {Array.from(flatTree.items(), (flatTreeItem) => {
            const { name, selfSize, count, ...treeItemProps } =
              flatTreeItem.getTreeItemProps();
            return (
              <TreeItem
                {...treeItemProps}
                key={flatTreeItem.value}
                className="tree-item tree-item-size"
              >
                <TreeItemLayout
                  className="tree-item-size"
                  style={{ width: "100%", justifyContent: "space-between" }}
                  iconAfter={
                    <div style={{ display: "flex", fontSize: 12 }}>
                      <div>x{count}</div>
                      <div style={{ marginLeft: 6 }}>{selfSize}</div>
                    </div>
                  }
                >
                  <div style={{ position: "relative" }}>{name}</div>
                </TreeItemLayout>
              </TreeItem>
            );
          })}
        </Tree>
      </div>
      <Divider appearance="subtle" vertical style={{ flexGrow: 0 }} />
    </div>
  );
}
