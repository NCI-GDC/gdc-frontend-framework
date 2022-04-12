import { Paper } from "@mantine/core";
import {
  useCoreSelector,
  selectCohortCounts,
  selectCurrentCohort,
} from "@gff/core";
import VennDiagram from "@/features/charts/VennDiagram/VennDiagram";

interface CohortCardProps {
  selectedCards: Record<string, boolean>[];
  setSelectedCards: (cards: Record<string, boolean>[]) => void;
}

const CohortCard = ({ selectedCards, setSelectedCards, options, counts }) => {
  const cohortCount = useCoreSelector((state) => selectCohortCounts(state));
  const cohortName = useCoreSelector((state) => selectCurrentCohort(state));

  return (
    <Paper p="md" className="h-fit">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cohort</h2>
          {cohortName}
        </div>
        <div>
          <h2 className="text-lg font-semibold"># Cases</h2>
          {cohortCount.caseCounts}
        </div>
      </div>
      <hr />
      <VennDiagram
        chartData={[
          { key: "S1_minus_S1", value: counts?.[0] || 0, highlighted: false },
          { key: "S2_minus_S1", value: counts?.[1] || 0, highlighted: false },
          { key: "S1_intersect_S2", value: 0, highlighted: false },
        ]}
        labels={["S<sub>1</sub>", "S<sub>2</sub>"]}
        interactable={false}
      />
      <hr />
      {Object.entries(options).map(([value, label]) => (
        <div key={value}>
          <input
            id={`cohort-comparison-${value}`}
            type="checkbox"
            value={value}
            onChange={() =>
              setSelectedCards({
                ...selectedCards,
                [value]: !selectedCards[value],
              })
            }
            checked={selectedCards[value]}
          ></input>
          <label className="pl-1" htmlFor={`cohort-comparison-${value}`}>
            {label}
          </label>
        </div>
      ))}
    </Paper>
  );
};

export default CohortCard;
