import React from "react";
import { Provider } from "react-redux";

import { CoreContext, coreStore } from "./store";

export const CoreProvider: React.FC = ({children}) => {
  return (
    <Provider store={coreStore} context={CoreContext}>
      {children}
    </Provider>
  );
};