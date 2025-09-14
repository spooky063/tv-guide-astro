import fs from "fs";
import zlib from "zlib";
import { Readable } from "stream";

export class XmlTvDownloader {
  constructor(fetchFn = fetch) {
    this.fetchFn = fetchFn;
  }

  async shouldDownload(url, outputPath) {
    const headRes = await fetch(url, { method: "HEAD" });
    if (!headRes.ok) {
      throw new Error(`HEAD request failed: ${headRes.status}`);
    }

    const lastModified = headRes.headers.get("last-modified");
    if (!lastModified) {
      return true;
    }

    const remoteDate = new Date(lastModified);

    if (fs.existsSync(outputPath)) {
      const localStat = fs.statSync(outputPath);
      const localDate = localStat.mtime;

      if (localDate >= remoteDate) {
        return false;
      }
    }

    return true;
  }

  async downloadToFile(url, outputPath) {
    if (!(await this.shouldDownload(url, outputPath))) {
      return outputPath;
    }

    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.fetchFn(url);

        if (!res.ok) {
          return reject(new Error(`HTTP error! status: ${res.status}`));
        }

        const inStream = res.body;
        const outStream = fs.createWriteStream(outputPath);

        const gunzip = zlib.createGunzip();

        gunzip.on("error", reject);
        outStream.on("error", reject);
        outStream.on("finish", () => resolve(outputPath));

        const nodeStream =
          typeof inStream.getReader === "function"
            ? Readable.fromWeb(inStream)
            : inStream;

        nodeStream.pipe(gunzip).pipe(outStream);
      } catch (err) {
        reject(err);
      }
    });
  }
}