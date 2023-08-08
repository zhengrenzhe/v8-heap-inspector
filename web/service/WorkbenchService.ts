import { makeAutoObservable } from "mobx";

import { injectable } from "@/web/utils";

class WorkbenchModel {
  constructor() {
    makeAutoObservable(this);
  }

  public activeTab = "";

  public setActiveTabName(tabName: string) {
    this.activeTab = tabName;
  }
}

@injectable()
export class WorkbenchService {
  public model = new WorkbenchModel();
}
