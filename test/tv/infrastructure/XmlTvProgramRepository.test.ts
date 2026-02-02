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
        expect(programs[1].categories?.[0]).toBe("XY");
        expect(programs[1].categories?.[1]).toBe("Téléréalité");
        expect(programs[1].image).toBe("https://img.bouygtel.fr/CMS/images/0CBCF4884996A3C3C0CFF35863F4F383.jpg");
        expect(programs[1].rating?.system).toBe("CSA");
        expect(programs[1].rating?.value).toBe("-12");
        expect(programs[1].rating?.icon).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Moins12.svg/200px-Moins12.svg.png");
        expect(programs[1].tvShow?.episode).toBe(1);
        expect(programs[1].tvShow?.season).toBe(9);
    });

    it('should get all properties for program', () => {
        const repository = new XmlTvProgramRepository(fakePrograms);

        const programs = repository.findByChannel(
            new Channel({ sourceId: 1, id: "TF1.fr", name: "TF1", icon: "https://img.fake.jpg" })
        );
        const program = programs[0];

        expect(program.channel).toBe("TF1.fr");
        expect(program.title).toBe("Bonjour ! La Matinale TF1");
        expect(program.subTitle).toBe("On repart !");
        expect(program.description).toBe("Le résumé n'est pas disponible");
        expect(program.credits).toBeDefined();
        expect(program.credits?.director).toHaveLength(1);
        expect(program.credits?.director?.[0]?.name).toBe("Adrien Gindre");
        expect(program.credits?.actor).toHaveLength(3);
        expect(program.credits?.actor?.[0]?.name).toBe("Jean-Marie Bagayoko");
        expect(program.credits?.actor?.[1]?.name).toBe("Hélène Mannarino");
        expect(program.credits?.actor?.[2]?.name).toBe("Vincent Valinducq");
        expect(program.credits?.adapter).toHaveLength(1);
        expect(program.credits?.adapter?.[0]?.name).toBe("Abby Knight");
        expect(program.credits?.producer).toHaveLength(1);
        expect(program.credits?.producer?.[0]?.name).toBe("Joseph Wilka");
        expect(program.credits?.guest).toHaveLength(9);
        expect(program.credits?.guest?.[0]?.name).toBe("Garance Pardigon");
        expect(program.credits?.guest?.[1]?.name).toBe("Laurent Mariotte");
        expect(program.credits?.guest?.[2]?.name).toBe("Karima Charni");
        expect(program.credits?.guest?.[3]?.name).toBe("Ange Noiret");
        expect(program.credits?.guest?.[4]?.name).toBe("Bruce Toussaint");
        expect(program.credits?.guest?.[5]?.name).toBe("Anaïs Grangerac");
        expect(program.credits?.guest?.[6]?.name).toBe("Maud Descamps");
        expect(program.credits?.guest?.[7]?.name).toBe("Benjamin Muller");
        expect(program.credits?.guest?.[8]?.name).toBe("Christophe Beaugrand");
        expect(program.credits?.composer).toHaveLength(1);
        expect(program.credits?.composer?.[0]?.name).toBe("David Bateman");
        expect(program.date).toStrictEqual(new Date("1990-10-11"));
        expect(program.country).toBe("Espagne");
    });

    it('should transform multiple date format', () => {
        const repository = new XmlTvProgramRepository(fakePrograms);

        const TF1 = repository.findByChannel(
            new Channel({ sourceId: 1, id: "TF1.fr", name: "TF1", icon: "https://img.fake.jpg" }),
        );
        expect(TF1[0].date).toStrictEqual(new Date("1990-10-11"));

        const France2 = repository.findByChannel(
            new Channel({ sourceId: 2, id: "France2.fr", name: "France 2", icon: "https://img.fake2.jpg" }),
        );
        expect(France2[0].date).toStrictEqual('2016');
    });
});
