import fs from "fs";
import path from "path";

export class JsonProgramWriter {
  constructor(outputPath) {
    this.outputPath = outputPath;
  }

  save(programs) {
    const dir = path.dirname(this.outputPath);

    fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(this.outputPath, JSON.stringify(programs, null, 2), "utf-8");
  }
}