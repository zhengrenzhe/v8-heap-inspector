import { contribution } from "@/web/utils";
import { ComponentType } from "react";

@contribution()
export abstract class WorkbenchTabContribution {
  public abstract name: string;

  public abstract icon: JSX.Element;

  public abstract render: ComponentType;
}
