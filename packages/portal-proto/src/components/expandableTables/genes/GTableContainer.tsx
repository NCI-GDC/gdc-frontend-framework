import { useGenesTable } from "@gff/core";
import { useState } from "react";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Loader } from "@mantine/core";
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

export const GTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: GTableContainerProps) => {
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

  return (
    <>
      {data?.status === "fulfilled" &&
      data?.genes?.mutationCounts &&
      data?.genes?.filteredCases &&
      data?.genes?.cases ? (
        <div ref={ref} className={`h-full`}>
          <GenesTable
            initialData={data.genes}
            mutationCounts={data.genes.mutationCounts}
            filteredCases={data.genes.filteredCases}
            cases={data.genes.cases}
            selectedSurvivalPlot={selectedSurvivalPlot}
            handleSurvivalPlotToggled={handleSurvivalPlotToggled}
            width={width}
            pageSize={pageSize}
            offset={offset}
            handlePageSize={setPageSize}
            handleOffset={setOffset}
          />
        </div>
      ) : (
        <div className={`flex flex-row h-[500px] w-[100px] m-auto`}>
          <div className={`my-auto`}>
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};
