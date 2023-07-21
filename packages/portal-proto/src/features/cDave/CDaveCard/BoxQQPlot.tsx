import { useCallback } from "react";
import tw from "tailwind-styled-components";
import { DAYS_IN_YEAR, ClinicalContinuousStatsData } from "@gff/core";
import tailwindConfig from "tailwind.config";
import { BOX_QQ_DATA_DIMENSIONS, COLOR_MAP } from "../constants";
import QQPlot from "./QQPlot";
import BoxPlot from "./BoxPlot";

const LightTableRow = tw.tr`text-content text-sm font-content bg-base-max text-base-contrast-max`;
const DarkTableRow = tw.tr`text-content text-sm font-content bg-base-lightest text-base-contrast-lightest`;

interface BoxQQPlotProps {
  readonly field: string;
  readonly data: ClinicalContinuousStatsData;
}

const BoxQQPlot: React.FC<BoxQQPlotProps> = ({
  field,
  data,
}: BoxQQPlotProps) => {
  // Field examples: diagnoses.age_at_diagnosis, diagnoses.treatments.days_to_treatment_start
  const [clinicalType, clinicalField, clinicalNestedField] = field.split(".");

  const color =
    tailwindConfig.theme.extend.colors[COLOR_MAP[clinicalType]]?.DEFAULT;
  const dataDimension =
    BOX_QQ_DATA_DIMENSIONS?.[clinicalNestedField ?? clinicalField];

  const formatValue = useCallback(
    (value: number) => {
      return (
        dataDimension?.unit === "Years" ? value / DAYS_IN_YEAR : value
      ).toFixed(2);
    },
    [dataDimension],
  );

  const formattedData = {
    min: formatValue(data.min),
    max: formatValue(data.max),
    mean: formatValue(data.mean),
    median: formatValue(data.median),
    q1: formatValue(data.q1),
    q3: formatValue(data.q3),
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="w-full h-full basis-1/2">
          <BoxPlot data={formattedData} color={color} />
        </div>
        <div className="w-full h-full basis-1/2">
          <QQPlot field={field} />
        </div>
      </div>
      <div className="h-44 block overflow-auto w-full relative border-base-light border-1">
        <table
          data-testid="table-card"
          className="border-separate border-spacing-0 w-full text-left text-base-contrast-min mb-2 table-auto"
        >
          <thead className="bg-base-max font-heading text-sm text-base-contrast-max z-10">
            <tr>
              <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1">
                Statistics
              </th>
              <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1">
                {dataDimension?.unit}
              </th>
            </tr>
          </thead>
          <tbody>
            <LightTableRow>
              <td>Minimum</td>
              <td>{formattedData.min.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td>Maximum</td>
              <td>{formattedData.max.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td>Mean</td>
              <td>{formattedData.mean.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td>Median</td>
              <td>{formattedData.median.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td>Standard Deviation</td>
              <td>{formatValue(data.std_dev).toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td>IQR</td>
              <td>{formatValue(data.iqr).toLocaleString()}</td>
            </DarkTableRow>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoxQQPlot;
