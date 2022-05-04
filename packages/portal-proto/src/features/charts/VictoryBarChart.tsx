import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
  Bar,
  VictoryTooltip,
} from "victory";

interface VictoryBarChartProps {
  data: any;
  onClickHandler?: (event) => void;
}

const VictoryBarChart: React.FC<VictoryBarChartProps> = ({
  data,
  onClickHandler,
}: VictoryBarChartProps) => {
  return (
    <VictoryChart
      domainPadding={[80, 0]}
      theme={VictoryTheme.material}
      width={700}
    >
      <VictoryGroup offset={60}>
        {data.map((set, idx) => (
          <VictoryBar
            key={`victory_bar_${idx}`}
            labelComponent={<VictoryTooltip />}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onClick: () => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          onClickHandler(props.datum);
                          return null;
                        },
                      },
                    ];
                  },
                  onKeyPress: (event) => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          if (event.key === "Enter") {
                            onClickHandler(props.datum);
                          }
                          return null;
                        },
                      },
                    ];
                  },
                },
              },
            ]}
            data={set}
            x={"x"}
            y="y"
            dataComponent={
              <Bar
                tabIndex={0}
                ariaLabel={({ datum }) => `x: ${datum.x}, y: ${datum.y}`}
              />
            }
          />
        ))}
      </VictoryGroup>
    </VictoryChart>
  );
};

export default VictoryBarChart;
