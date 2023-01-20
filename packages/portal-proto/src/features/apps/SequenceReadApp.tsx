import useIsDemoApp from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { ProteinPaintWrapper } from "../proteinpaint/ProteinPaintWrapper";
import { DemoUtil } from "./DemoUtil";

const SequenceReadApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <ProteinPaintWrapper track="bam" />
      )}
    </>
  );
};

export default SequenceReadApp;
