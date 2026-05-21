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
