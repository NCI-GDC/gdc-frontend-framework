import useIsDemoApp from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";
import { DemoUtil } from "./DemoUtil";

const MatrixApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return (
    <>
      {isDemoMode ? (
        <ProteinPaintWrapper track="matrix" />
      ) : (
        <DemoUtil text="Coming Soon!" />
      )}
    </>
  );
};

export default MatrixApp;
