import fs from "fs";
import path from "path";

export class XmlTvDownloader {
  constructor(fetchFn = fetch) {
    this.fetchFn = fetchFn;
  }

  async downloadToFile(url, outputDir, filename = "tvguide.xml") {
    const res = await this.fetchFn(url);
    if (!res.ok) {
      throw new Error(`Fail to download XML: ${res.status}`);
    }

    const xml = await res.text();

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, xml, "utf-8");

    return filePath;
  }
}