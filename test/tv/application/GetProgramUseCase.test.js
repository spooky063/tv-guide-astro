import { beforeEach, describe, expect, it, test } from 'vitest';
import { GetProgramsUseCase } from '../../../src/tv/application/GetProgramsUseCase';
import { Program } from '../../../src/tv/domain/Program';

describe("Get prime time programs", () => {
    let fakePrograms;
    let useCase;

    beforeEach(() => {
        fakePrograms = [
            new Program({
                channel: "TF1.fr",
                start: new Date("2025-09-11T16:00:00.000Z"),
                stop: new Date("2025-09-11T17:30:00.000Z"),
                title: "L'internat de la honte"
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
        const repoMock = { findAll: async () => fakePrograms };
        useCase = new GetProgramsUseCase(repoMock);
    });

    test.each([
        { excludeChannels: ["TF1.fr"] , count: 3},
        { excludeChannels: ["M6.fr"] , count: 1},
    ])(
        "get $count programs for program without $excludeChannels",
        async ({ excludeChannels, count }) => {
            const result = await useCase.execute({ excludeChannels: excludeChannels });
            expect(result).toHaveLength(count);
        }
    );

    it("should get prime time programs for M6.fr", async () => {
        const result = await useCase.execute({
            includeChannels: ["M6.fr"],
            timeRange: { start: "21:00", end: "00:00" }
        });
        expect(result).toHaveLength(2);
        expect(result[0].title).toBe("Donjons & Dragons : L'honneur des voleurs");
        expect(result[1].title).toBe("La Petite Sirène");
    });

    it("should get prime time programs for TF1.fr without short programs", async () => {
        fakePrograms.push(
            new Program({
                channel: "TF1.fr",
                start: new Date("2025-09-11T20:55:00.000Z"),
                stop: new Date("2025-09-11T21:00:00.000Z"),
                title: "Météo"
            }),
            new Program({
                channel: "TF1.fr",
                start: new Date("2025-09-12T21:00:00.000Z"),
                stop: new Date("2025-09-12T23:35:00.000Z"),
                title: "Doctor Strange"
            })
        );

        const result = await useCase.execute({
            includeChannels: ["TF1.fr"],
            timeRange: { start: "20:55", end: "00:00" }
        });
        expect(result).toHaveLength(1);
    });

});
