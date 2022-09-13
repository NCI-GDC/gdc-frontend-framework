import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  SyntheticEvent,
} from "react";
import { useSpring, animated, config, easings } from "react-spring";
import { Gene, GeneSubRow, GenesTableProps } from "./types";
import { ExpandedState, ColumnDef } from "@tanstack/react-table";
import { ExpTable } from "../shared/ExpTable";
import { GTableControls } from "./GTableControls";
import { GTableFilters } from "./GTableFilters";
import { getGene, createTableColumn } from "./genesTableUtils";
import { GenesColumns } from "@/features/shared/table-utils";

export const GenesTable: React.VFC<GenesTableProps> = ({
  initialData,
  mutationCounts,
  filteredCases,
  cases,
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  width,
  height,
}: GenesTableProps) => {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [search, setSearch] = useState("");
  const [columnListOrder, setColumnListOrder] = useState<string[]>([]);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [subRowListLength, setSubRowListLength] = useState<number>(0);

  const useGeneTableFormat = useCallback(
    (initialData) => {
      return initialData.genes.map((g) => {
        return getGene(
          g,
          selectedSurvivalPlot,
          mutationCounts,
          filteredCases,
          cases,
        );
      });
    },
    [selectedSurvivalPlot],
  );

  useEffect(() => {
    console.log("wasgood width", width);
  }, [width]);

  const transformResponse = useGeneTableFormat(initialData);

  const verticalSpring = useSpring({
    from: {
      height: 30,
      width: 10,
      opacity: 0,
    },
    to: {
      height: subRowListLength === 0 ? 650 : subRowListLength * 9.1,
      width: 10,
      opacity: 1,
    },
    config: config.slow,
    // config: {
    //   mass: 2,
    //   tension: 200,
    //   friction: 5,
    //   duration: 2000,
    //   easing: easings.easeInOutQuart,
    // },
  });

  // todo replace this callback w/ transformResponse inside rtk endpoint call

  const columns = React.useMemo<ColumnDef<GenesColumns>[]>(
    () =>
      Object.keys(transformResponse[0])
        .filter((tr) => tr !== "subRows")
        .map((accessor) => {
          return createTableColumn(
            accessor,
            verticalSpring,
            width,
            expanded,
            height,
          );
        }),
    [transformResponse, expanded],
  );

  useEffect(() => {
    console.log("columns changed", columns);
  }, [columns]);

  useEffect(() => {
    console.log("what does transformedRes look like", transformResponse);
  }, [transformResponse]);
  // when columnOrder updates, update memoized columns
  // type of updates: toggle visibility off/on or swap order

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleRowSelect = (rowUpdate) => {
    // abstract obj add&delete
    //setSelectedGenes(rowUpdate)
  };

  const handleExpanded = (expanded: ExpandedState) => {
    console.log("expanded", expanded);
    // onclick: setExpanded(exp)
    // console.log('event.target', event.target);
    // console.log('before', expanded);
    // console.log('previous key', Object.keys(expanded));
    // if (expanded === {}) {
    //     console.log('expanded is empty for now')
    // }
    // if (expanded !== {}) {
    //     console.log('expanded isnt empty')
    // }
    // console.log('expfunc', exp);
    // console.log(typeof exp);
    setExpanded(expanded);
    // pageSize, sort change: do nothing
    // page change, search filter: reset/setExpanded({})
    // console.log("exp state", exp);
  };

  const handleGeneSave = (gene: Gene) => {
    console.log("gene", gene);
  };

  const handleColumnChange = (colUpdate: any) => {
    console.log("colupdate", colUpdate);
  };

  return (
    <div>
      <div className={`flex flex-row justify-between`}>
        <GTableControls
          selectedGenes={selectedGenes}
          handleGeneSave={handleGeneSave}
        />
        <GTableFilters
          search={search}
          handleSearch={handleSearch}
          columnListOrder={columnListOrder}
          handleColumnChange={handleColumnChange}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
        />
      </div>
      <div className={`flex flex-row`}>
        <ExpTable
          data={transformResponse}
          columns={columns}
          expanded={expanded}
          handleExpanded={handleExpanded}
          handleRowSelect={handleRowSelect}
        />
      </div>

      {/* <Pagination /> */}
    </div>
  );
};
