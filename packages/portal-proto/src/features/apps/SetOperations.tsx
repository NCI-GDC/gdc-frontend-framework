import { useRouter } from "next/router";
import { FC } from "react";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";

const SetOperationsApp: FC = () => {
  const {
    query: { demoMode },
  } = useRouter();
  const isDemoMode = demoMode === "true" ? true : false;

  return <>{isDemoMode ? <SetOperationsDemo /> : <div>Coming soon</div>}</>;
};

export default SetOperationsApp;
