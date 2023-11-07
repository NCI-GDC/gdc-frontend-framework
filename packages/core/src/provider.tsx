import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { coreStore } from "./store";
import { CoreContext } from "./hooks";

const persistor = persistStore(coreStore);

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

export { persistor };
