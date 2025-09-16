import { XmlTvProgramRepository } from "./infrastructure/XmlTvProgramRepository.ts";
import { GetProgramsUseCase } from "./application/GetProgramsUseCase.ts";
import { JsonProgramWriter } from "./infrastructure/JsonProgramWriter.ts";
import { XmlTvDownloader } from "./infrastructure/XmlTvDownloader.ts";
import { Day } from "./domain/Day.ts";
import { XmlTvChannelRepository } from "./infrastructure/XmlTvChannelRepository.ts";
import { GetChannelUseCase } from "./application/GetChannelUseCase.ts";

const url = "https://xmltvfr.fr/xmltv/xmltv_tnt.xml.gz";
const downloader = new XmlTvDownloader();
const xmlFile = await downloader.downloadToFile(url, "./var/downloads/xmltv_tnt.xml");

const channelRepository = new XmlTvChannelRepository(xmlFile);
const channelUseCase = new GetChannelUseCase(channelRepository);
const channels = channelUseCase.execute({
  excludeChannels: ['CanalPlus.fr', 'ParisPremiere.fr', 'CanalPlusSport.fr', 'CanalPlusCinema.fr', 'PlanetePlus.fr', 'BFMTV.fr', 'CNews.fr', 'LaChaineParlementaire.fr', 'LCI.fr', 'FranceInfo.fr']
});

const programRepository = new XmlTvProgramRepository(xmlFile);
const programUseCase = new GetProgramsUseCase(programRepository);
channels.forEach((channel) => {
  console.log(`Get all programs for channel ${channel.name}`);
  const programs = programUseCase.execute({
    day: new Day(),
    timeRange: { start: "20:55", end: "00:00" },
    channel: channel
  });
  channel.addProgram(programs);
});

const writer = new JsonProgramWriter("src/assets/programs.json");
writer.save(channels);
