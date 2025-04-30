import { FC } from "react";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";
import SetOperationsSelection from "../set-operations/SetOperationsSelection";

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();
  return isDemoMode ? <SetOperationsDemo /> : <SetOperationsSelection />;
};

export default SetOperationsApp;
