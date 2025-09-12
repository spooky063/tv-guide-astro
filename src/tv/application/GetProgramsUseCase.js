export class GetProgramsUseCase {
  constructor(programRepository) {
    this.programRepository = programRepository;
  }

  async execute({ excludeChannels = [], includeChannels = [], timeRange = null } = {}) {
    let programs = await this.programRepository.findAll();

    if (excludeChannels.length > 0) {
      programs = programs.filter(p => !excludeChannels.includes(p.channel));
    }

    if (includeChannels.length > 0) {
      programs = programs.filter(p => includeChannels.includes(p.channel));
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
          return programTime >= startLimit && programTime <= endLimit;
        }

        return programTime >= startLimit || programTime <= endLimit;
      });
    }

    programs = this.filterShortPrograms(programs);

    return programs;
  }

  filterShortPrograms(programs, minDurationMinutes = 5) {
    return programs.filter(p => {
      const duration = (p.stop - p.start) / 1000 / 60;
      return duration > minDurationMinutes;
    });
  }
}