import type { Rating } from "./Rating.ts";
import type { TvShow } from "./TvShow.ts";

export interface ProgramProps {
  channel: string;
  start: Date;
  stop: Date;
  title: string;
  subTitle?: string;
  description?: string;
  categories?: string[];
  image?: string;
  rating?: Rating;
  tvShow?: TvShow;
}

export class Program {
  channel: string;
  start: Date;
  stop: Date;
  title: string;
  subTitle?: string;
  description?: string;
  categories?: string[];
  image?: string;
  rating?: Rating;
  tvShow?: TvShow;

  constructor(props: ProgramProps) {
    const { channel, start, stop, title, subTitle, description, categories, image, rating, tvShow } = props;

    if (!channel) throw new Error("Program must have a channel");
    if (!title) throw new Error("Program must have a title");
    if (!(start instanceof Date) || !(stop instanceof Date)) {
      throw new Error("Program must have valid dates");
    }

    this.channel = channel;
    this.start = start;
    this.stop = stop;
    this.title = title;
    this.subTitle = subTitle;
    this.description = description;
    this.categories = categories;
    this.image = image;
    this.rating = rating;
    this.tvShow = tvShow;
  }
}