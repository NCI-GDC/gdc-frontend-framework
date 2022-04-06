import { Paper } from "@mantine/core";
import VennDiagram from "@/features/charts/VennDiagram/VennDiagram";

interface CohortCardProps {
  selectedCards: Record<string, boolean>[];
  setSelectedCards: (cards: Record<string, boolean>[]) => void;
}

const CohortCard = ({ selectedCards, setSelectedCards }) => {
  return (
    <Paper>
      <h2>Cohort</h2>
      <VennDiagram
        chartData={[
          { key: "S1_minus_S1", value: 261, highlighted: false },
          { key: "S2_minus_S1", value: 2462, highlighted: false },
          { key: "S1_intersect_S2", value: 0, highlighted: false },
        ]}
        labels={["s1", "s2"]}
        interactable={false}
      />
      <input
        id={"cohort-comparison-survival"}
        type="checkbox"
        value={"survival"}
        onChange={() =>
          setSelectedCards({
            ...selectedCards,
            survival: !selectedCards.survival,
          })
        }
        checked={selectedCards.survival}
      ></input>
      <label htmlFor="cohort-comparison-survival">Survival</label>
    </Paper>
  );
};

export default CohortCard;
