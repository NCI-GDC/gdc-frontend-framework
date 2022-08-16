import { ActionIcon, Tooltip, Checkbox } from "@mantine/core";
import { MdShowChart as SurvivalChartIcon } from "react-icons/md";
import { CategoricalBins, CustomInterval, NamedFromTo } from "./types";
import { flattenBinnedData } from "./utils";

interface CDaveTableProps {
  readonly fieldName: string;
  readonly data: Record<string, number>;
  readonly customBinnedData: CategoricalBins | CustomInterval | NamedFromTo[];
  readonly survival: boolean;
  readonly selectedSurvivalPlots: string[];
  readonly setSelectedSurvivalPlots: (field: string[]) => void;
  readonly continuous: boolean;
}

const CDaveTable: React.FC<CDaveTableProps> = ({
  fieldName,
  data = {},
  customBinnedData = null,
  survival,
  selectedSurvivalPlots,
  setSelectedSurvivalPlots,
  continuous,
}: CDaveTableProps) => {
  const yTotal = Object.values(data).reduce((a, b) => a + b, 0);

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
              const enoughCasesForSurvival = count > 10;
              const survivalDisabled =
                (!survivalSelected && selectedSurvivalPlots.length === 5) ||
                !enoughCasesForSurvival;

              return (
                <tr
                  className={idx % 2 ? null : "bg-gdc-blue-warm-lightest"}
                  key={`${fieldName}-${key}`}
                >
                  <td>
                    <Checkbox />
                  </td>
                  <td>{key}</td>
                  <td className="text-right">
                    {count.toLocaleString()} (
                    {(count / yTotal).toLocaleString(undefined, {
                      style: "percent",
                      minimumFractionDigits: 2,
                    })}
                    )
                  </td>
                  {survival && (
                    <td>
                      <Tooltip
                        label={
                          !enoughCasesForSurvival
                            ? "Not enough data"
                            : survivalSelected
                            ? `Click to remove ${key} from plot`
                            : `Click to plot ${key}`
                        }
                        className="float-right"
                      >
                        <ActionIcon
                          variant="outline"
                          className={
                            survivalDisabled
                              ? "bg-nci-gray-lighter text-white"
                              : survivalSelected
                              ? `bg-gdc-survival-${selectedSurvivalPlots.indexOf(
                                  key,
                                )} text-white`
                              : "bg-nci-gray text-white"
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
