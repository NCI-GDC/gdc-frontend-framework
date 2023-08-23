import { downloadTSV } from "@/components/Table/utils";
import { convertDateToString } from "@/utils/date";
import { CancerDistributionTableData, FilterSet } from "@gff/core";
import { ColumnDef } from "@tanstack/react-table";
import saveAs from "file-saver";

export interface GeneCancerDistributionTableProps {
  readonly gene: string;
  readonly symbol: string;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}

export interface SSMSCancerDistributionTableProps {
  readonly ssms: string;
  readonly symbol: string;
}

export interface CancerDistributionTableProps {
  readonly data: CancerDistributionTableData;
  readonly isFetching: boolean;
  readonly isError: boolean;
  readonly isSuccess: boolean;
  readonly symbol: string;
  readonly id: string;
  readonly isGene: boolean;
  readonly contextFilters?: FilterSet;
}

export type CancerDistributionDataType = {
  cnv_gains?: {
    numerator: number;
    denominator: number;
  };
  cnv_gains_percent?: number;
  cnv_loss?: {
    numerator: number;
    denominator: number;
  };
  cnv_loss_percent?: number;
  num_mutations?: number;
  project: string;
  disease_type: string[];
  primary_site: string[];
  ssm_affected_cases: {
    numerator: number;
    denominator: number;
  };
  ssm_percent: number;
};

export interface CreateSSMCohortParams {
  project: string;
  id: string;
  gene?: string;
  filter?: "Loss" | "Gain";
  mode: "CNV" | "SSM";
}

export const handleTSVDownload = (
  cancerDistributionTableDownloadData: CancerDistributionDataType[],
  columns: ColumnDef<CancerDistributionDataType>[],
  isGene: boolean,
): void => {
  downloadTSV({
    fileName: `cancer-distribution-table.${convertDateToString(
      new Date(),
    )}.tsv`,
    tableData: cancerDistributionTableDownloadData,
    columns: columns,
    option: {
      overwrite: {
        "#_ssm_affected_cases": {
          composer: (cancerDistributionData: CancerDistributionDataType) =>
            `${cancerDistributionData.ssm_affected_cases.numerator || 0} /  ${
              cancerDistributionData.ssm_affected_cases.denominator || 0
            } (${cancerDistributionData.ssm_percent.toFixed(2)} %)`,
        },
        ...(isGene && {
          "#_cnv_gains": {
            composer: (cancerDistributionData: CancerDistributionDataType) =>
              `${cancerDistributionData.cnv_gains.numerator || 0} /  ${
                cancerDistributionData.cnv_gains.denominator || 0
              } (${cancerDistributionData.cnv_gains_percent.toFixed(2)} %)`,
          },
        }),
        ...(isGene && {
          "#_cnv_loss": {
            composer: (cancerDistributionData: CancerDistributionDataType) =>
              `${cancerDistributionData.cnv_loss.numerator || 0} /  ${
                cancerDistributionData.cnv_loss.denominator || 0
              } (${cancerDistributionData.cnv_loss_percent.toFixed(2)} %)`,
          },
        }),
        ...(isGene && {
          "#_mutations": {
            composer: (cancerDistributionData: CancerDistributionDataType) =>
              `${cancerDistributionData.num_mutations || 0}`,
          },
        }),
      },
    },
  });
};

export const handleJSONDownload = (
  cancerDistributionTableDownloadData: CancerDistributionDataType[],
  isGene: boolean,
): void => {
  const json = cancerDistributionTableDownloadData
    .map(
      ({
        project,
        disease_type,
        primary_site,
        ssm_percent,
        ssm_affected_cases,
        cnv_gains,
        cnv_gains_percent,
        cnv_loss,
        cnv_loss_percent,
        num_mutations,
      }) => {
        return {
          project_id: project,
          disease_type,
          site: primary_site,
          num_affected_cases: ssm_affected_cases.numerator,
          num_affected_cases_total: ssm_affected_cases.denominator,
          num_affected_cases_percent: ssm_percent,
          ...(isGene && {
            num_cnv_gain: cnv_gains.numerator,
            num_cnv_gain_percent: cnv_gains_percent,
            num_cnv_loss: cnv_loss.numerator,
            num_cnv_loss_percent: cnv_loss_percent,
            num_cnv_cases_total: cnv_gains.denominator || cnv_loss.denominator,
            mutations_counts: num_mutations,
          }),
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
