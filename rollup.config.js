import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "cli/bin.ts",
  output: {
    dir: "cli-output",
    format: "cjs",
    entryFileNames: "[name].cjs",
  },
  external(id) {
    if (/\.node$/.test(id)) return true;
    return false;
  },
  plugins: [
    typescript(),
    commonjs(),
    json(),
    copy({
      targets: [{ src: "*.node", dest: "cli-output" }],
    }),
  ],
};
