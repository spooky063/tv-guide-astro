import { describe, expect, it } from 'vitest';
import path from "path";
import { XmlTvChannelRepository } from '../../../src/tv/infrastructure/XmlTvChannelRepository.ts';

const fakeChannels = path.resolve(__dirname, "../stub/fakeCSVChannels.xml");

describe("Get channels", () => {

    it('should get channels', () => {
        const repository = new XmlTvChannelRepository(fakeChannels);

        const channels = repository.findAll();

        expect(channels).toHaveLength(6);
        expect(channels[0].sourceId).toBe(1);
        expect(channels[0].id).toBe("TF1.fr");
        expect(channels[0].name).toBe("TF1");
        expect(channels[0].icon).toBe("https://www.teleboy.ch/assets/stations/308/icon320_light.png?v2023_48_0");
    });

});