import { VictoryAxis, VictoryBar, VictoryChart } from "victory";

interface VictoryBarChartProps {
  readonly data: any;
  readonly color: string;
  readonly yLabel: string;
}

const VictoryBarChart: React.FC<VictoryBarChartProps> = ({
  data,
  color,
  yLabel,
}: VictoryBarChartProps) => {
  return (
    <VictoryChart height={500} width={500}>
      <VictoryBar data={data} style={{ data: { fill: color } }} />
      <VictoryAxis dependentAxis label={yLabel} />
      <VictoryAxis style={{ tickLabels: { angle: 45 } }} />
    </VictoryChart>
  );
};

export default VictoryBarChart;
