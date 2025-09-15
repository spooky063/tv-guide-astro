import * as fs from "fs";
import * as zlib from "zlib";
import * as path from "path";
import { Readable } from "stream";

type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class XmlTvDownloader {
  private fetchFn: FetchFn;

  constructor(fetchFn = fetch) {
    this.fetchFn = fetchFn;
  }

  async shouldDownload(url: string, outputPath: string): Promise<boolean> {
    const headRes = await fetch(url, { method: "HEAD" });
    if (!headRes.ok) {
      throw new Error(`HEAD request failed: ${headRes.status}`);
    }

    const lastModified = headRes.headers.get("last-modified");
    if (!lastModified) {
      return true;
    }

    const remoteDate = new Date(lastModified);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    if (fs.existsSync(outputPath)) {
      const localStat = fs.statSync(outputPath);
      const localDate = localStat.mtime;

      if (localDate >= remoteDate) {
        return false;
      }
    }

    return true;
  }

  async downloadToFile(url: string, outputPath: string): Promise<string> {
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

        const nodeStream: any =
          typeof (inStream as ReadableStream).getReader === "function"
            ? Readable.fromWeb(inStream as any)
            : inStream;

        nodeStream.pipe(gunzip).pipe(outStream);
      } catch (err) {
        reject(err);
      }
    });
  }
}