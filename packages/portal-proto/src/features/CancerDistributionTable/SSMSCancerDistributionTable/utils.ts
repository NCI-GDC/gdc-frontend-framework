import { downloadTSV } from "@/components/Table/utils";
import { getFormattedTimestamp } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import saveAs from "file-saver";
import { CancerDistributionSSMType } from "../types";

export const handleTSVDownloadSSM = (
  cancerDistributionTableDownloadData: CancerDistributionSSMType[],
  columns: ColumnDef<CancerDistributionSSMType>[],
): void => {
  downloadTSV({
    fileName: `cancer-distribution-table.${getFormattedTimestamp()}.tsv`,
    tableData: cancerDistributionTableDownloadData,
    columns: columns,
    option: {
      overwrite: {
        "#_ssm_affected_cases": {
          composer: (cancerDistributionData: CancerDistributionSSMType) =>
            `${cancerDistributionData.ssm_affected_cases.numerator || 0} / ${
              cancerDistributionData.ssm_affected_cases.denominator || 0
            } (${cancerDistributionData.ssm_affected_cases_percent.toFixed(
              2,
            )} %)`,
        },
      },
    },
  });
};

export const handleJSONDownloadSSM = (
  cancerDistributionTableDownloadData: CancerDistributionSSMType[],
): void => {
  const json = cancerDistributionTableDownloadData
    .map(
      ({
        project,
        disease_type,
        primary_site,
        ssm_affected_cases_percent,
        ssm_affected_cases,
      }) => {
        return {
          project_id: project,
          disease_type,
          site: primary_site,
          num_affected_cases: ssm_affected_cases.numerator,
          num_affected_cases_total: ssm_affected_cases.denominator,
          affected_cases_percent: ssm_affected_cases_percent,
        };
      },
    )
    .sort((a, b) => b.affected_cases_percent - a.affected_cases_percent);
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "text/json",
  });
  saveAs(blob, "cancer-distribution-data.json");
};
