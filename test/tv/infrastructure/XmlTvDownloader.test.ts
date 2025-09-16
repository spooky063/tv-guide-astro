import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from "fs";
import { XmlTvDownloader } from '../../../src/tv/infrastructure/XmlTvDownloader.ts';

describe("Downloader", () => {

    const url = "https://example.com/file.xml.xz";
    const outputPath = "./downloads/file.xml";
    let downloader: XmlTvDownloader;

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mock("fs", { spy: true});

        downloader = new XmlTvDownloader();
    });

    it("should return true if file does not exist", async () => {
        vi.spyOn(fs, "existsSync").mockReturnValue(false);
        vi.spyOn(fs, "statSync").mockReturnValue({ mtime: new Date() }  as unknown as fs.Stats);

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: new Map([["last-modified", new Date().toUTCString()]]),
        });

        const result = await downloader.shouldDownload(url, outputPath);
        expect(result).toBe(true);
    });

    it("should return true if no Last-Modified header", async () => {
        vi.spyOn(fs, "existsSync").mockReturnValue(true);
        vi.spyOn(fs, "statSync").mockReturnValue({ mtime: new Date() } as unknown as fs.Stats);

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: new Map(),
        });

        const result = await downloader.shouldDownload(url, outputPath);
        expect(result).toBe(true);
    });

    it("should return false if local file is newer or equal", async () => {
        const now = new Date();

        vi.spyOn(fs, "existsSync").mockReturnValue(true);
        vi.spyOn(fs, "statSync").mockReturnValue({ mtime: now } as unknown as fs.Stats);

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: new Map([["last-modified", now.toUTCString()]]),
        });

        const result = await downloader.shouldDownload(url, outputPath);
        expect(result).toBe(false);
    });

    it("should return true if remote file is newer", async () => {
        const localDate = new Date("2025-09-10T00:00:00Z");
        const remoteDate = new Date("2025-09-11T00:00:00Z");

        vi.spyOn(fs, "existsSync").mockReturnValue(true);
        vi.spyOn(fs, "statSync").mockReturnValue({ mtime: localDate } as unknown as fs.Stats);

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: new Map([["last-modified", remoteDate.toUTCString()]]),
        });

        const result = await downloader.shouldDownload(url, outputPath);
        expect(result).toBe(true);
    });

});