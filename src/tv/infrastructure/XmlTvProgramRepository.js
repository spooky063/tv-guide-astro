import fs from "fs";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import { Program } from "../domain/Program.js";
import { parseDate } from "../shared/Date.js";
import { Rating } from "../domain/Rating.js";
import { TvShow } from "../domain/TvShow.js";

export class XmlTvProgramRepository {
  constructor(filePath) {
    this.filePath = filePath;
  }

  findAll() {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const doc = new DOMParser().parseFromString(content, "text/xml");

    return xpath.select("//tv/programme", doc).map((node) => {
      return new Program({
        channel: node.getAttribute("channel"),
        start: parseDate(node.getAttribute("start")),
        stop: parseDate(node.getAttribute("stop")),
        stop: parseDate(node.getAttribute("stop")),
        title: xpath.select1("string(./title)", node),
        subTitle: xpath.select1("./sub-title", node)?.textContent,
        description: xpath.select1("./desc", node)?.textContent,
        image: xpath.select1("./icon", node)?.getAttribute("src"),
        categories: xpath.select("./category", node).map(catNode => catNode.textContent),
        rating: (() => {
          const ratingNode = xpath.select1("./rating", node);
          if (!ratingNode) return undefined;
          return new Rating({
            system: ratingNode.getAttribute("system"),
            value: ratingNode.textContent.trim(),
            icon: xpath.select1("./icon", ratingNode)?.getAttribute("src"),
          });
        })(),
        tvShow: (() => {
          const episodeNumNode = xpath.select1("./episode-num", node)?.textContent;
          if (!episodeNumNode) return undefined;
          const [season, episode] = episodeNumNode.split('.').filter(Boolean);
          return new TvShow({
            season: parseInt(season, 10) + 1,
            episode: parseInt(episode, 10) + 1
          });
        })(),
      });
    });
  }
}