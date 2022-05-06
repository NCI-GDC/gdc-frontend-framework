import { Bar } from "@nivo/bar";

interface NivoBarChartProps {
  data: any;
  keys: string[];
  onClick?: () => void;
  horizontal?: boolean;
}

const NivoBarChart = ({ data, keys, onClick, horizontal = false }) => {
  return (
    <Bar
      data={data}
      keys={keys}
      groupMode="grouped"
      width={800}
      height={500}
      isFocusable
      layout={horizontal ? "horizontal" : "vertical"}
      label={(d) => d.value.toLocaleString(2)}
      onClick={onClick}
      role={"graphics-document"}
      barAriaLabel={(data) => {
        console.log(data);
        return `${data.indexValue} - ${data.id} : ${data.value}`;
      }}
    />
  );
};

export default NivoBarChart;
