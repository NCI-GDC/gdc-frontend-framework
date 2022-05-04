import { NextPage } from "next";
import VictoryBarChart from "@/features/charts/VictoryBarChart";

const AccessibleCharts: NextPage = () => {
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
        x: "not reported",
        y: 95.6765412329864,
        label: "Pancreas - KRAS not mutated 95.68% Cases (2390)",
      },
      {
        x: "alive",
        y: 2.241793434747798,
        label: "Pancreas - KRAS not mutated 2.24% Cases (56)",
      },
      {
        x: "dead",
        y: 2.0816653322658127,
        label: "Pancreas - KRAS not mutated 2.08% Cases (52)",
      },
      {
        x: "missing",
        y: 0,
        label: "Pancreas - KRAS not mutated 0.00% Cases (0)",
      },
    ],
  ];

  const onClickHandler = (mouseEvent) => {
    alert("click!");
  };

  return (
    <>
      <VictoryBarChart data={victoryData} onClickHandler={onClickHandler} />
    </>
  );
};

export default AccessibleCharts;
