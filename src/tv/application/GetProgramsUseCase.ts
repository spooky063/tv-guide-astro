import type { Channel } from "../domain/Channel.ts";
import { Day } from "../domain/Day.ts";
import type { Program } from "../domain/Program.ts";

interface TimeRange {
  start: string;
  end: string;
}

interface ExecuteOptions {
  channel: Channel;
  day?: Day | null;
  timeRange?: TimeRange | null;
}

export class GetProgramsUseCase {
  private programRepository: { findByChannel: (channel: Channel) => Program[] };

  constructor(programRepository: { findByChannel: (channel: Channel) => Program[] }) {
    this.programRepository = programRepository;
  }

  execute(options: ExecuteOptions): Program[][] {
    const { channel, day = null, timeRange = null } = options;

    let programs = this.programRepository.findByChannel(channel);

    if (day instanceof Day) {
      programs = this.getProgramsForDay(programs, day);
    }

    if (timeRange) {
      programs = this.getProgramForTimeRange(programs, timeRange);
    }

    programs = this.filterShortPrograms(programs, 15);

    const groupedPrograms = this.groupByProgramsTitle(programs);

    return this.orderProgramsByStartTime(groupedPrograms);
  }

  getProgramsForDay(programs: Program[], day: Day): Program[] {
    return programs.filter(p =>
      p.start.getDate() === day.getDayOfMonth() &&
      p.start.getMonth() === day.getMonth() &&
      p.start.getFullYear() === day.getFullYear()
    );
  }

  getProgramForTimeRange(programs: Program[], timeRange: TimeRange): Program[] {
    const [startHour, startMinute] = timeRange.start.split(":").map(Number);
    const [endHour, endMinute] = timeRange.end.split(":").map(Number);

    return programs.filter(p => {
      const start = p.start;
      const programTime = start.getHours() * 60 + start.getMinutes();
      const startLimit = startHour * 60 + startMinute;
      const endLimit = endHour * 60 + endMinute;

      if (endLimit > startLimit) {
        return programTime >= startLimit && programTime < endLimit;
      }

      return programTime >= startLimit || programTime < endLimit;
    });
  }

  filterShortPrograms(programs: Program[], minDurationMinutes = 10): Program[] {
    return programs.filter(p => {
      const duration = (p.stop.getTime() - p.start.getTime()) / 1000 / 60;
      return duration > minDurationMinutes;
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
