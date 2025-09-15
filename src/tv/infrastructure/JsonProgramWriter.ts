import * as fs from "fs";
import path from "path";
import { Program } from "../domain/Program.ts";

export class JsonProgramWriter {
  private outputPath: string;

  constructor(outputPath: string) {
    this.outputPath = outputPath;
  }

  save(programs: Program[]): void {
    const dir = path.dirname(this.outputPath);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.outputPath, JSON.stringify(programs, null, 2), "utf-8");
  }
}