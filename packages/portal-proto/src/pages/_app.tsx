import "../styles/globals.css";
import "../styles/survivalplot.css";
import "../styles/oncogrid.css";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import Script from "next/script";
import { CoreProvider } from "@gff/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  MantineProvider,
  createEmotionCache,
  EmotionCache,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import store from "../app/store";
import tailwindConfig from "../../tailwind.config";

// import gdc apps here.
// their default exports will trigger registration.
import "@/features/projectsCenter/ProjectsCenter";
import "@/features/repositoryApp/RepositoryApp";
import "@/features/genomic/registerApp";
import "@/features/oncoGrid/registerApp";

// import the React tab styles once
import "react-tabs/style/react-tabs.css";

// ReactModal needs the app element set for a11y reasons.
// It hides the main application from screen readers while modals are open.
import ReactModal from "react-modal";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

if (process.env.NODE_ENV !== "test") ReactModal.setAppElement("#__next");

import { datadogRum } from "@datadog/browser-rum";
datadogRum.init({
  applicationId: "3faf9c0a-311f-4935-a596-3347666ef35d",
  clientToken: "pub9f7e31eaacd4afa71ac5161cbd5b0c11",
  site: "datadoghq.com",
  service: "portal-2.0",

  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 0,
  trackUserInteractions: true,
  trackFrustrations: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask",
});

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

const getCache = (): EmotionCache => {
  // Insert mantine styles after global styles
  const insertionPoint =
    typeof document !== "undefined"
      ? document.querySelectorAll<HTMLElement>(
          'style[data-emotion="css-global"]',
        )?.[-1]
      : undefined;

  return createEmotionCache({ key: "mantine", insertionPoint });
};

export type entityType = null | "project" | "case" | "file" | "ssms";
export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  entity_name: string;
}
export const SummaryModalContext = createContext<{
  entityMetadata: entityMetadataType;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null);

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

  const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
    entity_type: null,
    entity_id: null,
    entity_name: null,
  });
  return (
    <CoreProvider>
      <Provider store={store}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={getCache()}
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
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
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
              <NotificationsProvider position="top-center" zIndex={400}>
                <SummaryModalContext.Provider
                  value={{
                    entityMetadata,
                    setEntityMetadata,
                  }}
                >
                  <Component {...pageProps} />

                  <Script
                    src="https://static.cancer.gov/webanalytics/wa_gdc_pageload.js"
                    strategy="afterInteractive"
                  />
                </SummaryModalContext.Provider>
              </NotificationsProvider>
            </URLContext.Provider>
          </div>
        </MantineProvider>
      </Provider>
    </CoreProvider>
  );
};

export default PortalApp;
