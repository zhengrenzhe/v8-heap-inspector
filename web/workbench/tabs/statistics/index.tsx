import React from "react";
import { MdOutlineQueryStats } from "react-icons/md";

import { contributionImplement } from "@/web/utils";
import { WorkbenchTabContribution } from "@/web/contribution";

import { StatisticsView } from "./view";

@contributionImplement()
export class StatisticsTabContribution extends WorkbenchTabContribution {
  public name = "Statistics";

  public icon = (<MdOutlineQueryStats />);

  public render = StatisticsView;
}
