export interface ColorMap {
  readonly cnv: Record<string, string>;
  readonly mutation: Record<string, string>;
}

export interface Donor {
  readonly id: string;
  readonly gender: string;
  readonly race: string;
  readonly ethnicity: string;
  readonly age: number;
  readonly vitalStatus: string;
  readonly daysToDeath: number;
  readonly cnv: number;
}

export interface Gene {
  readonly id: string;
  readonly symbol: string;
  readonly totalDonors: number;
  readonly cgc: boolean;
  readonly cnv: number;
}

export interface CNVObservation {
  readonly donorId: string;
  readonly geneId: string;
  readonly ids: string[];
  readonly cnvChange: string;
  readonly type: "cnv";
}

export interface SSMObservation {
  readonly ids: string[];
  readonly donorId: string;
  readonly geneId: string;
  readonly consequence: string;
  readonly type: "mutation";
  readonly geneSymbol: string;
  readonly functionalImpact: string;
}
