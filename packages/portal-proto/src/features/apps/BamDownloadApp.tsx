import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { FC } from "react";
import { SequenceReadWrapper } from "../proteinpaint/SequenceReadWrapper";
import { DemoUtil } from "./DemoUtil";

const BamDownloadApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <SequenceReadWrapper stream2download={true} />
      )}
    </>
  );
};

export default BamDownloadApp;
