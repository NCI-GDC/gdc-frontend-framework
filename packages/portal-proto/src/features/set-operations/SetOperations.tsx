import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { SetOperationsProps } from "./types";
import { SetOperationsSummaryTable } from "./SetOperationsSummaryTable";
import { SetOperationTable } from "./SetOperationTable";

const VennDiagram = dynamic(() => import("../charts/VennDiagram"), {
  ssr: false,
});

export const SetOperations: React.FC<SetOperationsProps> = ({
  sets,
  entityType,
  data,
  queryHook,
  countHook,
}: SetOperationsProps) => {
  const isDemoMode = useIsDemoApp();
  const [selectedSets, setSelectedSets] = useState(
    Object.fromEntries(data.map((set) => [set.key, false])),
  );

  const chartData = data.map((set) => ({
    key: set.key,
    value: set.value,
    highlighted: selectedSets[set.key],
  }));

  const onClickHandler = (clickedKey: string) => {
    setSelectedSets({
      ...selectedSets,
      [clickedKey]: !selectedSets[clickedKey],
    });
  };

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
        <VennDiagram
          labels={["S<sub>1</sub>", "S<sub>2</sub>", "S<sub>3</sub>"]}
          chartData={chartData}
          onClickHandler={onClickHandler}
        />
        <div aria-hidden="true" className="w-full ml-2 mt-2 mb-4 relative">
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
