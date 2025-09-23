import { describe, expect, test, it } from 'vitest';
import { parseDateTime, parseDate } from '../../../src/tv/shared/Date.ts';

describe("Parse date", () => {

    test.each([
        ["20250911210000 +0200", "2025-09-11T21:00:00.000Z"],
        ["20250901011000 +0200", "2025-09-01T01:10:00.000Z"],
        ["20250901060000 +0200", "2025-09-01T06:00:00.000Z"],
    ])(
        "should parse date with timezone UTC",
        (dateString, expectedDateString) => {
            const date = parseDateTime(dateString);

            expect(date).toBeInstanceOf(Date);
            expect(date.toISOString()).toBe(expectedDateString);
        }
    );

    it('should parse date', () => {
        const date = parseDate("20250911");

        expect(date).toBeInstanceOf(Date);
        expect(date.toISOString()).toBe("2025-09-11T00:00:00.000Z");
    });

});
