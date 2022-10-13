import { useGenesTable } from "@gff/core";
import { Gene } from "./types";
import { useState } from "react";
import { GenesTable } from "./GenesTable";
import { useMeasure } from "react-use";
import { Loader } from "@mantine/core";
import PageStepper from "../shared/PageStepper";
import PageSize from "../shared/PageSize";
import TableControls from "../shared/TableControls";
import TableLoader from "../shared/TableLoader";

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
  const [page, setPage] = useState(0);
  const [ref, { width }] = useMeasure();
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [gTotal, setGTotal] = useState(0);

  const { data } = useGenesTable({
    pageSize: pageSize,
    offset: page * pageSize,
  });

  const handleGeneSave = (gene: Gene) => {
    console.log("gene", gene);
  };

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
      <div className={`flex flex-row absolute w-60`}>
        <TableControls
          numSelected={Object.keys(selectedGenes).length || 0}
          handleSave={handleGeneSave}
          label={`Genes`}
          options={[
            { label: "Save/Edit Gene Set", value: "placeholder" },
            { label: "Save as new gene set", value: "save" },
            { label: "Add existing gene set", value: "add" },
            { label: "Remove from existing gene set", value: "remove" },
          ]}
        />
      </div>
      {data?.status === "fulfilled" &&
      data?.genes?.mutationCounts &&
      data?.genes?.filteredCases &&
      data?.genes?.cases ? (
        <div ref={ref} className={`h-full w-9/12`}>
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
            handleGTotal={setGTotal}
          />
        </div>
      ) : (
        <TableLoader cellWidth={`w-[75px]`} rowHeight={70} />
      )}
      <div className={`flex flex-row w-9/12 ml-2 mt-0 m-auto mb-2`}>
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
            <span className={`font-bold`}>{` ${gTotal} `}</span>
            genes
          </span>
        </div>
        <div className={`m-auto mr-0`}>
          <PageStepper
            page={page}
            totalPages={Math.ceil(gTotal / pageSize)}
            handlePage={setPage}
          />
        </div>
      </div>
    </>
  );
};
