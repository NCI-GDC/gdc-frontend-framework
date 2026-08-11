import {
  Button,
  createTheme,
  Modal,
  Switch,
  CSSVariablesResolver,
} from "@mantine/core";
import { defaultThemeColors, nciBlue, nciGray, utility } from "./colors";

import {
  TOOLTIP_Z_INDEX,
  MENU_Z_INDEX,
  DRAWER_Z_INDEX,
  MODAL_Z_INDEX,
  LOADING_OVERLAY_Z_INDEX,
  POPOVER_Z_INDEX,
} from "./zIndex";

export const cssVariablesResolver: CSSVariablesResolver = (_theme) => ({
  variables: {
    "--mantine-color-error": utility.error,
  },
  dark: {},
  light: {},
});

const theme = createTheme({
  // use V2 font in MantineProvider
  fontFamily: "Montserrat, Noto Sans, sans-serif",
  // Override default blue color until styles are determined
  colors: {
    blue: Object.values(nciBlue) as any,
    gray: Object.values(nciGray) as any,
    white: Array(10).fill("#ffffff") as any,
    // Add default color from tailwind config to Mantine theme
    // TODO: refactor how the configuration get loaded
    ...Object.fromEntries(
      Object.entries(defaultThemeColors).map(([key, values]) => [
        key,
        Object.values(values),
      ]),
    ),
  },
  primaryColor: "primary",
  primaryShade: { light: 4, dark: 7 },
  breakpoints: {
    xs: "31.25em",
    sm: "40em",
    md: "48em",
    lg: "64em",
    xl: "80em",
    "2xl": "96em",
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
    ActionIcon: {
      defaultProps: {
        variant: "default",
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
            "bg-base-min/90 text-base-max shadow-lg font-content font-medium text-sm",
          arrow: "bg-base-min/90",
        },
        events: {
          focused: true,
        },
        withinPortal: false,
        position: "bottom",
        zIndex: TOOLTIP_Z_INDEX,
      },
    },
    Portal: {
      defaultProps: {
        target: "#__next",
      },
    },
    Menu: {
      defaultProps: {
        zIndex: MENU_Z_INDEX,
        classNames: {
          item: "text-base-min disabled:opacity-50 hover:bg-accent-lightest hover:text-accent-contrast-lightest",
        },
        withinPortal: false,
      },
    },
    Select: {
      defaultProps: {
        comboboxProps: {
          withinPortal: false,
        },
      },
    },
    Modal: Modal.extend({
      defaultProps: {
        zIndex: MODAL_Z_INDEX,
        radius: "md",
        closeButtonProps: { "aria-label": "Close Modal" },
        styles: {
          header: {
            borderColor: defaultThemeColors.base.lighter,
            borderStyle: "solid",
            borderWidth: "0px 0px 2px 0px",
            padding: "15px 15px 5px 15px",
            margin: "5px 5px 10px 5px",
            minHeight: "0",
          },
          title: {
            color: defaultThemeColors["primary-content"].darkest,
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
            backgroundColor: defaultThemeColors.base.lightest,
            color: defaultThemeColors["primary-content"].darkest,
          },
        },
      },
    }),
    Drawer: {
      defaultProps: {
        target: "#__next",
        zIndex: DRAWER_Z_INDEX,
      },
    },
    Button: Button.extend({
      vars: (_, props) => {
        const tempButtonProps: any = {
          root: {},
          loader: {
            left: "20px",
            transformOrigin: "top 20px",
          },
        };
        if (props.loading) {
          tempButtonProps.inner = {
            opacity: "1",
            transform: "translateY(0)",
          };
          tempButtonProps.label = {
            opacity: "1",
          };
          tempButtonProps.section = {
            visibility: "hidden",
          };
        }

        return tempButtonProps;
      },
    }),
    Switch: Switch.extend({
      defaultProps: {
        withThumbIndicator: false,
      },
    }),
    LoadingOverlay: {
      defaultProps: {
        zIndex: LOADING_OVERLAY_Z_INDEX,
      },
    },
    Popover: {
      defaultProps: {
        withinPortal: false,
        zIndex: POPOVER_Z_INDEX,
      },
    },
  },
});

export default theme;
