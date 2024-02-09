import tailwindConfig from "../../tailwind.config";
import store from "../app/store";
import "../styles/globals.css";
import "../styles/survivalplot.css";
import "@/features/genomic/registerApp";
// import gdc apps here.
// their default exports will trigger registration.
import "@/features/projectsCenter/registerApp";
import "@/features/repositoryApp/registerApp";
import { datadogRum } from "@datadog/browser-rum";
import { CoreProvider } from "@gff/core";
import {
  MantineProvider,
  createEmotionCache,
  EmotionCache,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import "@nci-gdc/sapien/dist/bodyplot.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import React, { useEffect } from "react";
// ReactModal needs the app element set for a11y reasons.
// It hides the main application from screen readers while modals are open.
import ReactModal from "react-modal";
import { Provider } from "react-redux";
// import the React tab styles once
import "react-tabs/style/react-tabs.css";
import {
  entityMetadataType,
  SummaryModalContext,
  URLContext,
} from "src/utils/contexts";
import { Notifications } from "@mantine/notifications";

if (process.env.NODE_ENV !== "test") ReactModal.setAppElement("#__next");

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
  });

  const defaultTailwindColorTheme =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme.extend.colors;

  return (
    <CoreProvider>
      <Provider store={store}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={getCache()}
          theme={{
            // use V2 font in MantineProvider
            fontFamily: "Montserrat, Noto Sans, sans-serif",
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
                Object.entries(defaultTailwindColorTheme).map(
                  ([key, values]) => [key, Object.values(values)],
                ),
              ),
            },
            primaryColor: "primary",
            primaryShade: { light: 4, dark: 7 },
            breakpoints: {
              xs: "31.25em",
              sm: "50em",
              md: "62.5em",
              lg: "80em",
              xl: "112.5em",
            },
            components: {
              TextInput: {
                defaultProps: {
                  styles: {
                    input: {
                      fontFamily: '"Noto Sans", "sans-serif"',
                    },
                  },
                },
              },
              Input: {
                defaultProps: {
                  styles: {
                    input: {
                      fontFamily: '"Noto Sans", "sans-serif"',
                    },
                  },
                },
              },
              Tooltip: {
                defaultProps: {
                  arrowSize: 10,
                  classNames: {
                    tooltip:
                      "bg-base-min bg-opacity-90 text-base-max shadow-lg font-content font-medium text-sm",
                    arrow: "bg-base-min bg-opacity-90",
                  },
                  events: {
                    focused: true,
                  },
                  withinPortal: true,
                  position: "bottom",
                },
              },
              Portal: {
                defaultProps: {
                  target: "#__next",
                },
              },
              Menu: {
                defaultProps: {
                  zIndex: 1,
                  classNames: {
                    item: "text-base-min disabled:opacity-50 data-hovered:bg-accent-lightest data-hovered:text-accent-contrast-lightest",
                  },
                },
              },
              Modal: {
                defaultProps: {
                  zIndex: 400,
                  radius: "md",
                  closeButtonProps: { "aria-label": "Close Modal" },
                  styles: {
                    header: {
                      borderColor: defaultTailwindColorTheme.base.lighter,
                      borderStyle: "solid",
                      borderWidth: "0px 0px 2px 0px",
                      padding: "15px 15px 5px 15px",
                      margin: "5px 5px 10px 5px",
                    },
                    title: {
                      color:
                        defaultTailwindColorTheme["primary-content"].darkest,
                      fontFamily: '"Montserrat", "sans-serif"',
                      fontSize: "1.65em",
                      fontWeight: 500,
                      letterSpacing: ".1rem",
                      textTransform: "uppercase",
                    },
                    body: {
                      padding: 0,
                    },
                    modal: {
                      backgroundColor: defaultTailwindColorTheme.base.max,
                    },
                    close: {
                      backgroundColor: defaultTailwindColorTheme.base.lightest,
                      color:
                        defaultTailwindColorTheme["primary-content"].darkest,
                    },
                  },
                  classNames: {
                    modal: "drop-shadow-lg",
                  },
                },
              },
              Drawer: {
                defaultProps: {
                  target: "#__next",
                  zIndex: 1000,
                },
              },
            },
          }}
        >
          <div
            className={`${
              theme !== "default" ? theme : null
            } color-transition duration-500`}
          >
            <URLContext.Provider value={{ prevPath, currentPath }}>
              <SummaryModalContext.Provider
                value={{
                  entityMetadata,
                  setEntityMetadata,
                }}
              >
                <Notifications position="top-center" autoClose={6000} />
                <Component {...pageProps} />
              </SummaryModalContext.Provider>
            </URLContext.Provider>
            <Head>
              <script src="https://assets.adobedtm.com/6a4249cd0a2c/073fd0859f8f/launch-39d47c17b228.min.js" />
            </Head>

            <script>{`_satellite.pageBottom()`}</script>
          </div>
        </MantineProvider>
      </Provider>
    </CoreProvider>
  );
};

export default PortalApp;
