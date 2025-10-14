import type { Channel } from "../domain/Channel.ts";
import type { DateTimeRange } from "../domain/DateTimeRange.ts";
import type { Program } from "../domain/Program.ts";

type FilterOptions = {
  minDuration?: number;
  excludedTitles?: string[];
}

type ExecuteOptions = {
  channel: Channel;
  datetimeRange: DateTimeRange;
  options: FilterOptions;
}

export class GetProgramsUseCase {
  private programRepository: { findByChannel: (channel: Channel) => Program[] };

  constructor(programRepository: { findByChannel: (channel: Channel) => Program[] }) {
    this.programRepository = programRepository;
  }

  execute(executeOptions: ExecuteOptions): Program[][] {
    const { channel, datetimeRange, options = {} } = executeOptions;

    let programs = this.programRepository.findByChannel(channel);

    programs = this.getProgramsForDatetimeRange(programs, datetimeRange);

    programs = this.filterPrograms(programs, options);

    const groupedPrograms = this.groupByProgramsTitle(programs);

    return this.orderProgramsByStartTime(groupedPrograms);
  }

  getProgramsForDatetimeRange(programs: Program[], dateTimeRange: DateTimeRange): Program[] {
    const startLimit = dateTimeRange.start.getTime();
    const endLimit = dateTimeRange.end.getTime();

    const MS_PER_MINUTE = 60000;
    const startLimitMinus30Minutes = new Date(startLimit - 30 * MS_PER_MINUTE).getTime();

    return programs.filter(p => {
      const programEnd = p.stop.getTime();
      const programStart = p.start.getTime();
      const programDuration = programEnd - programStart;

      if (programDuration < 30 * MS_PER_MINUTE
          && programStart >= startLimitMinus30Minutes
          && startLimit >= programEnd
      ) {
          return true;
      }

      return programEnd > startLimit && programStart < endLimit;
    });
  }

  filterPrograms(programs: Program[], options: FilterOptions): Program[] {
    const { minDuration = 0, excludedTitles = [] } = options;
    const excludedTitlesNormalized = excludedTitles.map(t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());

    return programs.filter(p => {
      const durationInMinutes = (p.stop.getTime() - p.start.getTime()) / 1000 / 60;
      if (minDuration > 0 && durationInMinutes <= minDuration) {
        return false;
      }

      const programTitleNormalized = p.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (excludedTitlesNormalized.includes(programTitleNormalized)) {
        return false;
      }

      return true;
    });
  }

  groupByProgramsTitle(programs: Program[]): Program[][] {
    const grouped = Object.groupBy(programs, ({ title }) => title);
    return Object.values(grouped).filter((g): g is Program[] => g !== undefined);
  }

  orderProgramsByStartTime(programs: Program[][]): Program[][] {
    const sortedGroups = programs.map(program =>
      [...program].sort((a, b) => a.start.getTime() - b.start.getTime())
    );

    return sortedGroups.sort((a, b) => {
      const startA = a[0]?.start.getTime() ?? 0;
      const startB = b[0]?.start.getTime() ?? 0;
      return startA - startB;
    });
  }
}
