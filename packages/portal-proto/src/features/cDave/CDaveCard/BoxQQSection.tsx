import React, { useCallback, useEffect, useRef, useContext } from "react";
import saveAs from "file-saver";
import tw from "tailwind-styled-components";
import { Menu, Tooltip, ActionIcon, Button } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import {
  useGetCaseSsmsQuery,
  joinFilters,
  FilterSet,
  useCoreSelector,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  DAYS_IN_YEAR,
  ClinicalContinuousStatsData,
} from "@gff/core";
import tailwindConfig from "tailwind.config";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { convertDateToString } from "@/utils/date";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  BOX_QQ_DATA_DIMENSIONS,
  COLOR_MAP,
  DEMO_COHORT_FILTERS,
} from "../constants";
import { parseNestedQQResponseData, qnorm } from "../utils";
import QQPlot from "./QQPlot";
import BoxPlot from "./BoxPlot";
import { DashboardDownloadContext } from "../chartDownloadContext";

const LightTableRow = tw.tr`text-content text-sm font-content bg-base-max text-base-contrast-max`;
const DarkTableRow = tw.tr`text-content text-sm font-content bg-base-lightest text-base-contrast-lightest`;

interface BoxQQPlotProps {
  readonly field: string;
  readonly displayName: string;
  readonly data: ClinicalContinuousStatsData;
}

