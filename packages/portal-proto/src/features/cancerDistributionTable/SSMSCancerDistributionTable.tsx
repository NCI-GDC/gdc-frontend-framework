import { useGetSSMSCancerDistributionTableQuery } from "@gff/core";
import { SSMSCancerDistributionTableProps } from "./utils";
import CancerDistributionTable from "./CancerDistributionTable";

const SSMSCancerDistributionTable: React.FC<
  SSMSCancerDistributionTableProps
> = ({ ssms, symbol }: SSMSCancerDistributionTableProps) => {
  const { data, isFetching, isError, isSuccess } =
    useGetSSMSCancerDistributionTableQuery({ ssms });
  return (
    <CancerDistributionTable
      data={data}
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
      symbol={symbol}
      id={ssms}
      isGene={false}
    />
  );
};

export default SSMSCancerDistributionTable;
