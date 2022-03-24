import "../styles/globals.css";
import "../styles/oncogrid.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { CoreProvider } from "@gff/core";
import { TourProvider } from "@reactour/tour";
import { CustomBadge as Badge } from "../features/tour/CustomBadge";
import store from "../app/store";

// import gdc apps here.
// their default exports will trigger registration.
import "../features/demoApp1/DemoApp";
import "../features/demoApp2/DemoApp";
import "../features/demoAppStore/DemoApp";

// import the react tab styles once
import "react-tabs/style/react-tabs.css";

// ReactModal needs the app element set for a11y reasons.
// It hides the main application from screen readers while modals are open.
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const PortalApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <CoreProvider>
      <Provider store={store}>
        <TourProvider steps={[]} components={{ Badge }}>
          <Component {...pageProps} />
        </TourProvider>
      </Provider>
    </CoreProvider>
  );
};

export default PortalApp;
