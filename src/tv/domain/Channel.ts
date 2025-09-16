import type { Program } from "./Program.ts";

export interface ChannelProps {
  sourceId: number;
  id: string;
  name: string;
  icon: string;
  programs?: Program[][];
}

export class Channel {
  sourceId: number;
  id: string;
  name: string;
  icon: string;
  programs?: Program[][];

  constructor(props: ChannelProps) {
    const { sourceId, id, name, icon, programs } = props;

    if (!id) throw new Error("Channel must have an id");
    if (!name) throw new Error("Channel must have a name");

    this.sourceId = sourceId;
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.programs = programs;
  }

  addProgram(program: Program[][]): Channel {
    if (!this.programs) {
      this.programs = [];
    }

    this.programs.push(...program);

    return this;
  }
}