import "../styles/globals.css";
import "../styles/survivalplot.css";
import "../styles/oncogrid.css";

import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { CoreProvider } from "@gff/core";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { TourProvider } from "@reactour/tour";
import { CustomBadge as Badge } from "../features/tour/CustomBadge";
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

const PortalApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <CoreProvider>
      <Provider store={store}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionOptions={{ key: 'mantine', prepend: false }} // Prevents style conflicts between Mantine and Tailwind by loading Mantine second
        theme={{  // Override default blue color until styles are determined
          colors: {
            blue: [
              '#bdbdbd',
              '#8a8a8a',
              '#b4b1b1',
              '#c0c0c0',
              '#bbbbbb',
              '#a6a6a6',
              '#a9a9a9',
              '#626060',
              '#a1a1a1',
              '#a1a1a1',
            ],
            gray: [
              '#dedede',
              '#f1f1f1',
              '#e7e7e7',
              '#dadada',
              '#c9c8c8',
              '#b9b9b9',
              '#bdbdbd',
              '#343434',
              '#919090',
              '#151515',
            ],

          }}}
      >
        <NotificationsProvider position="top-center">
          <TourProvider steps={[]} components={{ Badge }}>
            <Component {...pageProps} />
          </TourProvider>
        </NotificationsProvider>
        </MantineProvider>
      </Provider>
    </CoreProvider>
  );
};

export default PortalApp;
