#!/usr/bin/env node

import arg from "arg";
import path from "path";
import chalk from "chalk";

import { Local } from "./local";

const args = arg({
  // Types
  "--local": Boolean,
  "--file": String,
  "--port": Number,
  "--version": Boolean,

  // Aliases
  "-l": "--local",
  "-f": "--file",
  "-p": "--port",
  "-v": "--version",
});

if (args["--version"]) {
  console.log(chalk.green(require("../package.json").version));
}

if (args["--local"] && args["--file"]) {
  const filePath = path.isAbsolute(args["--file"])
    ? args["--file"]
    : path.join(process.cwd(), args["--file"]);

  new Local(filePath, args["--port"] ?? 3000);
}
