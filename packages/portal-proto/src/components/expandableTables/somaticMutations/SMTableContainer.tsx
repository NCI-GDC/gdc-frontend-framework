import { useSsmsTable } from "@gff/core";
import { useState } from "react";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import { Loader } from "@mantine/core";

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot: Record<string, string>;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
}: SMTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [sorts, setSorts] = useState([]);
  const [ref, { width }] = useMeasure();
  const [selectedMutations, setSelectedMutations] = useState<any>({}); // todo: add type

  const { data, isFetching } = useSsmsTable({
    pageSize: pageSize,
    offset: pageSize * page,
    sorts: sorts,
  });

  const selectMutation = (row: any) => {
    const mutation = row.original["mutationID"];
    if (mutation in selectedMutations) {
      // deselect single row
      setSelectedMutations((currentMap) => {
        const newMap = { ...currentMap };
        delete newMap[mutation];
        return newMap;
      });
    } else {
      // select single row
      setSelectedMutations((currentMap) => {
        return { ...currentMap, [mutation]: row };
      });
    }
  };

  const selectAllMutations = (rows: any) => {
    if (rows.every((row) => row.original["select"] in selectedMutations)) {
      // deselect all
      setSelectedMutations((currentMap) => {
        const newMap = { ...currentMap };
        rows.forEach((row) => delete newMap[row.original["select"]]);
        return newMap;
      });
    } else {
      // select all
      setSelectedMutations((currentMap) => {
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

  const { status, ssms: initialData } = data;

  const { cases, filteredCases } = initialData;

  return (
    <>
      {status === "fulfilled" && cases && filteredCases ? (
        <div ref={ref} className={`h-full w-9/12 pb-4`}>
          <SomaticMutationsTable
            initialData={initialData}
            selectedSurvivalPlot={selectedSurvivalPlot}
            handleSurvivalPlotToggled={handleSurvivalPlotToggled}
            width={width}
            pageSize={pageSize}
            page={page}
            selectedMutations={selectedMutations}
            selectMutation={selectMutation}
            selectAll={selectAllMutations}
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

export default SMTableContainer;
