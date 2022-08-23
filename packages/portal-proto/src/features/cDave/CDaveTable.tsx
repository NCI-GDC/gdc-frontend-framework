import { ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import { MdTrendingDown as SurvivalChartIcon } from "react-icons/md";
import { SURVIVAL_PLOT_MIN_COUNT } from "./constants";
import { CategoricalBins, CustomInterval, NamedFromTo } from "./types";
import { flattenBinnedData } from "./utils";

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
    <div className="h-48 block overflow-auto w-full relative">
      <table className="bg-white w-full text-left text-nci-gray-darker mb-2">
        <thead className="bg-nci-gray-lightest font-bold">
          <tr>
            <th>Select</th>
            <th>
              {fieldName}{" "}
              {customBinnedData !== null && "(User Defined Bins Applied)"}
            </th>
            <th className="text-right"># Cases</th>
            {survival && <th className="text-right">Survival</th>}
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
                  className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}
                  key={`${fieldName}-${key}`}
                >
                  <td>
                    <Checkbox color={"nci-blue"} />
                  </td>
                  <td>{key}</td>
                  <td className="text-right">
                    {count.toLocaleString()} (
                    {yTotal === 0
                      ? "0.00%"
                      : (count / yTotal).toLocaleString(undefined, {
                          style: "percent",
                          minimumFractionDigits: 2,
                        })}
                    )
                  </td>
                  {survival && (
                    <td className="float-right">
                      <Tooltip
                        label={
                          !enoughCasesForSurvival
                            ? "Not enough data"
                            : survivalSelected
                            ? `Click to remove ${key} from plot`
                            : `Click to plot ${key}`
                        }
                        withArrow
                        withinPortal={true}
                      >
                        <ActionIcon
                          variant="outline"
                          className={
                            survivalDisabled
                              ? "bg-nci-gray-lightest text-white"
                              : survivalSelected
                              ? `bg-gdc-survival-${selectedSurvivalPlots.indexOf(
                                  key,
                                )} text-white`
                              : "bg-white text-nci-gray"
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
