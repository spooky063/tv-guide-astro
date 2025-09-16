import { beforeEach, describe, expect, it, test } from 'vitest';
import { GetChannelUseCase } from '../../../src/tv/application/GetChannelUseCase.ts';
import { Channel } from '../../../src/tv/domain/Channel.ts';
import { Program } from '../../../src/tv/domain/Program.ts';

describe("Get channels", () => {
    let useCase: GetChannelUseCase;
    let fakeChannels: Channel[] = [
        new Channel({ sourceId: 1, id: "TF1.fr", name: "TF1", icon: "https://img.fake.jpg" }),
        new Channel({ sourceId: 6, id: "M6.fr", name: "M6", icon: "https://img.fake.jpg" }),
        new Channel({ sourceId: 2, id: "France2.fr", name: "M6", icon: "https://img.fake.jpg" }),
    ];

    beforeEach(() => {
        const repoMock = { findAll: () => fakeChannels};
        useCase = new GetChannelUseCase(repoMock);
    });

    it("should get all channels", () => {
        const result = useCase.execute();

        expect(result).toHaveLength(3);
    });

    it("should exclude channels TF1.fr and M6.fr", () => {
        const result = useCase.execute(
            { excludeChannels: ["TF1.fr", "M6.fr"] }
        );

        expect(result).toHaveLength(1);
    });

    it('should include channels TF1.fr and M6.fr', () => {
        const result = useCase.execute(
            { includeChannels: ["TF1.fr", "M6.fr"] }
        );

        expect(result).toHaveLength(2);
    });

    it('should order channels by sourceId', () => {
        const result = useCase.execute();

        expect(result[0].sourceId).toBe(1);
        expect(result[1].sourceId).toBe(2);
        expect(result[2].sourceId).toBe(6);
    });

    it('should add program to channel TF1.fr', () => {
        fakeChannels[0].addProgram(
            [
                new Program({
                    channel: "TF1.fr",
                    start: new Date("2025-09-11T21:00:00.000Z"),
                    stop: new Date("2025-09-11T23:35:00.000Z"),
                    title: "Doctor Strange"
                })
            ]
        );

        const result = useCase.execute(
            { includeChannels: ["TF1.fr"] }
        );

        expect(result[0].programs).toHaveLength(1);
    });

});