import { statSync } from "node:fs";
import { LocalAnalyzer } from "../../binding";

export class Local {
  private readonly analyzer: LocalAnalyzer;

  constructor(filePath: string) {
    if (!statSync(filePath).isFile()) {
      throw new Error();
    }

    this.analyzer = new LocalAnalyzer(filePath);
  }
}
