import { useGetCancerDistributionTableQuery, useProjects } from "@gff/core";

interface CancerDistributionTableProps {
  readonly gene: string;
}

const CancerDistributionTable: React.FC<CancerDistributionTableProps> = ({
  gene,
}: CancerDistributionTableProps) => {
  const { data } = useGetCancerDistributionTableQuery({ gene });
  const { data: projects } = useProjects();

  return <></>;
};

export default CancerDistributionTable;
