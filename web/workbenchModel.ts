import { makeAutoObservable } from "mobx";

import { injectable } from "./di";

class WorkbenchModel {
  constructor() {
    makeAutoObservable(this);
  }

  public tabIndex = 1;

  public setTabIndex = (index: number) => {
    this.tabIndex = index;
  };
}

@injectable()
export class WorkbenchService {
  public model = new WorkbenchModel();
}
