import { describe, expect, it } from 'vitest';
import path from "path";
import { XmlTvProgramRepository } from '../../../src/tv/infrastructure/XmlTvProgramRepository.ts';
import { Channel } from '../../../src/tv/domain/Channel.ts';

const fakePrograms = path.resolve(__dirname, "../stub/fakeCSVPrograms.xml");

describe("Get programs", () => {

    it('should get programs for channel TF1.fr', () => {
        const repository = new XmlTvProgramRepository(fakePrograms);

        const programs = repository.findByChannel(
            new Channel({ sourceId: 1, id: "TF1.fr", name: "TF1", icon: "https://img.fake.jpg" })
        );

        expect(programs).toHaveLength(2);
        expect(programs[1].channel).toBe("TF1.fr");
        expect(programs[1].title).toBe("Familles nombreuses : la vie en XXL");
        expect(programs[1].subTitle).toBe("La disparition de Noah Jefferson");
        expect(programs[1].description).toBe("Le résumé n'est pas disponible");
        expect(programs[1].categories).toHaveLength(2);
        expect(programs[1].categories[0]).toBe("XY");
        expect(programs[1].categories[1]).toBe("Téléréalité");
        expect(programs[1].image).toBe("https://img.bouygtel.fr/CMS/images/0CBCF4884996A3C3C0CFF35863F4F383.jpg");
        expect(programs[1].rating?.system).toBe("CSA");
        expect(programs[1].rating?.value).toBe("-12");
        expect(programs[1].rating?.icon).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Moins12.svg/200px-Moins12.svg.png");
        expect(programs[1].tvShow?.episode).toBe(1);
        expect(programs[1].tvShow?.season).toBe(9);
    });

});
