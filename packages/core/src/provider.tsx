import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { coreStore } from "./store";
import { CoreContext } from "./hooks";

export const CoreProvider: React.FC<unknown> = ({
  children,
}: PropsWithChildren<unknown>) => {
  const persistor = persistStore(coreStore);

  return (
    <Provider store={coreStore} context={CoreContext}>
      <PersistGate loading={null} persistor={persistor}>
        {/* https://github.com/vercel/next.js/issues/8240#issuecomment-647699316 */}
        {() => children}
      </PersistGate>
    </Provider>
  );
};
