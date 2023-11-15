import { ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import { MdTrendingDown as SurvivalChartIcon } from "react-icons/md";
import { useDeepCompareMemo } from "use-deep-compare";
import { MISSING_KEY, SURVIVAL_PLOT_MIN_COUNT } from "../constants";
import { DataDimension, DisplayData, SelectedFacet } from "../types";
import { formatPercent, useDataDimension } from "../utils";

interface CDaveTableProps {
  readonly field: string;
  readonly fieldName: string;
  readonly displayedData: DisplayData;
  readonly yTotal: number;
  readonly hasCustomBins: boolean;
  readonly survival: boolean;
  readonly selectedSurvivalPlots: string[];
  readonly setSelectedSurvivalPlots: (field: string[]) => void;
  readonly selectedFacets: SelectedFacet[];
  readonly setSelectedFacets: (facets: SelectedFacet[]) => void;
  readonly dataDimension?: DataDimension;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  field,
  fieldName,
  displayedData,
  yTotal,
  hasCustomBins = false,
  survival,
  selectedSurvivalPlots,
  setSelectedSurvivalPlots,
  selectedFacets,
  setSelectedFacets,
  dataDimension,
}: CDaveTableProps) => {
  const displayDataDimension = useDataDimension(field);

  const validData = useDeepCompareMemo(
    () => displayedData.filter(({ count }) => count > 0),
    [displayedData],
  );

  const allSelected = useDeepCompareMemo(
    () =>
      validData.length > 0 &&
      validData.every(({ key }) =>
        selectedFacets.map((facet) => facet.value).includes(key),
      ),
    [selectedFacets, validData],
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedFacets([]);
    } else {
      setSelectedFacets(
        validData.map(({ key, count }) => ({ value: key, numCases: count })),
      );
    }
  };

  return (
    <div className="h-44 block overflow-auto w-full relative border-base-light border-1">
      <table
        data-testid="table-card"
        className="border-separate border-spacing-0 w-full text-left text-base-contrast-min mb-2 table-auto"
      >
        <thead className="bg-base-max font-heading text-sm text-base-contrast-max z-10">
          <tr>
            <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1 pl-2">
              <Checkbox
                color="accent"
                size="xs"
                aria-label={`${
                  allSelected ? "Unselect" : "Select"
                } all the rows of ${fieldName} table`}
                checked={allSelected}
                onChange={toggleSelectAll}
                disabled={validData.length === 0}
              />
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
              {fieldName}
              {displayDataDimension && ` (${dataDimension})`}
              {hasCustomBins && " (User Defined Bins Applied)"}
            </th>
            <th className="text-right pr-4 bg-base-max sticky top-0 border-b-4 border-t-1 border-max z-10">
              # Cases
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map(({ key, displayName, count }, idx) => {
            const survivalSelected = selectedSurvivalPlots.includes(key);
            const enoughCasesForSurvival = count >= SURVIVAL_PLOT_MIN_COUNT;
            const survivalDisabled =
              (!survivalSelected && selectedSurvivalPlots.length === 5) ||
              !enoughCasesForSurvival ||
              key === MISSING_KEY;

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
                    aria-label={`Select ${displayName}`}
                    disabled={count === 0}
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
                        key === MISSING_KEY
                          ? `Plot cannot be generated for this value`
                          : !enoughCasesForSurvival
                          ? "Not enough data"
                          : survivalSelected
                          ? `Remove ${displayName} from plot`
                          : selectedSurvivalPlots.length === 5
                          ? `A maximum of 5 plots can be displayed at a time`
                          : `Plot ${displayName}`
                      }
                      withArrow
                    >
                      <div className="w-fit">
                        <ActionIcon
                          variant="outline"
                          className={`${
                            survivalDisabled
                              ? "bg-base-light text-base-contrast-light bg-opacity-80 text-opacity-60"
                              : survivalSelected
                              ? `bg-gdc-survival-${selectedSurvivalPlots.indexOf(
                                  key,
                                )} text-white` // TODO: confirm 508 contrast compliance
                              : "bg-base-lightest text-base-contrast-lightest"
                          } ml-2`}
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
                  <div className="pl-2">{displayName}</div>
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
