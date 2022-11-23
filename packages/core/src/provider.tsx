import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { coreStore, persistor } from "./store";
import { CoreContext } from "./hooks";

export const CoreProvider: React.FC<unknown> = ({
  children,
}: PropsWithChildren<unknown>) => {
  return (
    <Provider store={coreStore} context={CoreContext}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
