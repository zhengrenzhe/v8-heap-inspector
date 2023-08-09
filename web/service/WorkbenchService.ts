import { makeAutoObservable } from "mobx";

import { injectable } from "@/web/utils";

class WorkbenchModel {
  constructor() {
    makeAutoObservable(this);

    try {
      const config = localStorage.getItem("v8-heap-inspector-workbench-config");
      if (config) {
        const obj = JSON.parse(config);
        Object.assign(this, obj);
      }
    } catch (e) {}
  }

  public activeTab = "";

  public theme: "light" | "dark" = "light";

  public setData = <K extends keyof this>(k: K, v: this[K]) => {
    this[k] = v;

    const copyed = JSON.stringify(this, null, 2);
    localStorage.setItem("v8-heap-inspector-workbench-config", copyed);
  };
}

@injectable()
export class WorkbenchService {
  public model = new WorkbenchModel();
}
