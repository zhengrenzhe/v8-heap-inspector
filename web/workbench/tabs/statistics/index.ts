import { contributionImplement } from "@/web/utils";
import { StatisticsView } from "./view";
import { WorkbenchTabContribution } from "@/web/contribution";

@contributionImplement()
export class StatisticsTabContribution extends WorkbenchTabContribution {
  public name = "Statistics";

  public render = StatisticsView;
}
