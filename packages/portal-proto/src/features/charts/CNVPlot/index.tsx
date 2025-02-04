import { useCallback, useState } from "react";
import { orderBy } from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FilterSet, useCnvPlotQuery } from "@gff/core";
import ChartTitleBar from "../ChartTitleBar";
import { CountSpan } from "@/components/tailwindComponents";
import { LoadingOverlay, Tooltip } from "@mantine/core";
import {
  chartDivId,
  checkboxConfigs,
  CheckboxState,
  cnvMapping,
  hovertemplate,
} from "./utils";
import { PlotMouseEvent } from "plotly.js";
import { useDeepCompareMemo } from "use-deep-compare";

const BarChart = dynamic(() => import("../BarChart"), {
  ssr: false,
});

interface CNVPlotProps {
  readonly gene: string;
  readonly height?: number;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}
/**
 * CNV plot component
 * @param gene - gene to plot
 * @param {height} - height of the chart -
 * @param {genomicFilters} - genomic filters to apply
 * @param {cohortFilters} - cohort filters to apply
 * @category Charts
 */
const CNVPlot: React.FC<CNVPlotProps> = ({
  gene,
  height = undefined,
  genomicFilters = undefined,
  cohortFilters = undefined,
}: CNVPlotProps) => {
  const router = useRouter();
  const { data, error, isFetching, isError } = useCnvPlotQuery({
    gene,
    cohortFilters,
    genomicFilters,
  });

  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    amplification: true,
    gain: true,
    heterozygousDeletion: true,
    homozygousDeletion: true,
  });

  const handleCheckboxChange = useCallback((key: keyof CheckboxState) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  }, []);

  const onClickHandler = useCallback((mouseEvent: PlotMouseEvent) => {
    router.push(`/projects/${mouseEvent.points[0].x}`);
  }, []);

  const [isReady, setIsReady] = useState(false);
  const handleOnAfterPlot = useCallback(() => setIsReady(true), []);

  // const errorMessage = useDeepCompareMemo(() => {
  //   if (typeof error === "string") return error;
  //   return "text" in error ? error.text : "An error occurred";
  // }, [error]);

  // if (isError) {
  //   return <div>Failed to fetch chart: {errorMessage}</div>;
  // }

  const projectKeys = useDeepCompareMemo(
    () => Object.keys(data?.cnvs ?? {}),
    [data],
  );
  if (!isFetching && projectKeys.length < 5) return null;

  const caseTotalFormatted = data?.caseTotal.toLocaleString();
  const projectCountFormatted = projectKeys.length.toLocaleString();

  const title = (
    <span>
      <CountSpan>{caseTotalFormatted}</CountSpan> CASES AFFECTED BY{" "}
      <Tooltip
        label="Amplifications, gains, heterozygous deletions, and homozygous deletions"
        w={270}
        withArrow
        multiline
      >
        <span className="underline decoration-dashed">CNV EVENTS</span>
      </Tooltip>{" "}
      ACROSS <CountSpan>{projectCountFormatted}</CountSpan> PROJECTS
    </span>
  );

  const chartData = useDeepCompareMemo(() => {
    return projectKeys.map((project) => {
      const cnv = data.cnvs[project];
      const valueSum = Object.keys(cnvMapping).reduce((sum, key) => {
        return checkboxState[key] ? sum + cnv[cnvMapping[key].prop] : sum;
      }, 0);
      return {
        ...cnv,
        project,
        percent: cnv.total ? (valueSum / cnv.total) * 100 : 0,
      };
    });
  }, [data, projectKeys, checkboxState]);

  const top20ChartData = useDeepCompareMemo(() => {
    return chartData
      .slice()
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 20);
  }, [chartData]);

  const datasets = useDeepCompareMemo(() => {
    return Object.entries(cnvMapping)
      .filter(([key]) => checkboxState[key])
      .map(([_, { prop, color }]) => ({
        y: top20ChartData.map((d) => (d[prop] / d.total) * 100),
        x: top20ChartData.map((d) => d.project),
        hovertemplate,
        customdata: top20ChartData.map((d) => [d[prop], d.total]),
        marker: { color },
      }));
  }, [checkboxState, top20ChartData]);

  console.log({ datasets, top20ChartData });

  const chartConfig = useDeepCompareMemo(
    () => ({
      yAxisTitle: "% of Cases Affected",
      datasets,
    }),
    [datasets],
  );

  const jsonData = useDeepCompareMemo(() => {
    return top20ChartData.map(
      ({
        project: symbol,
        gain,
        loss,
        total,
        amplification,
        homozygousDeletion,
      }) => ({
        symbol,
        amplification: amplification ? amplification / total : 0,
        gain: gain ? (gain / total) * 100 : 0,
        "heterozygous deletion": loss ? (loss / total) * 100 : 0,
        "homozygous deletion": homozygousDeletion
          ? (homozygousDeletion / total) * 100
          : 0,
        total,
      }),
    );
  }, [top20ChartData]);

  return (
    <div
      data-testid="graph-cancer-distribution-cnv"
      className="border border-base-lighter p-4 relative"
    >
      <LoadingOverlay visible={isFetching || !isReady} />
      <div className={`${!isReady && "invisible"}`}>
        <div>
          <ChartTitleBar
            title={title}
            filename="cancer-distribution-bar-chart"
            divId={chartDivId}
            jsonData={jsonData}
          />
        </div>
        <div>
          <BarChart
            divId={chartDivId}
            data={chartConfig}
            onClickHandler={onClickHandler}
            height={height}
            stacked
            onAfterPlot={handleOnAfterPlot}
          />
        </div>

        {/* checkboxes */}
        <div className="justify-center text-sm flex flex-wrap gap-4">
          {checkboxConfigs.map(({ key, label, id, className }) => (
            <div key={id} className="flex items-center">
              <input
                type="checkbox"
                checked={checkboxState[key]}
                onChange={() => handleCheckboxChange(key)}
                className={className}
                id={id}
              />
              <label htmlFor={id} className="pl-1">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CNVPlot;
