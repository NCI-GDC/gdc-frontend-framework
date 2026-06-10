import { externalLinks, ExternalReferenceEntry } from "@/utils/externalLinks";
import { SSMSSummaryData } from "@gff/core";

type SsmExternalReferencesInput = Pick<
  SSMSSummaryData,
  "cosmic_id" | "civic" | "transcript"
>;

export const buildSsmExternalReferences = (
  data: SsmExternalReferencesInput,
): ExternalReferenceEntry[] => {
  const {
    cosmic_id,
    civic,
    transcript: { annotation: { dbsnp } = {} },
  } = data;

  return [
    {
      label: "dbSNP",
      ids: dbsnp && /rs(\d+)$/g.test(dbsnp) ? dbsnp : undefined,
      buildHref: (id) => externalLinks.dbsnp(id),
    },
    {
      label: "COSMIC",
      ids: cosmic_id,
      buildHref: (id) =>
        externalLinks[id.substring(0, 4).toLowerCase() as "cosm" | "cosn"](
          id.match(/(\d+)$/g)?.[0] ?? id,
        ),
    },
    {
      label: "CIViC",
      ids: civic,
      buildHref: (id) => externalLinks.civic(id, "variant"),
    },
  ];
};

export type SsmSummaryTableData = {
  uuid: string;
  dna_change: string;
  type: string;
  reference_genome_assembly: string;
  allele_in_the_reference_assembly: string;
  transcript_id: string | null | undefined;
  vep_impact: string | null | undefined;
  sift_impact: string | null | undefined;
  sift_score: number | null | undefined;
  polyphen_impact: string | null | undefined;
  polyphen_score: number | null | undefined;
};

type SsmSummaryInput = Pick<
  SSMSSummaryData,
  | "uuid"
  | "dna_change"
  | "type"
  | "reference_genome_assembly"
  | "allele_in_the_reference_assembly"
  | "transcript"
>;

export const buildSsmSummary = (data: SsmSummaryInput): SsmSummaryTableData => {
  const {
    uuid,
    dna_change,
    type,
    reference_genome_assembly,
    allele_in_the_reference_assembly,
    transcript,
  } = data;

  return {
    uuid,
    dna_change,
    type,
    reference_genome_assembly,
    allele_in_the_reference_assembly,
    transcript_id: transcript?.transcript_id ?? null,
    vep_impact: transcript?.annotation?.vep_impact ?? null,
    sift_impact: transcript?.annotation?.sift_impact ?? null,
    sift_score: transcript?.annotation?.sift_score ?? null,
    polyphen_impact: transcript?.annotation?.polyphen_impact ?? null,
    polyphen_score: transcript?.annotation?.polyphen_score ?? null,
  };
};
