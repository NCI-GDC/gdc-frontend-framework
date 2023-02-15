import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { OncoMatrixWrapper } from "../proteinpaint/OncoMatrixWrapper";
import { DemoUtil } from "./DemoUtil";

const MatrixApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return (
    <>{isDemoMode ? <DemoUtil text="Coming Soon!" /> : <OncoMatrixWrapper />}</>
  );
};

export default MatrixApp;
