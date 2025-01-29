import { downloadTSV } from "@/components/Table/utils";
import { getFormattedTimestamp } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import saveAs from "file-saver";
import { CancerDistributionGeneType } from "../types";

export const handleTSVDownloadGene = (
  cancerDistributionTableDownloadData: CancerDistributionGeneType[],
  columns: ColumnDef<CancerDistributionGeneType>[],
): void => {
  downloadTSV({
    fileName: `cancer-distribution-table.${getFormattedTimestamp()}.tsv`,
    tableData: cancerDistributionTableDownloadData,
    columns: columns,
    option: {
      overwrite: {
        "#_ssm_affected_cases": {
          composer: (cancerDistributionData: CancerDistributionGeneType) =>
            `${cancerDistributionData.ssm_affected_cases.numerator || 0} / ${
              cancerDistributionData.ssm_affected_cases.denominator || 0
            } (${cancerDistributionData.ssm_affected_cases_percent.toFixed(
              2,
            )} %)`,
        },

        "#_cnv_gains": {
          composer: (cancerDistributionData: CancerDistributionGeneType) =>
            `${cancerDistributionData.cnv_gains.numerator || 0} / ${
              cancerDistributionData.cnv_gains.denominator || 0
            } (${cancerDistributionData.cnv_gains_percent.toFixed(2)} %)`,
        },

        "#_cnv_heterozygous_deletion": {
          composer: (cancerDistributionData: CancerDistributionGeneType) =>
            `${
              cancerDistributionData.cnv_heterozygous_deletions.numerator || 0
            } / ${
              cancerDistributionData.cnv_heterozygous_deletions.denominator || 0
            } (${cancerDistributionData.cnv_heterozygous_deletions_percent.toFixed(
              2,
            )} %)`,
        },

        "#_mutations": {
          composer: (cancerDistributionData: CancerDistributionGeneType) =>
            `${cancerDistributionData.num_mutations || 0}`,
        },
      },
    },
  });
};

export const handleJSONDownloadGene = (
  cancerDistributionTableDownloadData: CancerDistributionGeneType[],
): void => {
  const json = cancerDistributionTableDownloadData
    .map(
      ({
        project,
        disease_type,
        primary_site,
        ssm_affected_cases_percent,
        ssm_affected_cases,
        cnv_gains,
        cnv_gains_percent,
        cnv_heterozygous_deletions,
        cnv_heterozygous_deletions_percent,
        num_mutations,
      }) => {
        return {
          project_id: project,
          disease_type,
          site: primary_site,
          num_affected_cases: ssm_affected_cases.numerator,
          num_affected_cases_total: ssm_affected_cases.denominator,
          num_affected_cases_percent: ssm_affected_cases_percent,

          num_cnv_gain: cnv_gains.numerator,
          num_cnv_gain_percent: cnv_gains_percent,
          num_cnv_loss: cnv_heterozygous_deletions.numerator, // might need to change it here too
          num_cnv_loss_percent: cnv_heterozygous_deletions_percent,
          num_cnv_cases_total:
            cnv_gains.denominator || cnv_heterozygous_deletions.denominator,
          mutations_counts: num_mutations,
        };
      },
    )
    .sort(
      (a, b) => b.num_affected_cases_percent - a.num_affected_cases_percent,
    );
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "text/json",
  });
  saveAs(blob, "cancer-distribution-data.json");
};
