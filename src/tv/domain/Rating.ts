export interface RatingProps {
  value: string;
  system?: string;
  icon?: string;
}

export class Rating {
  value: string;
  system?: string;
  icon?: string;

  constructor(props: RatingProps) {
    const { value, system, icon } = props;

    if (!value) throw new Error("Rating must have a value");

    this.system = system;
    this.value = value;
    this.icon = icon;
  }
}