import { beforeEach, describe, expect, it, vi, test } from 'vitest';
import { GetProgramsUseCase } from '../../../src/tv/application/GetProgramsUseCase.ts';
import { Program } from '../../../src/tv/domain/Program.ts';
import { Channel } from '../../../src/tv/domain/Channel.ts';
import { DateTimeRange } from '../../../src/tv/domain/DateTimeRange.ts';

describe("Get prime time programs", () => {
    let useCase: GetProgramsUseCase;
    let fakePrograms: Program[] = [
        new Program({
            channel: "TF1.fr",
            start: new Date("2025-09-11T16:00:00.000Z"),
            stop: new Date("2025-09-11T17:30:00.000Z"),
            title: "L'internat de la honte"
        }),
        new Program({
            channel: "TF1.fr",
            start: new Date("2025-09-12T21:00:00.000Z"),
            stop: new Date("2025-09-12T22:30:00.000Z"),
            title: "S.W.A.T"
        }),
        new Program({
            channel: "M6.fr",
            start: new Date("2025-09-12T19:40:00.000Z"),
            stop: new Date("2025-09-12T19:50:00.000Z"),
            title: "Météo"
        }),
        new Program({
            channel: "M6.fr",
            start: new Date("2025-09-12T21:10:00.000Z"),
            stop: new Date("2025-09-12T23:35:00.000Z"),
            title: "S.W.A.T"
        }),
        new Program({
            channel: "M6.fr",
            start: new Date("2025-09-12T23:35:00.000Z"),
            stop: new Date("2025-09-13T01:55:00.000Z"),
            title: "Tout beau, tout n9uf"
        })
    ];
    let repoMock: any;

    beforeEach(() => {
        repoMock = {
            findAll: vi.fn().mockResolvedValue(fakePrograms),
            findByChannel: vi.fn(),
        };
        useCase = new GetProgramsUseCase(repoMock);
    });

    it('should get programs by channel: TF1.fr', async () => {
        const channelId = "TF1.fr";
        const programs = fakePrograms.filter((p) => p.channel === channelId)
        repoMock.findByChannel.mockReturnValue(programs);

        const channel = new Channel({ sourceId: 1, id: channelId, name: "TF1", icon: "https://img.fake.jpg" });
        const programUseCase = useCase.execute({
            channel: channel,
            datetimeRange: new DateTimeRange("2025-09-11T00:00:00", "2025-09-12T23:59:59"),
            options: {}
        });

        expect(programUseCase).toHaveLength(2);
    });

    test.each([
        { channelId: "TF1.fr" , dateTimeRangeStart: "2025-09-11T21:00:00", dateTimeRangeEnd: "2025-09-12T00:00:00", count: 0},
        { channelId: "TF1.fr" , dateTimeRangeStart: "2025-09-11T15:00:00", dateTimeRangeEnd: "2025-09-11T18:00:00", count: 1},
        { channelId: "TF1.fr" , dateTimeRangeStart: "2025-09-12T21:00:00", dateTimeRangeEnd: "2025-09-12T23:00:00", count: 1},
        { channelId: "M6.fr" , dateTimeRangeStart: "2025-09-12T21:00:00", dateTimeRangeEnd: "2025-09-13T00:00:00", count: 2},
        { channelId: "M6.fr" , dateTimeRangeStart: "2025-09-12T19:00:00", dateTimeRangeEnd: "2025-09-13T00:00:00", count: 3},
    ])(
        "should get $count programs by channel $channelId for day $dateTimeRangeStart - $dateTimeRangeEnd",
        async ({ channelId, dateTimeRangeStart, dateTimeRangeEnd, count }) => {
            const programs = fakePrograms.filter((p) => p.channel === channelId)
            repoMock.findByChannel.mockReturnValue(programs);

            const channel = new Channel({ sourceId: 1, id: channelId, name: "name", icon: "https://img.fake.jpg" });
            const programUseCase = useCase.execute({
                channel: channel,
                datetimeRange: new DateTimeRange(dateTimeRangeStart, dateTimeRangeEnd),
                options: {}
            });

            expect(programUseCase).toHaveLength(count);
        }
    );

    test.each([
        { dateStart: "2025-09-12T21:00:00.000Z", dateEnd: "2025-09-12T23:30:00.000Z", expectedCount: 2 },
        { dateStart: "2025-09-12T21:00:00.000Z", dateEnd: "2025-09-13T01:00:00.000Z", expectedCount: 3 },
        { dateStart: "2025-09-12T09:00:00.000Z", dateEnd: "2025-09-12T12:00:00.000Z", expectedCount: 0 },
    ])(
        "should get $expected programs for DateTimeRange $dateStart - $dateEnd",
        ({ dateStart, dateEnd, expectedCount }) => {
            const programsForDateTimeRange = useCase.getProgramsForDatetimeRange(
                fakePrograms,
                new DateTimeRange(dateStart, dateEnd)
            );

            expect(programsForDateTimeRange).toHaveLength(expectedCount);
        }
    );

    test.each([
        {'minDurationinMinutes': 10, 'expectedCount': 4},
        {'minDurationinMinutes': 120, 'expectedCount': 2},
        {'minDurationinMinutes': 180, 'expectedCount': 0},
    ])(
        "should filter programs by duration $minDurationinMinutes",
        ({ minDurationinMinutes, expectedCount }) => {
            const filteredPrograms = useCase.filterPrograms(fakePrograms, { minDuration: minDurationinMinutes });

            expect(filteredPrograms).toHaveLength(expectedCount);
        }
    );

    test.each([
        {'excludedTitles': ["L'internat de la honte"], 'expectedCount': 4},
        {'excludedTitles': ["S.W.A.T"], 'expectedCount': 3},
        {'excludedTitles': ["S.W.A.T", "L'internat de la honte"], 'expectedCount': 2},
        {'excludedTitles': ["meteo"], 'expectedCount': 4},
        {'excludedTitles': ["Tout beau, tout n9uf"], 'expectedCount': 4},
    ])(
        "should filter programs by excludedTitles $excludedTitles",
        ({ excludedTitles, expectedCount }) => {
            const filteredPrograms = useCase.filterPrograms(fakePrograms, { excludedTitles });

            expect(filteredPrograms).toHaveLength(expectedCount);
        }
    );

    it('should group programs by title', () => {
        const programs = [
            new Program({
                channel: "TF1.fr",
                start: new Date("2025-09-11T22:00:00.000Z"),
                stop: new Date("2025-09-11T23:30:00.000Z"),
                title: "L'internat de la honte"
            }),
            new Program({
                channel: "TF1.fr",
                start: new Date("2025-09-11T21:00:00.000Z"),
                stop: new Date("2025-09-11T21:30:00.000Z"),
                title: "S.W.A.T",
                description: "first episode",
            }),
            new Program({
                channel: "TF1.fr",
                start: new Date("2025-09-11T21:30:00.000Z"),
                stop: new Date("2025-09-11T22:00:00.000Z"),
                title: "S.W.A.T",
                description: "second episode",
            }),
        ];

        const expectedPrograms = [
            [
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T22:00:00.000Z"),
                    stop: new Date("2025-09-11T23:30:00.000Z"),
                    title: "L'internat de la honte"
                }),
            ],
            [
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T21:00:00.000Z"),
                    stop: new Date("2025-09-11T21:30:00.000Z"),
                    title: "S.W.A.T",
                    description: "first episode",
                }),
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T21:30:00.000Z"),
                    stop: new Date("2025-09-11T22:00:00.000Z"),
                    title: "S.W.A.T",
                    description: "second episode",
                }),
            ],
        ];

        const programsGrouped = useCase.groupByProgramsTitle(programs);

        expect(programsGrouped).toHaveLength(2);
        expect(programsGrouped).toEqual(expectedPrograms);
    });

    it('should order programs by start time', () => {
        const programs = [
            [
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T22:00:00.000Z"),
                    stop: new Date("2025-09-11T23:30:00.000Z"),
                    title: "L'internat de la honte"
                }),
            ],
            [
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T21:00:00.000Z"),
                    stop: new Date("2025-09-11T21:30:00.000Z"),
                    title: "S.W.A.T",
                    description: "first episode",
                }),
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T21:30:00.000Z"),
                    stop: new Date("2025-09-11T22:00:00.000Z"),
                    title: "S.W.A.T",
                    description: "second episode",
                }),
            ],
        ];

        const programsOrdered = useCase.orderProgramsByStartTime(programs);

        expect(programsOrdered[0][0].title).toBe("S.W.A.T");
        expect(programsOrdered[0][1].title).toBe("S.W.A.T");
        expect(programsOrdered[1][0].title).toBe("L'internat de la honte");
    });
});
