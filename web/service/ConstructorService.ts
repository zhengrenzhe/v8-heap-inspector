import { action, makeObservable, observable } from "mobx";

import { inject, injectable } from "@/web/utils";
import {
  GetAllConstructorsReturnValue,
  NodeAbstractInfoReturnValue,
  NodeFullInfoReturnValue,
} from "@/binding";
import { APIService } from "@/web/service";

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
  public sortConstructorMode: "asc" | "desc" | "alpha" = "alpha";

  @observable
  public sortInstanceMode: "asc" | "desc" | "alpha" = "alpha";

  @observable
  public filter = {
    constructorName: "",
  };

  @observable.ref
  public nodeTreeMap: Record<number, NodeFullInfoReturnValue> = {};

  @observable
  public startNodeIdx = -1;

  @observable
  public expandedKeys: string[] = [];

  @action
  public setData = <K extends keyof this>(k: K, v: this[K]) => {
    this[k] = v;
  };

  @action
  public toggleSortConstructorMode = (
    key: "sortConstructorMode" | "sortInstanceMode",
  ) => {
    if (this[key] === "alpha") {
      return (this[key] = "desc");
    }
    if (this[key] === "desc") {
      return (this[key] = "asc");
    }
    if (this[key] === "asc") {
      return (this[key] = "alpha");
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

  public get filteredConstructors() {
    return this.viewModel.constructors
      .filter((c) =>
        c.name
          .toLowerCase()
          .includes(this.viewModel.filter.constructorName.toLowerCase()),
      )
      .sort((a, b) => {
        if (this.viewModel.sortConstructorMode === "asc") {
          return a.selfSize - b.selfSize;
        }

        if (this.viewModel.sortConstructorMode === "desc") {
          return b.selfSize - a.selfSize;
        }

        return a.name.localeCompare(b.name);
      });
  }

  public get filtedInstances() {
    return this.viewModel.instances.sort((a, b) => {
      if (this.viewModel.sortInstanceMode === "asc") {
        return a.selfSize - b.selfSize;
      }

      if (this.viewModel.sortInstanceMode === "desc") {
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
    const data =
      await this.apiService.getNodesAbstractInfoByConstructorName(
        constructorName,
      );

    this.viewModel.setData("instances", data);
    this.viewModel.setData("instancesReady", true);
  };

  public loadNodeReference = async (nodeIdx: number, fromNodeIdx?: number) => {
    if (this.viewModel.nodeTreeMap[nodeIdx]) {
      return;
    }

    const node = await this.apiService.getNodeReferences(nodeIdx, fromNodeIdx);

    this.viewModel.setData(
      "nodeTreeMap",
      Object.assign({}, this.viewModel.nodeTreeMap, {
        [node.info.nodeIdx]: node,
      }),
    );

    console.log(this.viewModel.nodeTreeMap);
  };
}
