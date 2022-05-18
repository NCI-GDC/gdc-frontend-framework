import dynamic from "next/dynamic";
import { Paper } from "@mantine/core";
import { FIELD_LABELS } from "src/fields";
import CohortVennDiagram from "./CohortVennDiagram";
const VennDiagram = dynamic(() => import("@/features/charts/VennDiagram"), {
  ssr: false,
});

interface CohortCardProps {
  readonly selectedCards: Record<string, boolean>;
  readonly setSelectedCards: (cards: Record<string, boolean>) => void;
  readonly counts: number[];
  readonly options: Record<string, string>;
  readonly cohortNames: string[];
  readonly survivalPlotSelectable: boolean;
  readonly caseIds: string[][];
  readonly casesFetching: boolean;
}

const CohortCard: React.FC<CohortCardProps> = ({
  selectedCards,
  setSelectedCards,
  options,
  counts,
  cohortNames,
  survivalPlotSelectable,
  caseIds,
  casesFetching,
}: CohortCardProps) => {
  return (
    <Paper p="md" className="h-fit">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cohort</h2>
          <p className="py-1 text-[#1F77B4] font-semibold">
            S<sub>1</sub> : {cohortNames[0]}
          </p>
          <p className="py-1 text-[#BD5800] font-semibold">
            S<sub>2</sub> : {cohortNames[1]}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold"># Cases</h2>
          <p className="py-1 ">{counts[0] ? counts[0].toLocaleString() : 0}</p>
          <p className="py-1">{counts[1] ? counts[1].toLocaleString() : 0}</p>
        </div>
      </div>
      <hr />
      {!casesFetching && caseIds.length !== 0 ? (
        <CohortVennDiagram caseIds={caseIds} cohortNames={cohortNames} />
      ) : (
        <VennDiagram
          chartData={[
            { key: "S1_minus_S1", value: 0, highlighted: false },
            { key: "S2_minus_S1", value: 0, highlighted: false },
            { key: "S1_intersect_S2", value: 0, highlighted: false },
          ]}
          labels={["S<sub>1</sub>", "S<sub>2</sub>"]}
          interactable={false}
        />
      )}
      <hr />
      {Object.entries(options).map(([value, field]) => (
        <div key={value}>
          <input
            id={`cohort-comparison-${value}`}
            className={"disabled:bg-nci-gray hover:disabled:bg-nci-gray"}
            type="checkbox"
            value={value}
            onChange={() =>
              setSelectedCards({
                ...selectedCards,
                [value]: !selectedCards[value],
              })
            }
            checked={selectedCards[value]}
            disabled={value === "survival" && !survivalPlotSelectable}
          ></input>
          <label className="pl-1" htmlFor={`cohort-comparison-${value}`}>
            {value === "survival" ? field : FIELD_LABELS[field]}
          </label>
        </div>
      ))}
    </Paper>
  );
};

export default CohortCard;
