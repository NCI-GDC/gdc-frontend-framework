import "../styles/globals.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { CoreProvider } from "@gff/core";

import store from "../app/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CoreProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </CoreProvider>
  );
}

export default MyApp;