const BoxQQSection: React.FC<BoxQQPlotProps> = ({
  field,
  displayName,
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

  const missingFilter: FilterSet = {
    root: {
      [`cases.${field}`]: {
        field: `cases.${field}`,
        operator: "exists",
      },
    },
    mode: "and",
  };

  const isDemoMode = useIsDemoApp();
  const cohortFilters = useCoreSelector((state) =>
    isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
  );

  const {
    data: qqData,
    isLoading,
    isSuccess,
  } = useGetCaseSsmsQuery({
    fields: [field],
    filters: buildCohortGqlOperator(joinFilters(missingFilter, cohortFilters)),
    size: 10000,
  });

  const parsedQQValues = isSuccess
    ? parseNestedQQResponseData(qqData, field)
    : [];
  const downloadData = parsedQQValues.map((caseEntry, i) => ({
    id: caseEntry.id,
    "Sample Quantile": caseEntry.value,
    "Theoretical Normal Quantile": qnorm((i + 1 - 0.5) / parsedQQValues.length),
  }));

  const downloadTSVFile = () => {
    const header = ["id", "Sample Quantile", "Theoretical Normal Quantile"];
    const body = downloadData.map((d) => Object.values(d).join("\t"));
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${qqPlotDownloadName}.tsv`,
    );
  };

  const downloadTableTSVFile = () => {
    const header = ["Statistics", dataDimension?.unit || "Quantities"];
    const body = [
      ["Minimum", formattedData.min].join("\t"),
      ["Maximum", formattedData.max].join("\t"),
      ["Mean", formattedData.mean].join("\t"),
      ["Median", formattedData.median].join("\t"),
      ["Standard Deviation", data.std_dev].join("\t"),
      ["IQR", data.iqr].join("\t"),
    ];
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${fieldName}-statistics-${date}.tsv`,
    );
  };

  const [boxPlotRef, boundingRectBox] = useResizeObserver();
  const [qqPlotRef, boundingRectQQ] = useResizeObserver();

  const { dispatch } = useContext(DashboardDownloadContext);
  const boxDownloadChartRef = useRef<HTMLElement>();
  const qqDownloadChartRef = useRef<HTMLElement>();
  const fieldName = clinicalNestedField ?? clinicalField;
  const date = convertDateToString(new Date());
  const boxPlotDownloadName = `${fieldName}-box-plot-${date}`;
  const qqPlotDownloadName = `${fieldName}-qq-plot-${date}`;

  useEffect(() => {
    const charts = [
      { filename: boxPlotDownloadName, chartRef: boxPlotRef },
      { filename: qqPlotDownloadName, chartRef: qqPlotRef },
    ];
    dispatch({ type: "add", payload: charts });
    return () => dispatch({ type: "remove", payload: charts });
  }, [
    boxPlotRef,
    qqPlotRef,
    boxPlotDownloadName,
    qqPlotDownloadName,
    dispatch,
  ]);

  return (
    <>
      <div className="flex justify-end">
        <Menu>
          <Menu.Target>
            <Tooltip
              label="Download image or data"
              withArrow
              withinPortal
              position={"left"}
            >
              <ActionIcon
                data-testid="button-histogram-download"
                variant="outline"
                className="bg-base-max border-primary"
                aria-label="Download image or data"
              >
                <DownloadIcon className="text-primary" />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => {
                handleDownloadSVG(
                  boxDownloadChartRef,
                  `${boxPlotDownloadName}.svg`,
                );
                handleDownloadSVG(
                  qqDownloadChartRef,
                  `${qqPlotDownloadName}.svg`,
                );
              }}
            >
              SVG
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                handleDownloadPNG(
                  boxDownloadChartRef,
                  `${boxPlotDownloadName}.png`,
                );
                handleDownloadPNG(
                  qqDownloadChartRef,
                  `${qqPlotDownloadName}.png`,
                );
              }}
            >
              PNG
            </Menu.Item>
            <Menu.Item
              component="a"
              href={`data:text/json;charset=utf-8, ${encodeURIComponent(
                JSON.stringify(downloadData, null, 2), // prettify JSON
              )}`}
              download={`${qqPlotDownloadName}}.json`}
            >
              QQ JSON
            </Menu.Item>
            <Menu.Item onClick={downloadTSVFile}>QQ TSV</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
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
            data={parsedQQValues}
            isLoading={isLoading}
            color={color}
            width={boundingRectQQ.width}
            height={boundingRectQQ.height}
          />
        </div>
        {/* The chart for downloads is slightly different so render another chart offscreen */}
        <div
          className="h-64 absolute left-[-1000px]"
          aria-hidden="true"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore https://github.com/facebook/react/pull/24730 https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
          inert=""
        >
          <BoxPlot
            data={formattedData}
            color={color}
            width={500}
            height={500}
            chartRef={boxDownloadChartRef}
            label={`${displayName} Box Plot`}
          />
        </div>
        <div
          className="h-64 absolute left-[-1000px]"
          aria-hidden="true"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore https://github.com/facebook/react/pull/24730 https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
          inert=""
        >
          <QQPlot
            field={field}
            data={parsedQQValues}
            isLoading={isLoading}
            color={color}
            width={500}
            height={500}
            chartRef={qqDownloadChartRef}
            label={`${displayName} QQ Plot`}
          />
        </div>
      </div>
      <Button
        data-testid="button-stats-tsv-cdave-card"
        className="bg-base-max text-primary border-primary mb-2"
        onClick={downloadTableTSVFile}
      >
        TSV
      </Button>
      <div className="min-h-44 block overflow-auto w-full relative border-base-light border-1">
        <table
          data-testid="table-card"
          className="border-separate border-spacing-0 w-full text-left text-base-contrast-min mb-2 table-auto"
        >
          <thead className="bg-base-max font-heading text-sm text-base-contrast-max z-10">
            <tr>
              <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1 pl-1">
                Statistics
              </th>
              <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1">
                {dataDimension?.unit || "Quantities"}
              </th>
            </tr>
          </thead>
          <tbody>
            <LightTableRow>
              <td className="pl-1">Minimum</td>
              <td>{formattedData.min.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">Maximum</td>
              <td>{formattedData.max.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td className="pl-1">Mean</td>
              <td>{formattedData.mean.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">Median</td>
              <td>{formattedData.median.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td className="pl-1">Standard Deviation</td>
              <td>{formatValue(data.std_dev).toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">IQR</td>
              <td>{formatValue(data.iqr).toLocaleString()}</td>
            </DarkTableRow>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoxQQSection;
