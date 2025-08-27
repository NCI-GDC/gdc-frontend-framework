import React from "react";
import { AppContext, CohortNotificationProvider } from "@gff/portal-components";
import type {
  ImageComponentType,
  LinkComponentType,
} from "@gff/portal-components";
import { createTheme, MantineProvider, Modal } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import type { AppProps } from "next/app";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import tailwindConfig from "tailwind.config";
import "../styles/globals.css";

const defaultTailwindColorTheme =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme.extend.colors;

const EnclavePortalApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}: AppProps) => {
  const theme = createTheme({
    fontFamily: "Montserrat, Noto Sans, sans-serif",
    colors: {
      blue: Object.values(
        tailwindConfig.theme.extend.colors["nci-blue"],
      ) as any,
      gray: Object.values(
        tailwindConfig.theme.extend.colors["nci-gray"],
      ) as any,
      ...Object.fromEntries(
        Object.entries(defaultTailwindColorTheme).map(([key, values]) => [
          key,
          Object.values(values as any),
        ]),
      ),
    },
    primaryColor: "primary",
    primaryShade: { light: 4, dark: 7 },
    components: {
      ActionIcon: {
        defaultProps: {
          variant: "default",
        },
      },
      Drawer: {
        defaultProps: {
          target: "#__next",
          zIndex: 1000,
        },
      },
      Modal: Modal.extend({
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
              minHeight: "0",
            },
            title: {
              color: defaultTailwindColorTheme["primary-content"].darkest,
              fontFamily: '"Montserrat", "sans-serif"',
              fontSize: "1.65em",
              fontWeight: 500,
              letterSpacing: ".1rem",
              textTransform: "uppercase",
            },
            body: {
              padding: 0,
            },
            close: {
              backgroundColor: defaultTailwindColorTheme.base.lightest,
              color: defaultTailwindColorTheme["primary-content"].darkest,
            },
          },
        },
      }),
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
    },
  });

  const router = useRouter();

  return (
    <MantineProvider theme={theme}>
      <AppContext.Provider
        value={{
          Link: Link as LinkComponentType,
          Image: Image as ImageComponentType,
          path: router.pathname,
          theme,
        }}
      >
        <CohortNotificationProvider useSetActiveCohort={() => () => {}}>
          <Component {...pageProps} />
        </CohortNotificationProvider>
      </AppContext.Provider>
    </MantineProvider>
  );
};

export default EnclavePortalApp;
