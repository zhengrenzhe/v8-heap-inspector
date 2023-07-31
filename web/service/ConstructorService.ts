import { action, makeObservable, observable } from "mobx";

import { inject, injectable } from "@/web/utils";
import {
  GetAllConstructorsReturnValue,
  NodeAbstractInfoReturnValue,
  NodeFullInfoReturnValue,
} from "@/binding";

import { APIService } from "./APIService";

const updateTreeData = (oldTree: NodeFullInfoReturnValue, newData:NodeFullInfoReturnValue): NodeFullInfoReturnValue => {
  if(oldTree.abstractInfo.nodeIdx === newData.abstractInfo.nodeIdx) {
    return newData;
  }

  return Object.assign({}, oldTree, {
    children: oldTree.children.map((c) => updateTreeData(c, newData))
  } )
}
  // list.map((node) => {
  //   if (node.key === key) {
  //     return {
  //       ...node,
  //       children,
  //     };
  //   }
  //   if (node.children) {
  //     return {
  //       ...node,
  //       children: updateTreeData(node.children, key, children),
  //     };
  //   }
  //   return node;
  // });

class ViewModel {
  constructor() {
    makeObservable(this);
  }

  @observable.ref
  public constructors: GetAllConstructorsReturnValue["constructors"] = [];

  @observable.ref
  public instances: NodeAbstractInfoReturnValue[] = [];

  @observable
  public instancesReady = false;

  @observable
  public inited = false;

  @observable
  public showFilters = false;

  @observable
  public sortSizeMode: "asc" | "desc" | undefined = undefined;

  @observable
  public filter = {
    constructorName: "",
  };

  @observable.ref
  public nodeReferences: NodeFullInfoReturnValue|null = null;

  @observable
  public startNodeIdx = 0;

  @action
  public setData = <K extends keyof this>(k: K, v: this[K]) => {
    this[k] = v;
  };

  @action
  public toggleSortSizeMode = () => {
    if (this.sortSizeMode === undefined) {
      return (this.sortSizeMode = "desc");
    }
    if (this.sortSizeMode === "desc") {
      return (this.sortSizeMode = "asc");
    }
    if (this.sortSizeMode === "asc") {
      return (this.sortSizeMode = undefined);
    }
    return;
  };

  @action
  public setFilter = <K extends keyof ViewModel["filter"]>(
    k: K,
    v: ViewModel["filter"][K],
  ) => {
    this.filter[k] = v;
  };
}

@injectable()
export class ConstructorService {
  public viewModel = new ViewModel();

  @inject(APIService)
  private apiService: APIService;

  public get filtedConstructors() {
    return this.viewModel.constructors
      .filter((c) =>
        c.name
          .toLowerCase()
          .includes(this.viewModel.filter.constructorName.toLowerCase()),
      )
      .sort((a, b) => {
        if (this.viewModel.sortSizeMode === "asc") {
          return a.selfSize - b.selfSize;
        }

        if (this.viewModel.sortSizeMode === "desc") {
          return b.selfSize - a.selfSize;
        }

        return a.name.localeCompare(b.name);
      });
  }

  constructor() {
    this.apiService.getAllConstructors().then((d) => {
      this.viewModel.setData("constructors", d.constructors);
      this.viewModel.setData("inited", true);
    });
  }

  public getInstances = async (constructorName: string) => {
    const data = await this.apiService.getNodesAbstractInfoByConstructorName(
      constructorName,
    );

    this.viewModel.setData("instances", data);
    this.viewModel.setData("instancesReady", true);
  };

  public getInitialNodeReference = async (nodeIdx: number) => {
    const startNode = await this.apiService.getNodeReferences(nodeIdx, 0);
    this.viewModel.setData("nodeReferences", startNode);
  };

  public loadNodeReference = async (nodeIdx: number) => {
    if (!this.viewModel.nodeReferences) {
      return;
    }
    const data = await this.apiService.getNodeReferences(nodeIdx, 1);
    const rs = updateTreeData(this.viewModel.nodeReferences, data);
    this.viewModel.setData("nodeReferences", rs);
  };
}
