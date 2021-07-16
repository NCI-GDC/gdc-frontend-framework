import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { CoreContext, coreStore } from "./store";

export const CoreProvider: React.FC<unknown> = ({children}: PropsWithChildren<unknown>) => {
  return (
    <Provider store={coreStore} context={CoreContext}>
      {children}
    </Provider>
  );
};