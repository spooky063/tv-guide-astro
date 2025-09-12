export class TvShow {
  constructor({ season, episode }) {
    if (!season) throw new Error("Season must be defined");
    if (!episode) throw new Error("Episode must be defined");
    this.season = season;
    this.episode = episode;
  }
}