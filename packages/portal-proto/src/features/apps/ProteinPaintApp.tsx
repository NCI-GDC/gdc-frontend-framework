import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";
import { DemoUtil } from "./DemoUtil";

const ProteinPaintApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return isDemoMode ? (
    <DemoUtil text="Coming Soon!" />
  ) : (
    <ProteinPaintWrapper />
  );
};

export default ProteinPaintApp;
