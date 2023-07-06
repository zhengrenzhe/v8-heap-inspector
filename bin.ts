#!/usr/bin/env node

import arg from "arg";
import path from "path";

import { Local } from "./cli";

const args = arg({
  // Types
  "--local": Boolean,
  "--file": String,

  // Aliases
  "-l": "--local",
  "-f": "--file",
});

if (args["--local"] && args["--file"]) {
  const filePath = path.isAbsolute(args["--file"])
    ? args["--file"]
    : path.join(process.cwd(), args["--file"]);

  new Local(filePath);
}
