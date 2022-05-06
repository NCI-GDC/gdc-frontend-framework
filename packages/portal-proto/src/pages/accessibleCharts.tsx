import { NextPage } from "next";
import VictoryBarChart from "@/features/charts/VictoryBarChart";
import ChartjsBarChart from "@/features/charts/ChartjsBarChart";
import NivoBarChart from "@/features/charts/NivoChart";

const victoryData = [
  [
    {
      x: "dead",
      y: 63.36206896551724,
      label: "Pancreas - KRAS mutated 63.36% Cases (147)",
    },
    {
      x: "alive",
      y: 35.3448275862069,
      label: "Pancreas - KRAS mutated 35.34% Cases (82)",
    },
    {
      x: "not reported",
      y: 0.8620689655172413,
      label: "Pancreas - KRAS mutated 0.86% Cases (2)",
    },
    {
      x: "unknown",
      y: 0.43103448275862066,
      label: "Pancreas - KRAS mutated 0.43% Cases (1)",
    },
    {
      x: "missing",
      y: 0,
      label: "Pancreas - KRAS mutated 0.00% Cases (0)",
    },
  ],
  [
    {
      x: "dead",
      y: 2.0816653322658127,
      label: "Pancreas - KRAS not mutated 2.08% Cases (52)",
    },
    {
      x: "alive",
      y: 2.241793434747798,
      label: "Pancreas - KRAS not mutated 2.24% Cases (56)",
    },
    {
      x: "not reported",
      y: 95.6765412329864,
      label: "Pancreas - KRAS not mutated 95.68% Cases (2390)",
    },
    {
      x: "missing",
      y: 0,
      label: "Pancreas - KRAS not mutated 0.00% Cases (0)",
    },
  ],
];

const labels = ["dead", "alive", "not reported", "unknown", "missing"];
const datasets = [
  {
    data: [
      63.36206896551724, 35.3448275862069, 0.8620689655172413,
      0.43103448275862066, 0,
    ],
    backgroundColor: "red",
    borderColor: "red",
    hoverBorderWidth: 2,
    hoverBorderColor: "blue",
  },
  {
    data: [2.0816653322658127, 2.241793434747798, 95.6765412329864, 0, 0],
    backgroundColor: "yellow",
    borderColor: "yellow",
    hoverBorderWidth: 2,
    hoverBorderColor: "blue",
  },
];

const nivoData = [
  {
    "Pancreas - KRAS mutated": 63.36206896551724,
    "Pancreas - KRAS not mutated": 2.081665332265812,
    id: "dead",
  },
  {
    "Pancreas - KRAS mutated": 35.3448275862069,
    "Pancreas - KRAS not mutated": 2.241793434747798,
    id: "alive",
  },
  {
    "Pancreas - KRAS mutated": 0.8620689655172413,
    "Pancreas - KRAS not mutated": 95.6765412329864,
    id: "not reported",
  },
  {
    "Pancreas - KRAS mutated": 0.43103448275862066,
    "Pancreas - KRAS not mutated": 0,
    id: "unknown",
  },
  {
    "Pancreas - KRAS mutated": 0,
    "Pancreas - KRAS not mutated": 0,
    id: "missing",
  },
];

const AccessibleCharts: NextPage = () => {
  const onClickHandler = (mouseEvent) => {
    alert("click!");
  };

  return (
    <div className="p-4">
      <div>
        <h1>Victory</h1>
        <VictoryBarChart data={victoryData} onClickHandler={onClickHandler} />
      </div>
      <div>
        <h1>Nivo</h1>
        <NivoBarChart
          data={nivoData}
          keys={["Pancreas - KRAS mutated", "Pancreas - KRAS not mutated"]}
          onClick={onClickHandler}
          horizontal
        />
      </div>
      <div>
        <h1>Chartjs</h1>
        <ChartjsBarChart data={{ labels, datasets }} />
      </div>
    </div>
  );
};

export default AccessibleCharts;
