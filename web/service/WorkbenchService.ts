import { makeAutoObservable } from "mobx";

import { injectable } from "@/web/utils";

@injectable()
export class WorkbenchService {
  public model = new WorkbenchModel();
}

class WorkbenchModel {
  constructor() {
    makeAutoObservable(this);
  }

  public tabIndex = 0;

  public setTabIndex = (index: number) => {
    this.tabIndex = index;
  };
}
