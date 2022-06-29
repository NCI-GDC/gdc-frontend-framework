import { useSSMS, selectSsmsSummaryData, useCoreSelector } from "@gff/core";

export const SSMSSummary = ({ ssm_id }) => {
  const { isFetching } = useSSMS({
    filters: {
      op: "and",
      content: [
        {
          content: {
            field: "ssm_id",
            value: ssm_id,
          },
          op: "in",
        },
        {
          content: [
            {
              content: {
                field: "consequence.transcript.is_canonical",
                value: ["true"],
              },
              op: "in",
            },
          ],
          op: "and",
        },
      ],
    },
    expand: ["consequence.transcript", "consequence.transcript.annotation"],
    fields: [
      "reference_allele",
      "genomic_dna_change",
      "mutation_subtype",
      "ncbi_build",
      "reference_allele",
      "cosmic_id",
      "clinical_annotations.civic.variant_id",
    ],
    size: 1,
  });

  const summaryData = useCoreSelector((state) => selectSsmsSummaryData(state));

  return <div>{!isFetching && summaryData ? <h1>Hello</h1> : null}</div>;
};
