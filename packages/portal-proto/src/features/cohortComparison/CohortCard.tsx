import { Paper } from "@mantine/core";
import { FIELD_LABELS } from "src/fields";
import CohortVennDiagram from "./CohortVennDiagram";
import Link from "next/link";
import { CohortComparisonType } from "./CohortComparison";

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
        <div
          data-testid="text-first-cohort-cohort-comparison"
          className="flex justify-between font-content py-1"
        >
          <p
            data-testid="text-cohort-name-cohort-comparison"
            className="text-[#1F77B4] basis-3/4"
          >
            S<sub>1</sub> : {cohorts?.primary_cohort.name}
          </p>
          <p
            data-testid="text-cohort-case-count-cohort-comparison"
            className="basis-1/4 text-right"
          >
            {casesFetching || counts.length === 0
              ? "..."
              : counts[0]
              ? counts[0].toLocaleString()
              : 0}
          </p>
        </div>
        <div
          data-testid="text-second-cohort-cohort-comparison"
          className="flex justify-between font-content py-1"
        >
          <p
            data-testid="text-cohort-name-cohort-comparison"
            className="text-[#BD5800] basis-3/4"
          >
            S<sub>2</sub> : {cohorts?.comparison_cohort.name}
          </p>
          <p
            data-testid="text-cohort-case-count-cohort-comparison"
            className="basis-1/4 text-right"
          >
            {casesFetching || counts.length === 0
              ? "..."
              : counts[1]
              ? counts[1].toLocaleString()
              : 0}
          </p>
        </div>
      </div>
      <hr />

      <CohortVennDiagram
        caseSetIds={caseSetIds}
        cohorts={cohorts}
        isLoading={casesFetching || counts.length === 0}
      />

      <div className="-mt-8 mb-2 z-10 flex justify-center relative">
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
          data-testid="link-open-venn-diagram"
          className="underline text-primary font-bold"
          aria-label="View Venn diagram in Set Operations. Note: you will be directed to the Set Operations tool. Close the tool to return to the Analysis Center if you wish to use Cohort Comparison."
        >
          View Venn diagram in Set Operations
        </Link>
      </div>
      <hr />

      {Object.entries(options).map(([value, field]) => (
        <div key={value}>
          <input
            data-testid={`button-enable-${value}-cohort-comparison`}
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
