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
  const [page, setPage] = useState(0); // todo rename
  const [sorts, setSorts] = useState([]);
  const [ref, { width }] = useMeasure();
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type

  const { data, isFetching } = useGenesTable({
    pageSize: pageSize,
    offset: page * pageSize,
    // sorts: sorts,
  });

  // const { data, isLoading, isError } = useGetGenesTableQuery({
  //   filters: getGraphQLFilters(pageSize, offset),
  // });

  const selectGene = (row: any) => {
    const gene = row.original["geneID"];
    if (gene in selectedGenes) {
      // deselect single row
      setSelectedGenes((currentMap) => {
        const newMap = { ...currentMap };
        delete newMap[gene];
        return newMap;
      });
    } else {
      // select single row
      setSelectedGenes((currentMap) => {
        return { ...currentMap, [gene]: row };
      });
    }
  };

  const selectAllGenes = (rows: any) => {
    if (rows.every((row) => row.original["select"] in selectedGenes)) {
      // deselect all
      setSelectedGenes((currentMap) => {
        const newMap = { ...currentMap };
        rows.forEach((row) => delete newMap[row.original["select"]]);
        return newMap;
      });
    } else {
      // select all
      setSelectedGenes((currentMap) => {
        const newMap = { ...currentMap };
        rows.forEach((row) => {
          if (
            !row.id.includes(".") &&
            !(row.original["select"] in currentMap)
          ) {
            newMap[row.original["select"]] = row;
          }
        });
        return newMap;
      });
    }
  };

  return (
    <>
      {data?.status === "fulfilled" &&
      data?.genes?.mutationCounts &&
      data?.genes?.filteredCases &&
      data?.genes?.cases ? (
        <div ref={ref} className={`h-full w-9/12 pb-4`}>
          <GenesTable
            initialData={data.genes}
            selectedSurvivalPlot={selectedSurvivalPlot}
            handleSurvivalPlotToggled={handleSurvivalPlotToggled}
            width={width}
            pageSize={pageSize}
            page={page}
            selectedGenes={selectedGenes}
            selectGene={selectGene}
            selectAll={selectAllGenes}
            handlePageSize={setPageSize}
            handlePage={setPage}
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
