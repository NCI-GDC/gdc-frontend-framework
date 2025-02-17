import { useCallback, useState } from "react";
import { orderBy } from "lodash";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FilterSet, GraphQLFetchError, useCnvPlotQuery } from "@gff/core";
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
 * @param height - height of the chart -
 * @param genomicFilters - genomic filters to apply
 * @param cohortFilters - cohort filters to apply
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
    gain: false,
    heterozygousDeletion: false,
    homozygousDeletion: true,
  });
  const anyCheckboxSelected = Object.values(checkboxState).some((v) => v);

  const handleCheckboxChange = useCallback((key: keyof CheckboxState) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  }, []);
  const onClickHandler = useCallback((mouseEvent: PlotMouseEvent) => {
    const point = mouseEvent.points?.[0];
    if (point && point.x) {
      router.push(`/projects/${point.x}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isReady, setIsReady] = useState(false);
  const handleOnAfterPlot = useCallback(() => setIsReady(true), []);

  const projectKeys = useDeepCompareMemo(
    () => Object.keys(data?.cnvs ?? {}),
    [data],
  );

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
      const valueSum = anyCheckboxSelected
        ? Object.keys(cnvMapping).reduce((sum, key) => {
            return checkboxState[key] ? sum + cnv[cnvMapping[key].prop] : sum;
          }, 0)
        : 0;
      return {
        ...cnv,
        project,
        percent: cnv.total ? (valueSum / cnv.total) * 100 : 0,
      };
    });
  }, [data, projectKeys, checkboxState, anyCheckboxSelected]);

  const top20ChartData = useDeepCompareMemo(() => {
    return chartData.sort((a, b) => b.percent - a.percent).slice(0, 20);
  }, [chartData]);

  const datasets = useDeepCompareMemo(() => {
    if (!anyCheckboxSelected) {
      return [
        {
          y: top20ChartData.map(() => null),
          x: top20ChartData.map((d) => d.project),
        },
      ];
    }
    return Object.entries(cnvMapping)
      .filter(([key]) => checkboxState[key])
      .map(([_, { prop, color }]) => ({
        y: top20ChartData.map((d) => (d[prop] / d.total) * 100),
        x: top20ChartData.map((d) => d.project),
        hovertemplate,
        customdata: top20ChartData.map((d) => [d[prop], d.total]),
        marker: { color },
      }));
  }, [checkboxState, top20ChartData, anyCheckboxSelected]);

  const chartConfig = useDeepCompareMemo(
    () => ({
      yAxisTitle: "% of Cases Affected",
      datasets,
    }),
    [datasets],
  );

  const jsonData = useDeepCompareMemo(() => {
    const preparedData = top20ChartData.map(
      ({
        project: symbol,
        amplification,
        gain,
        loss,
        homozygousDeletion,
        total,
      }) => ({
        symbol,
        amplification: amplification ? (amplification / total) * 100 : 0,
        gain: gain ? (gain / total) * 100 : 0,
        "heterozygous deletion": loss ? (loss / total) * 100 : 0,
        "homozygous deletion": homozygousDeletion
          ? (homozygousDeletion / total) * 100
          : 0,
        total,
      }),
    );

    // When no checkboxes are selected, sort the data by the listed keys descending.
    if (!anyCheckboxSelected) {
      return orderBy(
        preparedData,
        [
          "amplification",
          "gain",
          "heterozygous deletion",
          "homozygous deletion",
        ],
        ["desc", "desc", "desc", "desc"],
      );
    }

    return preparedData;
  }, [top20ChartData, anyCheckboxSelected]);

  if (!isFetching && projectKeys.length < 5) return null;

  const errorMessage =
    typeof error === "string"
      ? error
      : (error as GraphQLFetchError)?.text ?? "An error occurred";

  if (isError) {
    return <div>Failed to fetch chart: {errorMessage}</div>;
  }

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
            onClickHandler={onClickHandler}
            data={chartConfig}
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
