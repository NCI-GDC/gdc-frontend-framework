import { Switch } from "@mantine/core";
import { FIELD_LABELS } from "@/utils/fields";
import CohortVennDiagram from "../CohortVennDiagram";
import Link from "next/link";
import { CohortComparisonType } from "../CohortComparison";
import tailwindConfig from "tailwind.config";
import CohortTable from "./CohortTable";

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
    <div className="flex flex-col gap-y-4">
      <div className="border-1 border-base-lighter p-4">
        <CohortTable
          cohorts={cohorts}
          counts={counts}
          casesFetching={casesFetching}
        />

        <CohortVennDiagram
          caseSetIds={caseSetIds}
          cohorts={cohorts}
          isLoading={casesFetching || counts.length === 0}
        />

        <div className="text-center">
          <Link
            href={{
              pathname: "/analysis_page",
              query: {
                app: "SetOperationsApp",
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
      </div>

      <div>
        <div className="py-3 pl-2 bg-primary-darkest text-base-max font-bold text-[1rem]">
          Customize Properties Display
        </div>
        <ul className="border-1 border-base-lighter rounded-b px-2">
          {Object.entries(options).map(([value, field]) => (
            <li key={value}>
              <Switch
                data-testid={`button-enable-${value}-cohort-comparison`}
                id={`cohort-comparison-${value}`}
                labelPosition="left"
                color={tailwindConfig.theme.extend.colors["nci-orange"].DEFAULT}
                classNames={{
                  root: "py-1",
                  body: "flex justify-between items-center",
                  label:
                    "cursor-pointer text-sm text-black font-content font-medium",
                  track: `cursor-pointer hover:bg-nci-orange-darker`,
                }}
                checked={selectedCards[value]}
                onChange={(e) =>
                  setSelectedCards({
                    ...selectedCards,
                    [value]: e.currentTarget.checked,
                  })
                }
                disabled={value === "survival" && !survivalPlotSelectable}
                label={value === "survival" ? field : FIELD_LABELS[field]}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CohortCard;
