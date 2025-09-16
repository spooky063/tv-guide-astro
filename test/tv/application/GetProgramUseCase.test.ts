import { beforeEach, describe, expect, it, vi, test } from 'vitest';
import { GetProgramsUseCase } from '../../../src/tv/application/GetProgramsUseCase.ts';
import { Program } from '../../../src/tv/domain/Program.ts';
import { Day } from '../../../src/tv/domain/Day.ts';
import { Channel } from '../../../src/tv/domain/Channel.ts';

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
            title: "Donjons & Dragons : L'honneur des voleurs"
        }),
        new Program({
            channel: "M6.fr",
            start: new Date("2025-09-12T23:35:00.000Z"),
            stop: new Date("2025-09-13T01:55:00.000Z"),
            title: "La Petite Sirène"
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
        const programUseCase = useCase.execute({ channel });

        expect(programUseCase).toHaveLength(2);
    });

    test.each([
        { channelId: "M6.fr" , day: "2025-09-12", count: 2},
        { channelId: "TF1.fr" , day: "2025-09-12", count: 1},
        { channelId: "TF1.fr" , day: "2025-09-11", count: 1},
        { channelId: "TF1.fr" , day: "2025-09-10", count: 0},
    ])(
        "should get $count programs by channel $channelId for day $day",
        async ({ channelId, day, count }) => {
            const programs = fakePrograms.filter((p) => p.channel === channelId)
            repoMock.findByChannel.mockReturnValue(programs);

            const channel = new Channel({ sourceId: 1, id: channelId, name: "name", icon: "https://img.fake.jpg" });
            const programUseCase = useCase.execute({ channel, day: new Day(day) });

            expect(programUseCase).toHaveLength(count);
        }
    );

    test.each([
        { channelId: "TF1.fr" , day: "2025-09-11", startRange: "21:00", endRange: "00:00", count: 0},
        { channelId: "TF1.fr" , day: "2025-09-11", startRange: "15:00", endRange: "18:00", count: 1},
        { channelId: "TF1.fr" , day: "2025-09-12", startRange: "21:00", endRange: "23:00", count: 1},
        { channelId: "M6.fr" , day: "2025-09-12", startRange: "21:00", endRange: "00:00", count: 2},
        { channelId: "M6.fr" , day: "2025-09-12", startRange: "19:00", endRange: "00:00", count: 2},
    ])(
        "should get $count programs by channel $channelId for day $day and time range $startRange - $endRange",
        async ({ channelId, day, startRange, endRange, count }) => {
            const programs = fakePrograms.filter((p) => p.channel === channelId)
            repoMock.findByChannel.mockReturnValue(programs);

            const channel = new Channel({ sourceId: 1, id: channelId, name: "name", icon: "https://img.fake.jpg" });
            const programUseCase = useCase.execute({
                channel,
                day: new Day(day),
                timeRange: { start: startRange, end: endRange }
            });

            expect(programUseCase).toHaveLength(count);
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
