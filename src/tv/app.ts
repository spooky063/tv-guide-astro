import { XmlTvProgramRepository } from "./infrastructure/XmlTvProgramRepository.ts";
import { GetProgramsUseCase } from "./application/GetProgramsUseCase.ts";
import { JsonProgramWriter } from "./infrastructure/JsonProgramWriter.ts";
import { XmlTvDownloader } from "./infrastructure/XmlTvDownloader.ts";
import { Day } from "./domain/Day.ts";

const url = "https://xmltvfr.fr/xmltv/xmltv_tnt.xml.gz";
const downloader = new XmlTvDownloader();
const xmlFile = await downloader.downloadToFile(url, "./var/downloads/xmltv_tnt.xml");

const repo = new XmlTvProgramRepository(xmlFile);
const useCase = new GetProgramsUseCase(repo);
const writer = new JsonProgramWriter("src/assets/programs.json");

const programs = await useCase.execute({
  day: new Day(),
  timeRange: { start: "20:55", end: "00:00" },
  excludeChannels: ['CanalPlus.fr', 'ParisPremiere.fr', 'CanalPlusSport.fr', 'CanalPlusCinema.fr', 'PlanetePlus.fr', 'BFMTV.fr', 'CNews.fr', 'LaChaineParlementaire.fr', 'LCI.fr', 'FranceInfo.fr']
});
writer.save(programs);
