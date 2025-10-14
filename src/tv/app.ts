import { XmlTvProgramRepository } from "./infrastructure/XmlTvProgramRepository.ts";
import { GetProgramsUseCase } from "./application/GetProgramsUseCase.ts";
import { JsonProgramWriter } from "./infrastructure/JsonProgramWriter.ts";
import { XmlTvDownloader } from "./infrastructure/XmlTvDownloader.ts";
import { Day } from "./domain/Day.ts";
import { XmlTvChannelRepository } from "./infrastructure/XmlTvChannelRepository.ts";
import { GetChannelUseCase } from "./application/GetChannelUseCase.ts";
import { DateTimeRange } from "./domain/DateTimeRange.ts";

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
const currentDay = new Day();
channels.forEach((channel) => {
  console.log(`Get all programs for channel ${channel.name}`);
  const programs = programUseCase.execute({
    channel: channel,
    datetimeRange: new DateTimeRange(
      currentDay.toDateTimeString(21, 30, 0),
      currentDay.toDateTimeString(25, 0, 0), // `25` hours means next day at 01:00:00
    ),
    options: {
      minDuration: 15,
      excludedTitles: ["Tout beau, tout n9uf", "TBT9", "Meteo"]
    }
  });
  channel.addProgram(programs);
});

const writer = new JsonProgramWriter("src/assets/programs.json");
writer.save(channels);
