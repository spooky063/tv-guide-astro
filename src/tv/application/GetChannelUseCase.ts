import type { Channel } from "../domain/Channel.ts";

interface ExecuteOptions {
  excludeChannels?: string[];
  includeChannels?: string[];
}

export class GetChannelUseCase {
  private channelRepository: { findAll: () => Channel[] };

  constructor(channelRepository: { findAll: () => Channel[] }) {
    this.channelRepository = channelRepository;
  }

  execute(options: ExecuteOptions = {}): Channel[] {
    const { excludeChannels = [], includeChannels = [] } = options;

    let channels = this.channelRepository.findAll();

    if (options.excludeChannels) {
      channels = this.excludeChannels(channels, excludeChannels);
    }

    if (options.includeChannels) {
      channels = this.includeChannels(channels, includeChannels);
    }

    channels = this.orderChannelsById(channels);

    return channels;
  }

  excludeChannels(channels: Channel[], excludeChannels: string[]): Channel[] {
    return channels.filter(c => !excludeChannels.includes(c.id));
  }

  includeChannels(channels: Channel[], includeChannels: string[]): Channel[] {
    return channels.filter(c => includeChannels.includes(c.id));
  }

  orderChannelsById(channels: Channel[]): Channel[] {
    return channels.sort((a, b) => a.sourceId - b.sourceId);
  }
}