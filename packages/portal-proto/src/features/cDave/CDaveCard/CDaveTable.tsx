import { ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import { MdTrendingDown as SurvivalChartIcon } from "react-icons/md";
import { SURVIVAL_PLOT_MIN_COUNT } from "../constants";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";
import { flattenBinnedData } from "../utils";

interface CDaveTableProps {
  readonly fieldName: string;
  readonly data: Record<string, number>;
  readonly yTotal: number;
  readonly customBinnedData: CategoricalBins | CustomInterval | NamedFromTo[];
  readonly survival: boolean;
  readonly selectedSurvivalPlots: string[];
  readonly setSelectedSurvivalPlots: (field: string[]) => void;
  readonly continuous: boolean;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  data = {},
  yTotal,
  customBinnedData = null,
  survival,
  selectedSurvivalPlots,
  setSelectedSurvivalPlots,
  continuous,
}: CDaveTableProps) => {
  return (
    <div className="h-44 block overflow-auto w-full relative">
      <table className="bg-base-min w-full text-left text-base-contrast-min mb-2 table-auto">
        <thead className="bg-primary-light font-semibold text-heading text-md sticky top-0 z-10">
          <tr>
            <th>
              <span className="pl-2">Select</span>
            </th>
            <th className="pl-2">
              {fieldName}{" "}
              {customBinnedData !== null && "(User Defined Bins Applied)"}
            </th>
            <th className="text-right pr-2"># Cases</th>
            {survival && <th className="text-right pr-2">Survival</th>}
          </tr>
        </thead>
        <tbody>
          {Object.entries(
            customBinnedData !== null && !continuous
              ? flattenBinnedData(customBinnedData as CategoricalBins)
              : data,
          )
            // Don't sort values if continuous
            .sort((a, b) => (continuous ? 0 : b[1] - a[1]))
            .map(([key, count], idx) => {
              const survivalSelected = selectedSurvivalPlots.includes(key);
              const enoughCasesForSurvival = count >= SURVIVAL_PLOT_MIN_COUNT;
              const survivalDisabled =
                (!survivalSelected && selectedSurvivalPlots.length === 5) ||
                !enoughCasesForSurvival ||
                key === "missing";

              return (
                <tr
                  className={`text-content text-sm text-content ${
                    idx % 2
                      ? "bg-accent-cool-lighter text-accent-cool-contrast-lighter"
                      : "bg-accent-cool-lightest text-accent-cool-contrast-lightest"
                  }`}
                  key={`${fieldName}-${key}`}
                >
                  <td className="pl-2 py-1">
                    <Checkbox color={"accent"} />
                  </td>
                  <td>
                    <div className="pl-2">{key}</div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2 whitespace-nowrap">
                      {count.toLocaleString()} (
                      {yTotal === 0
                        ? "0.00%"
                        : (count / yTotal).toLocaleString(undefined, {
                            style: "percent",
                            minimumFractionDigits: 2,
                          })}
                      )
                    </div>
                  </td>
                  {survival && (
                    <td className="float-right">
                      <Tooltip
                        label={
                          survivalDisabled
                            ? "Not enough data"
                            : survivalSelected
                            ? `Click to remove ${key} from plot`
                            : `Click to plot ${key}`
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
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default CDaveTable;
