const CreditTypes = {
    director: "director",
    actor: "actor",
    writer: "writer",
    adapter: "adapter",
    producer: "producer",
    composer: "composer",
    editor: "editor",
    presenter: "presenter",
    commentator: "commentator",
    guest: "guest"
} as const;

export type CreditType = keyof typeof CreditTypes;

const CreditTypeLabels: Record<CreditType, string> = {
  director: "Réalisateur",
  actor: "Acteur",
  writer: "Scénariste",
  adapter: "Adaptateur",
  producer: "Producteur",
  composer: "Compositeur",
  editor: "Éditeur",
  presenter: "Présentateur",
  commentator: "Commentateur",
  guest: "Invité"
} as const;

export interface CreditProps {
  creditType: CreditType[keyof CreditType];
  name: string;
}

export class Credit {
  creditType: CreditType[keyof CreditType];
  name: string;
  label?: string;

  constructor(props: CreditProps) {
    const { creditType, name } = props;

    this.creditType = creditType;
    this.name = name;
  }

  toJSON() {
    return {
      creditType: this.creditType,
      name: this.name,
      label: CreditTypeLabels[this.creditType as CreditType]
    };
  }
}