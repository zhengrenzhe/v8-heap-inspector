import { makeAutoObservable } from "mobx";

import { injectable } from "@/web/utils";
import { GetAllConstructorsReturnValue } from "@/binding";

class ViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  public showFilters = false;

  public filter = {
    constructorName: "",
  };

  public sortSizeMode: "asc" | "desc" | undefined = undefined;

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

  public setFilter<K extends keyof ViewModel["filter"]>(
    k: K,
    v: ViewModel["filter"][K],
  ) {
    this.filter[k] = v;
  }
}

@injectable()
export class ConstructorService {
  public viewModel = new ViewModel();

  public applyFilter(data: GetAllConstructorsReturnValue["constructors"]) {
    return data
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
}
