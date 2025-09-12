import { XmlTvProgramRepository } from "./infrastructure/XmlTvProgramRepository.js";
import { GetProgramsUseCase } from "./application/GetProgramsUseCase.js";
import { JsonProgramWriter } from "./infrastructure/JsonProgramWriter.js";
import { XmlTvDownloader } from "./infrastructure/XmlTvDownloader.js";

const url = "https://xmltvfr.fr/xmltv/xmltv_tnt.xml";
const downloader = new XmlTvDownloader();
const xmlFile = await downloader.downloadToFile(url, "./var/downloads");

const repo = new XmlTvProgramRepository(xmlFile);
const useCase = new GetProgramsUseCase(repo);
const writer = new JsonProgramWriter("var/uploads/programs.json");

const programs = await useCase.execute({
  timeRange: { start: "20:55", end: "00:00" },
  excludeChannels: ['CanalPlus.fr', 'ParisPremiere.fr', 'CanalPlusSport.fr', 'CanalPlusCinema.fr', 'PlanetePlus.fr', 'BFMTV.fr', 'CNews.fr', 'LaChaineParlementaire.fr', 'LCI.fr', 'FranceInfo.fr']
});
writer.save(programs);

