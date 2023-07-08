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
    this.server.get("/api/meta", (_, res) => this.api_meta(res));
    this.server.get("/api/statistics", (_, res) => this.api_statistics(res));
    this.server.get("/api/node/:id", (req, res) =>
      this.api_get_node_by_id(res, parseInt(req.params.id)),
    );
    this.server.listen(port);
  }

  private api_meta(res: Response) {
    const meta = this.analyzer.meta();
    res.json(meta);
  }

  private api_statistics(res: Response) {
    const statistics = this.analyzer.statistics();
    res.json(statistics);
  }

  private api_get_node_by_id(res: Response, id: number) {
    const node = this.analyzer.getNodeById(id);
    res.json(node);
  }
}
