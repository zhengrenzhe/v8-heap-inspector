import { statSync } from "node:fs";
import chalk from "chalk";
import express, { Express, Response, Request } from "express";
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
    this.server.get(
      "/api/get_nodes_abstract_info_by_constructor_name",
      (req, res) => this.get_nodes_abstract_info_by_constructor_name(req, res),
    );
    this.server.get("/api/get_node_references", (req, res) =>
      this.get_node_references(req, res),
    );

    this.server.listen(port);
  }

  private api_get_all_constructors(res: Response) {
    const meta = this.analyzer.getAllConstructors();
    res.json(meta);
  }

  private get_nodes_abstract_info_by_constructor_name(
    req: Request,
    res: Response,
  ) {
    const constructor_name = (req.query.constructor_name as string) ?? "";
    const meta =
      this.analyzer.getNodesAbstractInfoByConstructorName(constructor_name);
    res.json(meta);
  }

  private get_node_references(req: Request, res: Response) {
    const nodeIdx = (req.query.nodeIdx as string) ?? "";
    const pathIdx = ([req.query.pathIdx as string[]] ?? []).flat();
    const references = this.analyzer.getNodeReferences(
      parseInt(nodeIdx),
      pathIdx.map((idx) => parseInt(idx)),
    );
    res.json(references);
  }
}
