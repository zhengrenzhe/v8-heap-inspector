import { makeAutoObservable } from "mobx";

import { inject, injectable } from "@/web/utils";
import { GetAllConstructorsReturnValue } from "@/binding";

import { APIService } from "./APIService";

class ViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  public inited = false;

  public showFilters = false;

  public filter = {
    constructorName: "",
  };

  public sortSizeMode: "asc" | "desc" | undefined = undefined;

  public setInited() {
    this.inited = true;
  }

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

  public toggleFilters = (v = !this.showFilters) => {
    this.showFilters = v;
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

  private constructors: GetAllConstructorsReturnValue["constructors"] = [];

  public get filtedConstructors() {
    return this.constructors
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
      this.constructors = d.constructors;
      this.viewModel.setInited();
    });
  }
}
