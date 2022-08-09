import { range } from "lodash";

export type GenesSubRow = {
  title: string;
  description: string;
};

export type GenesColumns = {
  symbol: string;
  name: string;
  survival: string;
  // SSMSAffectedCasesInCohort: string
  SSMSAffectedCasesAcrossTheGDC: string[];
  // CNVGain: string,
  // CNVLoss: string,
  // mutations: number
  // annotations: string,
  subRows?: GenesSubRow[];
};

const newGenesColumn = (): GenesColumns => {
  return {
    SSMSAffectedCasesAcrossTheGDC: ["hello", "someid"],
    symbol: "symbol",
    name: "myname",
    survival: "surviving",
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): GenesColumns[] => {
    const len = lens[depth]!;
    return range(len).map((d): GenesColumns => {
      return {
        ...newGenesColumn(),
        subRows: [
          {
            title: "title",
            description: "description",
          },
        ],
      };
    });
  };
  return makeDataLevel();
}
