import { describe, expect, test } from 'vitest';
import { parseDate } from '../../../src/tv/shared/Date.ts';

describe("Parse date", () => {

    test.each([
        ["20250911210000 +0200", "2025-09-11T21:00:00.000Z"],
        ["20250901011000 +0200", "2025-09-01T01:10:00.000Z"],
        ["20250901060000 +0200", "2025-09-01T06:00:00.000Z"],
    ])(
        "should parse date with timezone UTC",
        (dateString, expectedDateString) => {
            const date = parseDate(dateString);

            expect(date).toBeInstanceOf(Date);
            expect(date.toISOString()).toBe(expectedDateString);
        }
    );

});
