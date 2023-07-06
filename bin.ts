#!/usr/bin/env node

import arg from "arg";
import path from "path";

import { Local } from "./cli";

const args = arg({
  // Types
  "--local": Boolean,
  "--file": String,
  "--port": Number,

  // Aliases
  "-l": "--local",
  "-f": "--file",
  "-p": "--port",
});

if (args["--local"] && args["--file"]) {
  const filePath = path.isAbsolute(args["--file"])
    ? args["--file"]
    : path.join(process.cwd(), args["--file"]);

  new Local(filePath, args["--port"] ?? 3000);
}
