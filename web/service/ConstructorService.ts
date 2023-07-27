import { makeAutoObservable } from "mobx";

import { inject, injectable } from "@/web/utils";
import {
  GetAllConstructorsReturnValue,
  NodeAbstractInfoReturnValue,
} from "@/binding";

import { APIService } from "./APIService";

class ViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  public constructors: GetAllConstructorsReturnValue["constructors"] = [];

  public instances: NodeAbstractInfoReturnValue[] = [];

  public instancesReady = false;

  public inited = false;

  public showFilters = false;

  public sortSizeMode: "asc" | "desc" | undefined = undefined;

  public filter = {
    constructorName: "",
  };

  public setData = <K extends keyof this>(k: K, v: this[K]) => {
    this[k] = v;
  };

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

  public getNodeReference = async (nodeIdx: number) => {
    const r = await this.apiService.getNodeReferences(nodeIdx);
    console.log(r);
  };
}
