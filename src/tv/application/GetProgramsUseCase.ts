import { Day } from "../domain/Day.ts";
import type { Program } from "../domain/Program.ts";

interface TimeRange {
  start: string;
  end: string;
}

interface ExecuteOptions {
  excludeChannels?: string[];
  includeChannels?: string[];
  day?: Day | null;
  timeRange?: TimeRange | null;
}

export class GetProgramsUseCase {
  private programRepository: { findAll: () => Promise<Program[]> };

  constructor(programRepository: { findAll: () => Promise<Program[]> }) {
    this.programRepository = programRepository;
  }

  async execute(options: ExecuteOptions = {}): Promise<Program[]> {
    const { excludeChannels = [], includeChannels = [], day = null, timeRange = null } = options;

    let programs = await this.programRepository.findAll();

    if (excludeChannels.length > 0) {
      programs = programs.filter(p => !excludeChannels.includes(p.channel));
    }

    if (includeChannels.length > 0) {
      programs = programs.filter(p => includeChannels.includes(p.channel));
    }

    if (day instanceof Day) {
      programs = programs = programs.filter(p =>
        p.start.getDate() === day.getDayOfMonth() &&
        p.start.getMonth() === day.getMonth() &&
        p.start.getFullYear() === day.getFullYear()
      );
    }

    if (timeRange) {
      const [startHour, startMinute] = timeRange.start.split(":").map(Number);
      const [endHour, endMinute] = timeRange.end.split(":").map(Number);

      programs = programs.filter(p => {
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

    programs = this.sortPrograms(programs);

    programs = this.filterShortPrograms(programs);

    return programs;
  }

  sortPrograms(programs: Program[]): Program[] {
    return programs.sort((a, b) => {
      if (a.id !== b.id) return a.id - b.id;
      return a.start.getTime() - b.start.getTime();
    });
  }

  filterShortPrograms(programs: Program[], minDurationMinutes = 10): Program[] {
    return programs.filter(p => {
      const duration = (p.stop.getTime() - p.start.getTime()) / 1000 / 60;
      return duration > minDurationMinutes;
    });
  }
}