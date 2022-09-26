import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  SyntheticEvent,
} from "react";
import {
  useSpring,
  animated,
  config,
  easings,
  SpringValue,
  SpringRef,
  SpringContext,
} from "react-spring";
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
  spring,
}: GenesTableProps) => {
  const [expandedProxy, setExpandedProxy] = useState<ExpandedState>({});
  const [expanded, setExpanded] = useState<any>({});
  const [expandedId, setExpandedId] = useState<number>(undefined);
  const [selectedGenes, setSelectedGenes] = useState<any>({}); // todo: add type
  const [search, setSearch] = useState("");
  const [columnListOrder, setColumnListOrder] = useState<string[]>([]);
  const [showColumnMenu, setShowColumnMenu] = useState<boolean>(false);
  const [subRowListLength, setSubRowListLength] = useState<number>(0);
  // const [spring, setSpring] = useState(undefined);

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

  const transformResponse = useGeneTableFormat(initialData);

  const handleExpandedProxy = (exp: ExpandedState) => {
    setExpandedProxy(exp);
  };
  // `exp` is non-mutable within the lexical scope of handleExpandedProxy
  //  console logging `exp` returns a function (???)
  //  this effect hook is a workaround that updates expanded wrt expandedProxy
  useEffect(() => {
    const proxy = Object.keys(expandedProxy);
    const exp = Object.keys(expanded);
    // before: no rows expanded, after: 1 row expanded
    if (proxy.length === 1 && exp.length === 0) {
      setExpandedId(Number(proxy[0]));
      setExpanded(expandedProxy);
    }
    // before: 1 row expanded, after: none expanded
    if (proxy.length === 0) {
      setExpandedId(undefined);
      setExpanded({});
    }
    // before: 1 row expanded, after: new row expanded, initial row unexpanded
    if (proxy.length === 2) {
      const subsequentExpandId = Number(
        proxy.filter((key) => Number(key) !== expandedId)[0],
      );
      setExpandedId(subsequentExpandId);
      setExpanded({ [subsequentExpandId]: true });
      setExpandedProxy({ [subsequentExpandId]: true }); // this line used for rerender
    }
  }, [expandedProxy]);

  // todo replace this callback w/ transformResponse inside rtk endpoint call
  // useEffect(() => {
  //   const mainSpring = useSpring({
  //   from: {
  //     height: 30,
  //     width: 10,
  //     opacity: 0,
  //   },
  //   to: {
  //     height: 650,
  //     width: 10,
  //     opacity: 1,
  //   }
  // });
  //   setSpring(mainSpring);
  // }, [width]);

  const sizeMapPOC = {
    somegeneId: 650,
  };

  const getSubrowHeight = (width, height, geneId) => {
    return sizeMapPOC[geneId];
  };

  const columns = React.useMemo<ColumnDef<GenesColumns>[]>(() => {
    //   const newSpring = useSpring({from: {
    //     height: 30,
    //     width: 10,
    //     opacity: 0,
    //   },
    //   to: {
    //     height: getSubrowHeight(width, height, "somegeneId"),
    //     width: 10,
    //     opacity: 1,
    //   }
    // });
    return Object.keys(transformResponse[0])
      .filter((tr) => tr !== "subRows")
      .map((accessor) => {
        // define Spring here with knowledge of ratio between
        // const mySpring = useSpring({});
        return createTableColumn(
          accessor,
          spring,
          width,
          height,
          "name", // replace string with columnListOrder[0]
        );
      });
  }, [transformResponse, expanded]);

  // when columnOrder updates, update memoized columns
  // type of updates: toggle visibility off/on or swap order

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const handleRowSelect = (rowUpdate) => {
    // abstract obj add&delete
    //setSelectedGenes(rowUpdate)
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
          handleExpandedProxy={handleExpandedProxy}
          handleRowSelect={handleRowSelect}
        />
      </div>

      {/* <Pagination /> */}
    </div>
  );
};
