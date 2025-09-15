export class Day {
    private readonly date: Date;

    constructor(input?: Date | string | number) {
        const d = input ? new Date(input) : new Date();
        this.date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    static from(day: number, month: number, year: number) {
        return new Day(new Date(year, month - 1, day));
    }

    getDate() {
        return new Date(this.date);
    }

    getDayOfMonth(): number {
        return this.date.getDate();
    }

    getMonth(): number {
        return this.date.getMonth();
    }

    getFullYear(): number {
        return this.date.getFullYear();
    }
}