import useIsDemoApp from "@/hooks/useIsDemoApp";
import { FC } from "react";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();

  return <>{isDemoMode ? <SetOperationsDemo /> : <div>Coming soon</div>}</>;
};

export default SetOperationsApp;
