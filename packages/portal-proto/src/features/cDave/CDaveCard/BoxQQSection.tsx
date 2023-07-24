import React, { useCallback } from "react";
import tw from "tailwind-styled-components";
import { DAYS_IN_YEAR, ClinicalContinuousStatsData } from "@gff/core";
import tailwindConfig from "tailwind.config";
import { BOX_QQ_DATA_DIMENSIONS, COLOR_MAP } from "../constants";
import QQPlot from "./QQPlot";
import BoxPlot from "./BoxPlot";
import { useResizeObserver } from "@mantine/hooks";

const LightTableRow = tw.tr`text-content text-sm font-content bg-base-max text-base-contrast-max`;
const DarkTableRow = tw.tr`text-content text-sm font-content bg-base-lightest text-base-contrast-lightest`;

interface BoxQQPlotProps {
  readonly field: string;
  readonly data: ClinicalContinuousStatsData;
}

const BoxQQSection: React.FC<BoxQQPlotProps> = ({
  field,
  data,
}: BoxQQPlotProps) => {
  // Field examples: diagnoses.age_at_diagnosis, diagnoses.treatments.days_to_treatment_start
  const [clinicalType, clinicalField, clinicalNestedField] = field.split(".");

  const color =
    tailwindConfig.theme.extend.colors[
      COLOR_MAP[clinicalNestedField ? clinicalField : clinicalType]
    ]?.DEFAULT;
  const dataDimension =
    BOX_QQ_DATA_DIMENSIONS?.[clinicalNestedField ?? clinicalField];

  const formatValue = useCallback(
    (value: number) => {
      return Number(
        dataDimension?.unit === "Years"
          ? value / DAYS_IN_YEAR
          : value.toFixed(2),
      );
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

  const [boxPlotRef, boundingRectBox] = useResizeObserver();
  const [qqPlotRef, boundingRectQQ] = useResizeObserver();

  return (
    <>
      <div className="flex flex-row">
        <div className="w-full h-72 basis-1/3" ref={boxPlotRef}>
          <BoxPlot
            data={formattedData}
            color={color}
            width={boundingRectBox.width}
            height={boundingRectBox.height}
          />
        </div>
        <div className="w-full h-72 basis-2/3" ref={qqPlotRef}>
          <QQPlot
            field={field}
            color={color}
            width={boundingRectQQ.width}
            height={boundingRectQQ.height}
          />
        </div>
      </div>
      <div className="min-h-44 block overflow-auto w-full relative border-base-light border-1">
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
                {dataDimension?.unit || "Quantities"}
              </th>
            </tr>
          </thead>
          <tbody>
            <LightTableRow>
              <td>Minimum</td>
              <td>{formattedData.min}</td>
            </LightTableRow>
            <DarkTableRow>
              <td>Maximum</td>
              <td>{formattedData.max}</td>
            </DarkTableRow>
            <LightTableRow>
              <td>Mean</td>
              <td>{formattedData.mean}</td>
            </LightTableRow>
            <DarkTableRow>
              <td>Median</td>
              <td>{formattedData.median}</td>
            </DarkTableRow>
            <LightTableRow>
              <td>Standard Deviation</td>
              <td>{formatValue(data.std_dev)}</td>
            </LightTableRow>
            <DarkTableRow>
              <td>IQR</td>
              <td>{formatValue(data.iqr)}</td>
            </DarkTableRow>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoxQQSection;
