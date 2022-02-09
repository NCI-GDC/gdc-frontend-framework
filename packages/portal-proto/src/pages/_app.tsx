import "../styles/globals.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { CoreProvider } from "@gff/core";
import { TourProvider } from "@reactour/tour";
import { Badge } from "@mantine/core";

import store from "../app/store";

// import gdc apps here.
// their default exports will trigger registration.
import "../features/demoApp1/DemoApp";
import "../features/demoApp2/DemoApp";

// import the react tab styles once
import "react-tabs/style/react-tabs.css";

// ReactModal needs the app element set for a11y reasons.
// It hides the main application from screen readers while modals are open.
import ReactModal from "react-modal";
ReactModal.setAppElement("#__next");

const steps = [
  {
    selector: '#build-header-button',
    content: 'Create a cohort group',
  },
  {
    selector: '#view-header-button',
    content: 'View studies'
  }
];

function CustomBadge({ children }) {
  return (<Badge>{children}</Badge>)
}

const PortalApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <CoreProvider>
      <Provider store={store}>
        <TourProvider steps={steps} components={{ Badge: CustomBadge }}>
          <Component {...pageProps} />
        </TourProvider>
      </Provider>
    </CoreProvider>
  );
};

export default PortalApp;
