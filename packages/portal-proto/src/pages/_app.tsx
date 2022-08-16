import "../styles/globals.css";
import "../styles/survivalplot.css";
import "../styles/oncogrid.css";
import { createContext, useState } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { CoreProvider } from "@gff/core";
import { useLocalStorage } from "@mantine/hooks";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { TourProvider } from "@reactour/tour";
import { CustomBadge as Badge } from "../features/tour/CustomBadge";
import store from "../app/store";
import tailwindConfig from "../../tailwind.config";

// import gdc apps here.
// their default exports will trigger registration.
import "../features/demoApp1/DemoApp";
import "../features/demoApp2/DemoApp";
import "@/features/repositoryApp/RepositoryApp";

// import the react tab styles once
import "react-tabs/style/react-tabs.css";

// ReactModal needs the app element set for a11y reasons.
// It hides the main application from screen readers while modals are open.
import ReactModal from "react-modal";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
ReactModal.setAppElement("#__next");

type TenStringArray = [
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
  string?,
];

export const URLContext = createContext({ prevPath: "", currentPath: "" });

const PortalApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [prevPath, setPrevPath] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [theme] = useLocalStorage({
    key: "color-scheme",
    defaultValue: "default",
  });
  useEffect(() => {
    setPrevPath(currentPath);
    setCurrentPath(globalThis.location.pathname + globalThis.location.search);
  }, [currentPath, router.asPath]);

  return (
    <CoreProvider>
      <Provider store={store}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            // Override default blue color until styles are determined
            colors: {
              blue: Object.values(
                tailwindConfig.theme.extend.colors["nci-blue"],
              ) as TenStringArray,
              gray: Object.values(
                tailwindConfig.theme.extend.colors["nci-gray"],
              ) as TenStringArray,
              white: [
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
                "#ffffff",
              ],
              // Add default color from tailwind config to Mantine theme
              // note that now getting colors from the tailwindcss-themer which assumes that plugin is last in the
              // plugins declaration.
              // TODO: refactor how the configuration get loaded
              ...Object.fromEntries(
                Object.entries(
                  tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                    .extend.colors,
                ).map(([key, values]) => [key, Object.values(values)]),
              ),
            },
            primaryColor: "primary",
            primaryShade: { light: 4, dark: 7 },
            breakpoints: {
              xs: 500,
              sm: 800,
              md: 1000,
              lg: 1275,
              xl: 1800,
            },
          }}
        >
          <div
            className={`${
              theme !== "default" ? theme : null
            } color-transition duration-500`}
          >
            <URLContext.Provider value={{ prevPath, currentPath }}>
              <NotificationsProvider position="top-center">
                <TourProvider steps={[]} components={{ Badge }}>
                  <Component {...pageProps} />
                </TourProvider>
              </NotificationsProvider>
            </URLContext.Provider>
          </div>
        </MantineProvider>
      </Provider>
    </CoreProvider>
  );
};

export default PortalApp;
