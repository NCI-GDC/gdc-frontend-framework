/**
 * A BarChart for Enumerated Facets. The as the chart is wrapped from EnumFacet it does not
 * require the Core Data hooks.
 */

import { useEffect, useState } from "react";
import { Loader, Tooltip } from "@mantine/core";
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

const maxValuesToDisplay = 7;

interface FacetChartProps {
  readonly field: string;
  readonly data: Record<string, number>;
  readonly isSuccess: boolean;
  readonly height?: number;
  readonly showTitle?: boolean;
  readonly maxBins?: number;
}

// from https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeKey = (key, { [key]: _, ...rest }) => rest;

const processChartData = (facetData: Record<string, any>, maxBins = 100) => {
  const data = removeKey("_missing", facetData);

  const results = Object.keys(data)
    .slice(0, maxBins)
    .map((d) => ({
      x: processLabel(d, 30),
      y: data[d],
    }));
  return results.reverse();
};

export const EnumFacetChart: React.FC<FacetChartProps> = ({
  field,
  data,
  isSuccess,
  height,
  showTitle = true,
  maxBins = maxValuesToDisplay,
}: FacetChartProps) => {
  const [chart_data, setChartData] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      const cd = processChartData(data, maxBins);
      setChartData(cd);
    }
  }, [data, field, isSuccess, maxBins]);

  // Create unique ID for this chart
  const chartDivId = `${field}_${Math.floor(Math.random() * 100)}`;

  return (
    <>
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
          width={500}
          label="# of Cases"
        />
      ) : (
        <div className="flex flex-row items-center justify-center w-100">
          <Loader color="gray" size={60} />
        </div>
      )}
    </>
  );
};

const capitalize = (s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "");

const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return capitalizedTokens.join(" ");
};

function truncateString(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}

export const processLabel = (label: string, shorten = 100): string => {
  const tokens = label.split(" ");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return truncateString(capitalizedTokens.join(" "), shorten);
};

interface EnumBarChartTooltipProps {
  readonly x?: number;
  readonly y?: number;
  readonly datum?: {
    xName: string;
    y: number;
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
              <b>{datum.xName}</b>
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
            dy={-12}
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
