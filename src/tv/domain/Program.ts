import type { Rating } from "./Rating.ts";
import type { TvShow } from "./TvShow.ts";
import type { Credit, CreditType } from "./Credit.ts";

export interface ProgramProps {
  channel: string;
  start: Date;
  stop: Date;
  title: string;
  subTitle?: string;
  description?: string;
  categories?: string[];
  date?: Date|string;
  country?: string;
  image?: string;
  rating?: Rating;
  tvShow?: TvShow;
  credits?: Partial<Record<CreditType, Credit[]>>;
}

export class Program {
  channel: string;
  start: Date;
  stop: Date;
  title: string;
  subTitle?: string;
  description?: string;
  categories?: string[];
  date?: Date|string;
  country?: string;
  image?: string;
  rating?: Rating;
  tvShow?: TvShow;
  credits?: Partial<Record<CreditType, Credit[]>>;

  constructor(props: ProgramProps) {
    const { channel, start, stop, title, subTitle, description, date, country, categories, image, rating, tvShow, credits } = props;

    if (!channel) throw new Error("Program must have a channel");
    if (!title) throw new Error(`Program from ${channel} at ${start} must have a title`);
    if (!(start instanceof Date) || !(stop instanceof Date)) {
      throw new Error(`Program name ${title} from ${channel} must have valid dates`);
    }

    this.channel = channel;
    this.start = start;
    this.stop = stop;
    this.title = title;
    this.subTitle = subTitle;
    this.description = description;
    this.categories = categories;
    this.date = date;
    this.country = country;
    this.image = image;
    this.rating = rating;
    this.tvShow = tvShow;
    this.credits = credits;
  }
}