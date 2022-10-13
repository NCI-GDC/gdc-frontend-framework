import { useSsmsTable } from "@gff/core";
import { useState } from "react";
import { SomaticMutation } from "./types";
import { SomaticMutationsTable } from "./SomaticMutationsTable";
import { useMeasure } from "react-use";
import { Loader } from "@mantine/core";
import PageStepper from "../shared/PageStepper";
import PageSize from "../shared/PageSize";
import { TableControls } from "../shared/TableControls";

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
  const [smTotal, setSMTotal] = useState(0);

  const { data, isFetching } = useSsmsTable({
    pageSize: pageSize,
    offset: pageSize * page,
    sorts: sorts,
  });

  const handleMutationSave = (mutation: SomaticMutation) =>
    console.log("mutation", mutation);

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
      <div className={`flex flex-row absolute w-80`}>
        <TableControls
          numSelected={Object.keys(selectedMutations).length || 0}
          handleSave={handleMutationSave}
          label={`Mutations`}
          options={[
            { label: "Save/Edit Mutation Set", value: "placeholder" },
            { label: "Save as new mutation set", value: "save" },
            { label: "Add existing mutation set", value: "add" },
            { label: "Remove from existing mutation set", value: "remove" },
          ]}
        />
      </div>
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
            handleSMTotal={setSMTotal}
          />
        </div>
      ) : (
        <div className={`flex flex-row h-screen w-[1000px]`}>
          <div className={`m-auto h-9/12`}>
            <Loader />
          </div>
        </div>
      )}
      <div className={`flex flex-row w-9/12 ml-2 m-auto mb-2`}>
        <div className="m-auto ml-0">
          <span className="my-auto mx-1 text-xs">Show</span>
          <PageSize pageSize={pageSize} handlePageSize={setPageSize} />
          <span className="my-auto mx-1 text-xs">Entries</span>
        </div>
        <div className={`m-auto text-sm`}>
          <span>
            Showing
            <span className={`font-bold`}>{` ${page * pageSize + 1} `}</span>-
            <span className={`font-bold`}>{` ${(page + 1) * pageSize} `}</span>
            of
            <span className={`font-bold`}>{` ${smTotal} `}</span>
            mutations
          </span>
        </div>
        <div className={`m-auto mr-0`}>
          <PageStepper
            page={page}
            totalPages={Math.ceil(smTotal / pageSize)}
            handlePage={setPage}
          />
        </div>
      </div>
    </>
  );
};

export default SMTableContainer;
