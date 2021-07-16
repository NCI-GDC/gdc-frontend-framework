import "../styles/globals.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { CoreProvider } from "@gff/core";

import store from "../app/store";

// import gdc apps here.
// their default exports will trigger registration.
import "../features/demoApp1/DemoApp";
import "../features/demoApp2/DemoApp";

function PortalApp({ Component, pageProps }: AppProps) {
  return (
    <CoreProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </CoreProvider>
  );
}

export default PortalApp;
