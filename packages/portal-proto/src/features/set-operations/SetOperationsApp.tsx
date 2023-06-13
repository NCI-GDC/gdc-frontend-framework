import { FC } from "react";
import { PersistGate } from "redux-persist/integration/react";

import { useIsDemoApp } from "@/hooks/useIsDemoApp";

import { persistStore } from "redux-persist";
import { AppStore } from "./appApi";
import SetOperationsDemo from "../set-operations/SetOperationsDemo";
import SetOperationsForGenesSSMSCohorts from "../set-operations/SetOperationsForGenesSSMSCohorts";

const persistor = persistStore(AppStore);

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      <PersistGate persistor={persistor}>
        {isDemoMode ? (
          <SetOperationsDemo />
        ) : (
          <SetOperationsForGenesSSMSCohorts />
        )}
      </PersistGate>
    </>
  );
};

export default SetOperationsApp;
