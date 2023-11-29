import { processFilters } from "@/utils/index";
import { GeneCancerDistributionTableProps } from "./utils";
import { useGetGeneCancerDistributionTableQuery } from "@gff/core";
import CancerDistributionTable from "./CancerDistributionTable";

const GeneCancerDistributionTable: React.FC<
  GeneCancerDistributionTableProps
> = ({
  gene,
  symbol,
  genomicFilters = undefined,
  cohortFilters = undefined,
}: GeneCancerDistributionTableProps) => {
  const contextFilters = processFilters(genomicFilters, cohortFilters);

  const { data, isFetching, isError, isSuccess } =
    useGetGeneCancerDistributionTableQuery({ gene, contextFilters });
  return (
    <CancerDistributionTable
      data={data}
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
      symbol={symbol}
      id={gene}
      genomicFilters={genomicFilters}
      cohortFilters={cohortFilters}
      isGene
    />
  );
};

export default GeneCancerDistributionTable;
