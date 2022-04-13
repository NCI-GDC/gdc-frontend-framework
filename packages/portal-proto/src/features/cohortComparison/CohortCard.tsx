import { Paper } from "@mantine/core";
import VennDiagram from "@/features/charts/VennDiagram/VennDiagram";
import { FIELD_LABELS } from "src/fields";

interface CohortCardProps {
  selectedCards: Record<string, boolean>;
  setSelectedCards: (cards: Record<string, boolean>) => void;
  counts: number[];
  options: Record<string, string>;
  cohortNames: string[];
}

const CohortCard: React.FC<CohortCardProps> = ({
  selectedCards,
  setSelectedCards,
  options,
  counts,
  cohortNames,
}: CohortCardProps) => {
  return (
    <Paper p="md" className="h-fit">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cohort</h2>
          <p className="py-1 text-nci-yellow-darkest font-semibold">
            S<sub>1</sub> : {cohortNames[0]}
          </p>
          <p className="py-1 text-nci-blue font-semibold">
            S<sub>2</sub> : {cohortNames[1]}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold"># Cases</h2>
          <p className="py-1 ">{counts[0]}</p>
          <p className="py-1">{counts[1]}</p>
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
      {Object.entries(options).map(([value, field]) => (
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
            {FIELD_LABELS[field]}
          </label>
        </div>
      ))}
    </Paper>
  );
};

export default CohortCard;
