import { describe, expect, it } from 'vitest';
import path from "path";
import { XmlTvProgramRepository } from '../../../src/tv/infrastructure/XmlTvProgramRepository';
import { Rating } from '../../../src/tv/domain/Rating';
import { TvShow } from '../../../src/tv/domain/TvShow';

const fakePrograms = path.resolve(__dirname, "../stub/fakeCSVPrograms.xml");

describe("Get programs", () => {

    it("should get all programs", () => {
        const repository = new XmlTvProgramRepository(fakePrograms);

        const programs = repository.findAll();

        expect(programs).toHaveLength(3);

        expect(programs[0].channel).toBe("France2.fr");
        expect(programs[0].start).toBeInstanceOf(Date);
        expect(programs[0].start.toISOString()).toBe("2025-09-01T01:10:00.000Z");
        expect(programs[0].stop).toBeInstanceOf(Date);
        expect(programs[0].stop.toISOString()).toBe("2025-09-01T06:00:00.000Z");
        expect(programs[0].title).toBe("Programmes de la nuit");
        expect(programs[0].subTitle).toBe("Que de bonheur");
        expect(programs[0].description).toBe("Le résumé n'est pas disponible");
        expect(programs[0].image).toBe("https://img.bouygtel.fr/CMS/images/EBE64969228A4E87CCB86326164FE0B7.jpg");
        expect(programs[0].categories).toContain("XY");
        expect(programs[0].categories).toContain("Programme indéterminé");
        expect(programs[0].rating).toBeInstanceOf(Rating);
        expect(programs[0].rating.system).toBe("CSA");
        expect(programs[0].rating.value).toBe("Tout public");
    });

    it("should get all programs with tv show", () => {
        const repository = new XmlTvProgramRepository(fakePrograms);

        const programs = repository.findAll();

        expect(programs).toHaveLength(3);

        expect(programs[2].tvShow).toBeInstanceOf(TvShow);
        expect(programs[2].tvShow.season).toBe(9);
        expect(programs[2].tvShow.episode).toBe(1);
    });

});
