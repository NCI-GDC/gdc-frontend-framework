/**
 * A BarChart for Enumerated Facets. The as the chart is wrapped from EnumFacet it does not
 * require the Core Data hooks.
 */

import { useEffect, useState } from "react";
import { Box, Loader, Tooltip } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import {
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryTheme,
  Bar,
  VictoryAxis,
  VictoryLabel,
  VictoryStack,
  VictoryTooltip,
} from "victory";
import { useMantineTheme } from "@mantine/core";
import ChartTitleBar from "./ChartTitleBar";
import { capitalize, truncateString } from "src/utils";
import { fieldNameToTitle } from "@gff/core";
import { FacetDocTypeToLabelsMap } from "../facets/hooks";

const maxValuesToDisplay = 7;

interface FacetChartProps {
  readonly field: string;
  readonly data: Record<string, number>;
  readonly selectedEnums: ReadonlyArray<string>;
  readonly isSuccess: boolean;
  readonly height?: number;
  readonly showTitle?: boolean;
  readonly maxBins?: number;
  readonly valueLabel?: string;
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
      x: processLabel(d),
      truncatedXName: truncateString(processLabel(d), 35),
      y: data[d],
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
  valueLabel = FacetDocTypeToLabelsMap.cases,
}: FacetChartProps) => {
  const [chart_data, setChartData] = useState([]);
  const { ref, width } = useElementSize();

  useEffect(() => {
    if (isSuccess) {
      const cd = processChartData(data, selectedEnums, maxBins);
      setChartData(cd);
    } else {
      setChartData([]);
    }
  }, [data, selectedEnums, field, isSuccess, maxBins]);

  // Create unique ID for this chart
  const chartDivId = `${field}_${Math.floor(Math.random() * 100)}`;

  return (
    <div ref={ref}>
      {showTitle ? (
        <ChartTitleBar
          title={fieldNameToTitle(field)}
          divId={chartDivId}
          filename={field}
        />
      ) : null}

      {isSuccess && chart_data && chart_data.length > 0 ? (
        <EnumBarChart
          data={chart_data}
          height={height}
          width={width * 2.2}
          label={`# of ${valueLabel}`}
          unitLabel={valueLabel}
        />
      ) : (
        <div className="flex flex-row items-center justify-center w-100">
          <Loader color="chart" size={60} />
        </div>
      )}
    </div>
  );
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
    x: string;
  };
  readonly unitLabel?: string;
}

const EnumBarChartTooltip: React.FC<EnumBarChartTooltipProps> = ({
  x,
  y,
  datum,
  unitLabel = "Cases",
}: EnumBarChartTooltipProps) => {
  const theme = useMantineTheme();
  return (
    <g style={{ pointerEvents: "none" }}>
      <foreignObject x={x} y={y}>
        <Tooltip
          label={
            <>
              <b>{datum.x}</b>
              <p>
                {datum.y.toLocaleString()} {unitLabel}
              </p>
            </>
          }
          withArrow
          opened
          withinPortal
          arrowSize={10}
          style={{
            fontSize: 12,
            backgroundColor: theme.colors.accent[1],
            color: theme.colors.base[9],
          }}
        >
          <Box></Box>
        </Tooltip>
      </foreignObject>
    </g>
  );
};

interface EnumBarChartData {
  x: string;
  y: number;
  truncatedXName: string;
}

interface BarChartProps {
  readonly data: EnumBarChartData[];
  readonly width?: number;
  readonly height?: number;
  readonly label: string;
  readonly unitLabel?: string;
}

const EnumBarChart: React.FC<BarChartProps> = ({
  data,
  height,
  width,
  label,
  unitLabel,
}: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.y));
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const theme = useMantineTheme();

  return (
    <VictoryChart
      domainPadding={[data.length === 2 ? 100 : 28, 0]}
      theme={VictoryTheme.material}
      width={width}
      height={height}
      containerComponent={<VictoryContainer role="figure" />}
    >
      <VictoryAxis
        tickLabelComponent={
          <VictoryLabel
            dx={12}
            dy={-15}
            textAnchor={"start"}
            style={[{ fontSize: 23, fontFamily: "Noto Sans, sans-serif" }]}
            text={({ datum }) => data[datum - 1]?.truncatedXName}
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
            <VictoryTooltip
              flyoutComponent={<EnumBarChartTooltip unitLabel={unitLabel} />}
            />
          }
          style={{
            data: {
              fill: theme.colors.chart[6],
              stroke: theme.colors.chart[6],
              strokeWidth: 1,
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
              fill: theme.colors.base[1],
              stroke: theme.colors.base[7],
              strokeWidth: 1,
              width: 22,
            },
          }}
          alignment="end"
        />
      </VictoryStack>
    </VictoryChart>
  );
};
