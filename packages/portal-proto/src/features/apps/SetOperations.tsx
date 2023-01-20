import useIsDemoApp from "@/hooks/useIsDemoApp";
import { FC } from "react";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";
import { DemoUtil } from "./DemoUtil";

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return (
    <>{isDemoMode ? <SetOperationsDemo /> : <DemoUtil text="Coming Soon!" />}</>
  );
};

export default SetOperationsApp;
