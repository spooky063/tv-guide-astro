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

      const sourceId = index + 1;
      const id = c.getAttribute("id") ?? "";
      const channelName = xpath.select1("string(./display-name)", c) as string;
      const icon = (xpath.select1("./icon", channel) as Element | null)?.getAttribute("src") ?? "";

      return new Channel({
        sourceId: sourceId,
        id: id,
        name: channelName,
        icon: icon,
      });
    });
  }
}