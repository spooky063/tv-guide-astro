export interface TvShowProps {
  season: number;
  episode: number;
}

export class TvShow {
  season: number;
  episode: number;

  constructor(props: TvShowProps) {
    const { season, episode } = props;

    if (!season) throw new Error("Season must be defined");
    if (!episode) throw new Error("Episode must be defined");

    this.season = season;
    this.episode = episode;
  }
}