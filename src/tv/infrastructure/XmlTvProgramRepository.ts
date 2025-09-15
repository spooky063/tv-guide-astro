import * as fs from "fs";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import { Program } from "../domain/Program.ts";
import { parseDate } from "../shared/Date.ts";
import { Rating } from "../domain/Rating.ts";
import { TvShow } from "../domain/TvShow.ts";

export class XmlTvProgramRepository {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async findAll(): Promise<Program[]> {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const doc = new DOMParser().parseFromString(content, "text/xml");

    const channels = xpath.select("//tv/channel", doc) as Element[];
    const channelIds = channels.map((ch) => ch.getAttribute("id") ?? "");

    const programs: Node[] = xpath.select("//tv/programme", doc) as Node[];

    return programs.map((program) => {
      const p = program as Element;

      const ratingNode = xpath.select1("./rating", p) as Element | null;
      const rating: Rating | undefined = ratingNode
        ? new Rating({
            system: ratingNode.getAttribute("system") ?? undefined,
            value: ratingNode.textContent?.trim() ?? undefined,
            icon: (xpath.select1("./icon", ratingNode) as Element | null)?.getAttribute("src") ?? undefined,
          })
        : undefined;

      const episodeNumNode = (xpath.select1("./episode-num", p) as Element | null)?.textContent;
      let tvShow: TvShow | undefined;
      if (episodeNumNode) {
        const [seasonStr, episodeStr] = episodeNumNode.split(".").filter(Boolean);
        const season = parseInt(seasonStr, 10);
        const episode = parseInt(episodeStr, 10);
        if (!isNaN(season) && !isNaN(episode)) {
          tvShow = new TvShow({ season: season + 1, episode: episode + 1 });
        }
      }

      const channelName = p.getAttribute("channel") ?? "";
      const channelId = channelIds.findIndex((id) => id === channelName) + 1;

      return new Program({
        id: channelId,
        channel: channelName,
        start: parseDate(p.getAttribute("start") ?? ""),
        stop: parseDate(p.getAttribute("stop") ?? ""),
        title: (xpath.select1("string(./title)", p) as string) ?? undefined,
        subTitle: (xpath.select1("./sub-title", p) as Element | null)?.textContent ?? undefined,
        description: (xpath.select1("./desc", p) as Element | null)?.textContent ?? undefined,
        image: (xpath.select1("./icon", p) as Element | null)?.getAttribute("src") ?? undefined,
        categories: (xpath.select("./category", p) as Element[]).map((catNode) => catNode.textContent ?? ""),
        rating,
        tvShow,
      });
    });
  }
}