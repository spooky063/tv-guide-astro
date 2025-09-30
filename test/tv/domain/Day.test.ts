import { describe, expect, it, test } from 'vitest';
import { Day } from '../../../src/tv/domain/Day.ts';

describe("Get correct day", () => {
    it("should get the day of the month", () => {
        const day = new Day("2025-09-11T21:00:00.000Z");
        expect(day.getDayOfMonth()).toBe(11);
    });

    it("should get the month", () => {
        const day = new Day("2025-09-11T21:00:00.000Z");
        expect(day.getMonth()).toBe(8);
    });

    it("should get the year", () => {
        const day = new Day("2025-09-11T21:00:00.000Z");
        expect(day.getFullYear()).toBe(2025);
    });

    test.each([
        { date: "2025-09-11" , hours: 0, minutes: 0, seconds: 0, expected: "2025-09-11T00:00:00"},
        { date: "2025-09-11" , hours: 21, minutes: 0, seconds: 0, expected: "2025-09-11T21:00:00"},
        { date: "2025-09-11" , hours: 21, minutes: 30, seconds: 0, expected: "2025-09-11T21:30:00"},
        { date: "2025-09-11" , hours: 23, minutes: 30, seconds: 30, expected: "2025-09-11T23:30:30"},
        { date: "2025-09-11" , hours: 24, minutes: 0, seconds: 0, expected: "2025-09-12T00:00:00"},
        { date: "2025-09-11" , hours: 25, minutes: 0, seconds: 0, expected: "2025-09-12T01:00:00"},
    ])(
        "should get $expected from $date at $hours:$minutes:$seconds",
        ({ date, hours, minutes, seconds, expected }) => {
            const day = new Day(date);
            expect(day.toDateTimeString(hours, minutes, seconds)).toBe(expected);
        }
    );
});