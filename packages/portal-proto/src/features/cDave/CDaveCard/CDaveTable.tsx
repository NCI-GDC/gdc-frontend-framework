import { ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import { MdTrendingDown as SurvivalChartIcon } from "react-icons/md";
import { SURVIVAL_PLOT_MIN_COUNT } from "../constants";
import { SelectedFacet } from "../types";
import { formatPercent } from "../utils";

interface CDaveTableProps {
  readonly fieldName: string;
  readonly displayedData: Record<string, number>;
  readonly yTotal: number;
  readonly hasCustomBins: boolean;
  readonly survival: boolean;
  readonly selectedSurvivalPlots: string[];
  readonly setSelectedSurvivalPlots: (field: string[]) => void;
  readonly selectedFacets: SelectedFacet[];
  readonly setSelectedFacets: (facets: SelectedFacet[]) => void;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  displayedData,
  yTotal,
  hasCustomBins = false,
  survival,
  selectedSurvivalPlots,
  setSelectedSurvivalPlots,
  selectedFacets,
  setSelectedFacets,
}: CDaveTableProps) => {
  const rowSelectId = `row_select_${fieldName.replaceAll(" ", "_")}`; // define row select id for aria-labelledby
  return (
    <div className="h-44 block overflow-auto w-full relative border-base-light border-1">
      <table
        data-testid="table-card"
        className="border-separate border-spacing-0 w-full text-left text-base-contrast-min mb-2 table-auto"
      >
        <thead className="bg-base-max font-heading text-sm text-base-contrast-max z-10">
          <tr>
            <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1">
              <span className="pl-2" id={rowSelectId}>
                Select
              </span>
            </th>
            {survival && (
              <th className="pl-2 bg-base-max sticky top-0 border-b-4 border-max border-t-1 z-10">
                <Tooltip
                  label="Change the survival plot display"
                  withArrow
                  withinPortal={true}
                >
                  <span>Survival</span>
                </Tooltip>
              </th>
            )}
            <th className="pl-2 bg-base-max sticky top-0 border-b-4 border-max border-t-1 z-10">
              {fieldName} {hasCustomBins && "(User Defined Bins Applied)"}
            </th>
            <th className="text-right pr-4 bg-base-max sticky top-0 border-b-4 border-t-1 border-max z-10">
              # Cases
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(displayedData).map(([key, count], idx) => {
            const survivalSelected = selectedSurvivalPlots.includes(key);
            const enoughCasesForSurvival = count >= SURVIVAL_PLOT_MIN_COUNT;
            const survivalDisabled =
              (!survivalSelected && selectedSurvivalPlots.length === 5) ||
              !enoughCasesForSurvival ||
              key === "missing";

            return (
              <tr
                className={`text-content text-sm font-content ${
                  idx % 2
                    ? "bg-base-lightest text-base-contrast-lightest"
                    : "bg-base-max text-base-contrast-max"
                }`}
                key={`${fieldName}-${key}`}
              >
                <td className="pl-2 py-1">
                  <Checkbox
                    color="accent"
                    size="xs"
                    className="pt-1"
                    aria-labelledby={rowSelectId}
                    checked={selectedFacets
                      .map((facet) => facet.value)
                      .includes(key)}
                    onChange={() =>
                      setSelectedFacets(
                        selectedFacets.map((facet) => facet.value).includes(key)
                          ? selectedFacets.filter(
                              (facet) => facet.value !== key,
                            )
                          : [
                              ...selectedFacets,
                              { value: key, numCases: count },
                            ],
                      )
                    }
                  />
                </td>

                {survival && (
                  <td>
                    <Tooltip
                      label={
                        key === "missing"
                          ? `Plot cannot be generated for this value`
                          : !enoughCasesForSurvival
                          ? "Not enough data"
                          : survivalSelected
                          ? `Remove ${key} from plot`
                          : selectedSurvivalPlots.length === 5
                          ? `A maximum of 5 plots can be displayed at a time`
                          : `Plot ${key}`
                      }
                      withArrow
                      withinPortal={true}
                    >
                      <div>
                        <ActionIcon
                          variant="outline"
                          className={
                            survivalDisabled
                              ? "bg-base-light text-base-contrast-light bg-opacity-80 text-opacity-60"
                              : survivalSelected
                              ? `bg-gdc-survival-${selectedSurvivalPlots.indexOf(
                                  key,
                                )} text-white` // TODO: confirm 508 contrast compliance
                              : "bg-base-lightest text-base-contrast-lightest"
                          }
                          disabled={survivalDisabled}
                          onClick={() =>
                            survivalSelected
                              ? setSelectedSurvivalPlots(
                                  selectedSurvivalPlots.filter(
                                    (s) => s !== key,
                                  ),
                                )
                              : setSelectedSurvivalPlots([
                                  ...selectedSurvivalPlots,
                                  key,
                                ])
                          }
                        >
                          <SurvivalChartIcon />
                        </ActionIcon>
                      </div>
                    </Tooltip>
                  </td>
                )}
                <td>
                  <div className="pl-2">{key}</div>
                </td>
                <td className="text-right">
                  <div className="pr-4 whitespace-nowrap">
                    {count.toLocaleString()} ({formatPercent(count, yTotal)})
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CDaveTable;
