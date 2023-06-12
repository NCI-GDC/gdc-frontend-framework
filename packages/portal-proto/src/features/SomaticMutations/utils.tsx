import { Tooltip, Text } from "@mantine/core";
import { Survival } from "../../components/expandableTables/shared/types";
import { SSMSData } from "@gff/core";
import { humanify } from "src/utils";

export interface Impact {
  polyphenImpact: string;
  polyphenScore: number | string;
  siftImpact: string;
  siftScore: number | string;
  vepImpact: string;
}

export interface SomaticMutations {
  select: string;
  mutationID: string;
  DNAChange: string;
  type: string;
  consequences: string;
  proteinChange: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  affectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  affectedCasesAcrossTheGDC: {
    numerator: number;
    denominator: number;
  };
  cohort: {
    checked: boolean;
  };
  survival: Survival;
  impact: Impact;
  subRows: string;
  ssmsTotal: number;
}

export type SsmToggledHandler = (symbol: Record<string, any>) => void;

const DNA_CHANGE_MARKERS = ["del", "ins", ">"];
export const truncateAfterMarker = (
  term: string,
  length: number,
  markers: string[] = DNA_CHANGE_MARKERS,
  omission = "…",
): string => {
  const markersByIndex = markers.reduce(
    (acc, marker) => {
      const index = term.indexOf(marker);
      if (index !== -1) {
        return { index, marker };
      }
      return acc;
    },
    { index: -1, marker: "" },
  );
  const { index, marker } = markersByIndex;
  if (index !== -1 && term.length > index + marker.length + 8) {
    return `${term.substring(0, index + marker.length + 8)}${omission}`;
  }
  return term;
};

// need to move it
export const HeaderTooltip = ({
  title,
  tooltip,
}: {
  title: string;
  tooltip: string;
}): JSX.Element => {
  return (
    <Tooltip
      label={<Text className="whitespace-pre-line text-left">{tooltip}</Text>}
      width={200}
      multiline
      withArrow
      transition="fade"
      transitionDuration={200}
      position="bottom-start"
    >
      <div className="font-heading text-left text-sm whitespace-pre-line">
        {title}
      </div>
    </Tooltip>
  );
};

export const filterMutationType = (mutationSubType: string): string => {
  if (
    ["Oligo-nucleotide polymorphism", "Tri-nucleotide polymorphism"].includes(
      mutationSubType,
    )
  )
    return mutationSubType;
  const split = mutationSubType.split(" ");
  const operation = split[split.length - 1];
  return operation.charAt(0).toUpperCase() + operation.slice(1);
};

export const getMutation = (
  sm: SSMSData,
  selectedSurvivalPlot: Record<string, string>,
  filteredCases: number,
  cases: number,
  ssmsTotal: number,
): SomaticMutations => {
  const {
    ssm_id,
    genomic_dna_change,
    mutation_subtype,
    consequence,
    filteredOccurrences,
    occurrence,
  } = sm;

  const [
    {
      transcript: {
        consequence_type = undefined,
        gene: { gene_id = undefined, symbol = undefined } = {},
        aa_change = undefined,
        annotation: {
          polyphen_impact = undefined,
          polyphen_score = undefined,
          sift_impact = undefined,
          sift_score = undefined,
          vep_impact = undefined,
        } = {},
      } = {},
    } = {},
  ] = consequence;

  return {
    select: ssm_id,
    mutationID: ssm_id,
    DNAChange: genomic_dna_change,
    type: filterMutationType(mutation_subtype),
    consequences: consequence_type,
    proteinChange: {
      symbol: symbol,
      geneId: gene_id,
      aaChange: aa_change,
    },
    affectedCasesInCohort: {
      numerator: filteredOccurrences,
      denominator: filteredCases,
    },
    affectedCasesAcrossTheGDC: {
      numerator: occurrence,
      denominator: cases,
    },
    cohort: {
      checked: true,
    },
    survival: {
      label: `${symbol} ${aa_change ? aa_change : ""} ${humanify({
        term: consequence_type?.replace("_variant", "").replace("_", " "),
      })}`,
      name: genomic_dna_change,
      symbol: ssm_id,
      checked: ssm_id == selectedSurvivalPlot?.symbol,
    },
    impact: {
      polyphenImpact: polyphen_impact,
      polyphenScore: polyphen_score,
      siftImpact: sift_impact,
      siftScore: sift_score,
      vepImpact: vep_impact,
    },
    // do not remove subRows key, it's needed for row.getCanExpand() to be true
    subRows: " ",
    ssmsTotal,
  };
};
