import * as fs from "fs";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import { Channel } from "../domain/Channel.ts";

export class XmlTvChannelRepository {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  findAll(): Channel[] {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const doc = new DOMParser().parseFromString(content, "text/xml");

    const channels: Node[]  = xpath.select("//tv/channel", doc) as Node[];

    return channels.map((channel, index) => {
      const c = channel as Element;

      const id = c.getAttribute("id") ?? "";
      const sourceId = this.mappedChannelSourceId(id) ?? index + 1;
      const channelName = xpath.select1("string(./display-name)", c) as string;
      let icon = (xpath.select1("./icon", channel) as Element | null)?.getAttribute("src") ?? "";

      if (icon.startsWith("https://focus.telerama.fr/")) {
        icon = icon.replace("500x500", "26x26");
      }
      if (icon.startsWith("https://static.teleboy.ch/")) {
        icon = icon.replace("icon320_light", "icon40_light");
      }

      return new Channel({
        sourceId: sourceId,
        id: id,
        name: channelName,
        icon: icon,
      });
    });
  }

  mappedChannelSourceId(id: string): number {
    const mapping: { [id: string]: number } = {
      "TF1.fr": 1,
      "France2.fr": 2,
      "France3.fr": 3,
      "France4.fr": 4,
      "France5.fr": 5,
      "M6.fr": 6,
      "Arte.fr": 7,
      "W9.fr": 9,
      "TMC.fr": 10,
      "NT1.fr": 11,
      "Gulli.fr": 12,
      "CStar.fr": 17,
      "T18.fr": 18,
      "NOVO19.fr": 19,
      "TF1SeriesFilms.fr": 20,
      "LEquipe21.fr": 21,
      "6ter.fr": 22,
      "Numero23.fr": 23,
      "RMCDecouverte.fr": 24,
      "Cherie25.fr": 25,
    };

    return mapping[id] ?? 0;
  }
}