import { statSync } from "node:fs";
import chalk from "chalk";
import express, { Express, Response } from "express";

import { LocalAnalyzer } from "../../binding";

export class Local {
  private readonly analyzer: LocalAnalyzer;

  private readonly server: Express;

  constructor(filePath: string, port: number) {
    if (!statSync(filePath).isFile()) {
      throw new Error();
    }

    const start = performance.now();
    console.log(chalk.green(`Analyzing ${filePath} ...`));

    this.analyzer = new LocalAnalyzer(filePath);
    const end = performance.now();

    const meta = this.analyzer.meta();
    console.log(
      chalk.green(
        `done ${meta.size} bytes ${((end - start) / 1000).toFixed(2)}s`,
      ),
    );

    console.log(chalk.green(`start server on port ${port}`));

    this.server = express();
    this.server.get("/api", (req, res) => this.get_meta(res));
    this.server.listen(port);
  }

  private get_meta(res: Response) {
    const meta = this.analyzer.meta();
    res.json({
      path: meta.path,
      size: meta.size,
    });
  }
}
