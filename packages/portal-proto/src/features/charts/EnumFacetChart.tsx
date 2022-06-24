/**
 * A BarChart for Enumerated Facets. The as the chart is wrapped from EnumFacet it does not
 * require the Core Data hooks.
 */

import { useEffect, useState } from "react";
import { Loader, Tooltip } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  Bar,
  VictoryAxis,
  VictoryLabel,
  VictoryStack,
  VictoryTooltip,
} from "victory";
import * as tailwindConfig from "tailwind.config";
import ChartTitleBar from "./ChartTitleBar";
import { capitalize } from "src/utils";

const maxValuesToDisplay = 7;

interface FacetChartProps {
  readonly field: string;
  readonly data: Record<string, number>;
  readonly selectedEnums: ReadonlyArray<string>;
  readonly isSuccess: boolean;
  readonly height?: number;
  readonly showTitle?: boolean;
  readonly maxBins?: number;
}

// from https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeKey = (key, { [key]: _, ...rest }) => rest;

const processChartData = (
  facetData: Record<string, any>,
  selectedEnums: ReadonlyArray<string>,
  maxBins = 100,
) => {
  const data = removeKey("_missing", facetData);

  const results = Object.keys(data)
    .filter((d) =>
      !selectedEnums || selectedEnums.length === 0
        ? d
        : selectedEnums.includes(d),
    )
    .slice(0, maxBins)
    .map((d) => ({
      x: truncateString(processLabel(d), 35),
      y: data[d],
      fullXName: processLabel(d),
    }));
  return results.reverse();
};

export const EnumFacetChart: React.FC<FacetChartProps> = ({
  field,
  data,
  selectedEnums,
  isSuccess,
  height,
  showTitle = true,
  maxBins = maxValuesToDisplay,
}: FacetChartProps) => {
  const [chart_data, setChartData] = useState([]);
  const { ref, width } = useElementSize();

  useEffect(() => {
    if (isSuccess) {
      const cd = processChartData(data, selectedEnums, maxBins);
      setChartData(cd);
    }
  }, [data, selectedEnums, field, isSuccess, maxBins]);

  // Create unique ID for this chart
  const chartDivId = `${field}_${Math.floor(Math.random() * 100)}`;

  return (
    <div ref={ref}>
      {showTitle ? (
        <ChartTitleBar
          title={convertFieldToName(field)}
          divId={chartDivId}
          filename={field}
          jsonData={{}}
        />
      ) : null}

      {chart_data && isSuccess ? (
        <EnumBarChart
          data={chart_data}
          height={height}
          width={width * 2.2}
          label="# of Cases"
        />
      ) : (
        <div className="flex flex-row items-center justify-center w-100">
          <Loader color="gray" size={60} />
        </div>
      )}
    </div>
  );
};

const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return capitalizedTokens.join(" ");
};

const truncateString = (str: string, n: number): string => {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
};

export const processLabel = (label: string): string => {
  const tokens = label.split(" ");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return capitalizedTokens.join(" ");
};

interface EnumBarChartTooltipProps {
  readonly x?: number;
  readonly y?: number;
  readonly datum?: {
    y: number;
    fullXName: string;
  };
}

const EnumBarChartTooltip: React.FC<EnumBarChartTooltipProps> = ({
  x,
  y,
  datum,
}: EnumBarChartTooltipProps) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject>
        <Tooltip
          label={
            <>
              <b>{datum.fullXName}</b>
              <p>{datum.y.toLocaleString()} Cases</p>
            </>
          }
          withArrow
          opened
        >
          <></>
        </Tooltip>
      </foreignObject>
    </g>
  );
};

interface EnumBarChartData {
  x: string;
  y: number;
}

interface BarChartProps {
  readonly data: EnumBarChartData[];
  readonly width?: number;
  readonly height?: number;
  readonly label: string;
}

const EnumBarChart: React.FC<BarChartProps> = ({
  data,
  height,
  width,
  label,
}: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.y));
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <VictoryChart
      domainPadding={[data.length === 2 ? 100 : 28, 0]}
      theme={VictoryTheme.material}
      width={width}
      height={height}
    >
      <VictoryAxis
        tickLabelComponent={
          <VictoryLabel
            dx={12}
            dy={-15}
            textAnchor={"start"}
            style={[{ fontSize: 23 }]}
          />
        }
        style={{
          grid: { stroke: "none" },
          ticks: { size: 0 },
          axis: { strokeWidth: 0 },
        }}
      />

      <VictoryAxis
        dependentAxis
        style={{
          grid: { stroke: "none" },
          axisLabel: { padding: 30, fontSize: 20, fontWeight: "bold" },
          tickLabels: { fontSize: 18 },
        }}
        tickCount={3}
        tickFormat={(t) => formatter.format(t)}
        label={label}
        crossAxis={false}
      />

      <VictoryStack>
        <VictoryBar
          horizontal
          labels={() => ""}
          labelComponent={
            <VictoryTooltip flyoutComponent={<EnumBarChartTooltip />} />
          }
          style={{
            data: {
              fill: tailwindConfig.theme.extend.colors["gdc-blue"].darker,
              width: 22,
            },
          }}
          alignment="end"
          data={data}
          x="x"
          y="y"
          dataComponent={
            <Bar
              tabIndex={0}
              ariaLabel={({ datum }) => `x: ${datum.x}, y: ${datum.y}`}
              //  https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/756 https://www.w3.org/TR/graphics-aria-1.0/#graphics-symbol
              // eslint-disable-next-line
              role="graphics-symbol"
            />
          }
        />
        <VictoryBar
          data={data.map((d) => ({ x: d.x, y: max - d.y }))}
          x="x"
          y="y"
          style={{
            data: {
              fill: tailwindConfig.theme.extend.colors["gdc-grey"].lighter,
              width: 22,
            },
          }}
          alignment="end"
        />
      </VictoryStack>
    </VictoryChart>
  );
};
