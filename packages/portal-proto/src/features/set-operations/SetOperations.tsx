import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { SetOperationsProps } from "./types";
import { SetOperationsSummaryTable } from "./SetOperationsSummaryTable";
import { SetOperationTable } from "./SetOperationTable";
import { LoadingOverlay } from "@mantine/core";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";

const VennDiagram = dynamic(() => import("../charts/VennDiagram"), {
  ssr: false,
});

export const SetOperations: React.FC<SetOperationsProps> = ({
  sets,
  entityType,
  data,
  queryHook,
  countHook,
  isLoading,
}: SetOperationsProps) => {
  const isDemoMode = useIsDemoApp();
  const [selectedSets, setSelectedSets] = useState(
    Object.fromEntries(data.map((set) => [set.key, false])),
  );

  const chartData = useDeepCompareMemo(
    () =>
      data.map((set) => ({
        key: set.key,
        value: isLoading ? "..." : set.value,
        highlighted: selectedSets[set.key],
      })),
    [data, isLoading, selectedSets],
  );

  const onClickHandler = useDeepCompareCallback(
    (clickedKey: string) => {
      setSelectedSets({
        ...selectedSets,
        [clickedKey]: !selectedSets[clickedKey],
      });
    },
    [selectedSets],
  );

  return (
    <div className="flex flex-col p-2">
      <div>
        {isDemoMode && (
          <p>
            Demo showing high impact mutations overlap in Bladder between
            Mutect, Varscan and Muse pipelines.
          </p>
        )}
      </div>
      <div className="flex flex-row pt-2">
        <div className="relative">
          <LoadingOverlay visible={isLoading} />
          <VennDiagram
            labels={["S₁", "S₂", "S₃"]}
            ariaLabel="The Venn diagram displays the intersections, unions, or differences in the cohorts or sets. Additional information can be found in the Summary Table and the Overlap Table."
            chartData={chartData}
            onClickHandler={onClickHandler}
          />
        </div>
        <div className="w-full ml-2 mt-2 mb-4 relative">
          <SetOperationsSummaryTable
            sets={sets}
            countHook={countHook}
            entityType={entityType}
          />
          <div className="m-8" />
          <SetOperationTable
            data={data}
            selectedSets={selectedSets}
            setSelectedSets={setSelectedSets}
            queryHook={queryHook}
            entityType={entityType}
            sets={sets}
          />
        </div>
      </div>
    </div>
  );
};
