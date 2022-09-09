import { useGenesTable } from "@gff/core";
import { useState } from "react";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
// import { getGraphQLFilters } from "./types";
// import { useGetGenesTableQuery } from "@gff/core";

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

export const GTableContainer: React.VFC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: GTableContainerProps) => {
  const [filters, setFilters] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sorts, setSorts] = useState([]);
  const [ref, { width }] = useMeasure();

  const { data, isFetching } = useGenesTable({
    pageSize: pageSize,
    offset: offset,
    sorts: sorts,
  });

  // const { data, isLoading, isError } = useGetGenesTableQuery({
  //   filters: getGraphQLFilters(pageSize, offset),
  // });

  const isDataAggregated = () => {
    return (
      data?.genes?.mutationCounts &&
      data?.genes?.filteredCases &&
      data?.genes?.cases
    );
  };

  return (
    <div ref={ref} className={`w-9/12`}>
      {data?.status === "fulfilled" && isDataAggregated() && (
        <GenesTable
          initialData={data.genes}
          mutationCounts={data.genes.mutationCounts}
          filteredCases={data.genes.filteredCases}
          cases={data.genes.cases}
          // columns={[]}
          selectedSurvivalPlot={selectedSurvivalPlot}
          handleSurvivalPlotToggled={handleSurvivalPlotToggled}
        />
      )}
    </div>
  );
};
