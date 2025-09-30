export class DateTimeRange {
  public readonly start: Date;
  public readonly end: Date;

  constructor(start: string | Date, end: string | Date) {
    this.start = start instanceof Date ? start : new Date(start);
    this.end = end instanceof Date ? end : new Date(end);

    if (this.end < this.start) {
      throw new Error("End datetime must be after start datetime");
    }
  }
}