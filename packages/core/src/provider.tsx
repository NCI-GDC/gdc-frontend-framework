import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { coreStore } from "./store";

const persistor = persistStore(coreStore);

export const CoreProvider: ({
  children,
}: PropsWithChildren<unknown>) => React.JSX.Element = ({
  children,
}: PropsWithChildren<unknown>) => {
  return (
    <Provider store={coreStore}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export { persistor };
