import { statSync } from "node:fs";
import chalk from "chalk";
import express, { Express, Response } from "express";
import cors from "cors";

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

    const meta = this.analyzer.getMeta();
    console.log(
      chalk.green(
        `done ${meta.size} bytes ${((end - start) / 1000).toFixed(2)}s`,
      ),
    );

    console.log(chalk.green(`start server on port ${port}`));

    this.server = express();

    this.server.use(cors());
    this.server.get("/api/get_all_constructors", (_, res) =>
      this.api_get_all_constructors(res),
    );

    this.server.listen(port);
  }

  private api_get_all_constructors(res: Response) {
    const meta = this.analyzer.getAllConstructors();
    res.json(meta);
  }
}
