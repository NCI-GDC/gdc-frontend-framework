import { useGetCancerDistributionTableQuery, useProjects } from "@gff/core";
import { VerticalTable } from "@/features/shared/VerticalTable";

interface CancerDistributionTableProps {
  readonly gene: string;
}

const CancerDistributionTable: React.FC<CancerDistributionTableProps> = ({
  gene,
}: CancerDistributionTableProps) => {
  const { data } = useGetCancerDistributionTableQuery({ gene });
  const { data: projects } = useProjects({ size: 1000 });

  const projectsById = Object.fromEntries(
    (projects || []).map((project) => [project.project_id, project]),
  );
  const columnListOrder = [
    { id: "project", columnName: "Project", visible: true },
    { id: "disease_type", columnName: "Disease Type", visible: true },
    { id: "primary_site", columnName: "Primary Site", visible: true },
    {
      id: "ssm_affected_cases",
      columnName: "# SSM Affected Cases",
      visible: true,
    },
    { id: "cnv_gains", columnName: "# CNV Gains", visible: true },
    { id: "cnv_losses", columnName: "# CNV Losses", visible: true },
    { id: "num_mutations", columnName: "# Mutations", visible: true },
  ];

  const columnCells = [
    { Header: "Project", accessor: "project" },
    { Header: "Disease Type", accessor: "disease_type" },
    { Header: "Primary Site", accessor: "primary_site" },
    { Header: "# SSM Affected Cases", accessor: "ssm_affected_cases" },
    { Header: "# CNV Gains", accessor: "cnv_gains" },
    { Header: "# CNV Losses", accessor: "cnv_losses" },
    { Header: "# Mutations", accessor: "num_mutations" },
  ];

  const formattedData =
    data?.projects.map((d) => ({
      project: d.key,
      disease_type: projectsById[d.key]?.disease_type || [],
      primary_site: projectsById[d.key]?.primary_site || [],
      ssm_affected_cases: `${data.ssmFiltered[d.key]} / ${
        data.ssmTotal[d.key]
      } (${(data.ssmFiltered[d.key] / data.ssmTotal[d.key]).toLocaleString(
        undefined,
        { style: "percent", minimumFractionDigits: 2 },
      )})`,
      cnv_gains: `${data.cnvGain[d.key] || 0} / ${
        data.cnvTotal[d.key] || 0
      } (${(data.cnvGain[d.key] / data.cnvTotal[d.key] || 0).toLocaleString(
        undefined,
        { style: "percent", minimumFractionDigits: 2 },
      )})`,
      cnv_losses: `${data.cnvLoss[d.key] || 0} / ${
        data.cnvTotal[d.key] || 0
      } (${(data.cnvLoss[d.key] / data.cnvTotal[d.key] || 0).toLocaleString(
        undefined,
        { style: "percent", minimumFractionDigits: 2 },
      )})`,
      num_mutations: d.doc_count,
    })) || [];

  return (
    <VerticalTable
      tableData={formattedData}
      columnListOrder={columnListOrder}
      columnCells={columnCells}
      selectableRow={false}
      handleColumnChange={undefined}
      showControls={false}
    />
  );
};

export default CancerDistributionTable;
