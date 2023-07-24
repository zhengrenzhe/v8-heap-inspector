import { contributionImplement } from "@/web/utils";
import { WorkbenchTabContribution } from "@/web/contribution";

import { ConstructorsView } from "./view";

@contributionImplement()
export class ConstructorsTabContribution extends WorkbenchTabContribution {
  public name = "Constructors";

  public render = ConstructorsView;
}
