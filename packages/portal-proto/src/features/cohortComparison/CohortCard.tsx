import dynamic from "next/dynamic";
import { Paper } from "@mantine/core";
import { FIELD_LABELS } from "src/fields";
import CohortVennDiagram from "./CohortVennDiagram";
import Link from "next/link";
import { CohortComparisonType } from "./CohortComparison";
const VennDiagram = dynamic(() => import("@/features/charts/VennDiagram"), {
  ssr: false,
});

interface CohortCardProps {
  readonly selectedCards: Record<string, boolean>;
  readonly setSelectedCards: (cards: Record<string, boolean>) => void;
  readonly counts: number[];
  readonly options: Record<string, string>;
  readonly cohorts: CohortComparisonType;
  readonly survivalPlotSelectable: boolean;
  readonly caseSetIds: string[];
  readonly casesFetching: boolean;
}

const CohortCard: React.FC<CohortCardProps> = ({
  selectedCards,
  setSelectedCards,
  options,
  counts,
  cohorts,
  survivalPlotSelectable,
  caseSetIds,
  casesFetching,
}: CohortCardProps) => {
  return (
    <Paper p="md" className="h-fit">
      <div className="font-semibold">
        <div className="flex justify-between font-heading text-lg py-1">
          <h2 className="basis-3/4">Cohort</h2>
          <h2 className="basis-1/4 text-right"># Cases</h2>
        </div>
        <div className="flex justify-between font-content py-1">
          <p className="text-[#1F77B4] basis-3/4">
            S<sub>1</sub> : {cohorts?.primary_cohort.name}
          </p>
          <p className="basis-1/4 text-right">
            {casesFetching ? "..." : counts[0] ? counts[0].toLocaleString() : 0}
          </p>
        </div>
        <div className="flex justify-between font-content py-1">
          <p className="text-[#BD5800] basis-3/4">
            S<sub>2</sub> : {cohorts?.comparison_cohort.name}
          </p>
          <p className="basis-1/4 text-right">
            {casesFetching ? "..." : counts[1] ? counts[1].toLocaleString() : 0}
          </p>
        </div>
      </div>
      <hr />
      <div className="mt-2 flex justify-center">
        <Link
          href={{
            pathname: "/analysis_page",
            query: {
              app: "SetOperations",
              skipSelectionScreen: "true",
              cohort1Id: cohorts.primary_cohort.id,
              cohort2Id: cohorts.comparison_cohort.id,
            },
          }}
          passHref
        >
          <a className="underline text-primary font-bold">Open Venn diagram</a>
        </Link>
      </div>

      {!casesFetching && caseSetIds.length !== 0 ? (
        <CohortVennDiagram caseSetIds={caseSetIds} cohorts={cohorts} />
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
            className="disabled:bg-base hover:disabled:bg-base"
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
          <label
            className="font-heading pl-1"
            htmlFor={`cohort-comparison-${value}`}
          >
            {value === "survival" ? field : FIELD_LABELS[field]}
          </label>
        </div>
      ))}
    </Paper>
  );
};

export default CohortCard;
