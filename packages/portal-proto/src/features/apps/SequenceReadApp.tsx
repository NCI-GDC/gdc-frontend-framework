import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { SequenceReadWrapper } from "../proteinpaint/SequenceReadWrapper";
import { DemoUtil } from "./DemoUtil";

const SequenceReadApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <SequenceReadWrapper />
      )}
    </>
  );
};

export default SequenceReadApp;
