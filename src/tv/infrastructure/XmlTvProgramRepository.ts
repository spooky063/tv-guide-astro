import * as fs from "fs";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import { Program } from "../domain/Program.ts";
import { parseDateTime, parseDate } from "../shared/Date.ts";
import { Rating } from "../domain/Rating.ts";
import { TvShow } from "../domain/TvShow.ts";
import { Credit, type CreditType } from "../domain/Credit.ts";
import type { Channel } from "../domain/Channel.ts";

export class XmlTvProgramRepository {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  findByChannel(channel: Channel): Program[] {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const doc = new DOMParser().parseFromString(content, "text/xml");

    const dn = new Intl.DisplayNames(['fr'], { type: 'region' });

    const programs: Node[]  = xpath.select(`//programme[@channel='${channel.id}']`, doc) as Node[];

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

      const credits: Credit[] = [];
      const creditNodes = xpath.select("./credits/*", p) as Element[];
      for (const creditNode of creditNodes) {
        const creditType = creditNode.tagName.toLowerCase() as CreditType;
        const name = xpath.select1("string(.)", creditNode) as string;
        credits.push(new Credit({ creditType, name }));
      }
      const creditsGrouped: Partial<Record<CreditType, Credit[]>> = Object.groupBy(credits, ({ creditType }) => creditType as CreditType);

      const date = xpath.select1("string(./date)", p) as string;

      const country = xpath.select1("string(./country)", p) as string;

      const image = (xpath.select1("./icon", p) as Element | null)?.getAttribute("src") ?? undefined;
      const imageQuality = 65;

      return new Program({
        channel: p.getAttribute("channel") as string,
        start: parseDateTime(p.getAttribute("start") ?? ""),
        stop: parseDateTime(p.getAttribute("stop") ?? ""),
        title: xpath.select1("string(./title[@lang='fr'])", p) as string,
        subTitle: xpath.select1("string(./sub-title[@lang='fr'])", p) as string,
        description: xpath.select1("string(./desc[@lang='fr'])", p) as string,
        image: `https://images.weserv.nl/?url=${image}&w=65&h=90&fit=cover&output=webp&q=${imageQuality}&maxage=1d&default=placehold.co/65x90?text=None`,
        categories: (xpath.select("./category", p) as Element[]).map((catNode) => catNode.textContent ?? ""),
        date: date ? parseDate(date) : undefined,
        country: country ? dn.of(country) : undefined,
        rating,
        tvShow,
        credits: creditsGrouped,
      });
    });
  }
}