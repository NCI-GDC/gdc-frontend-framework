//@ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const {
  nciGray,
  nciBlue,
  nciRed,
  nciBlumine,
  nciTeal,
  nciCyan,
  nciGreen,
  nciViolet,
  nciPurple,
  nciOrange,
  nciYellow,
  gdcGrey,
  gdcRed,
  gdcBlue,
  gdcBlueWarm,
  gdcCyan,
  gdcCyanVivid,
  gdcGreen,
  gdcIndigo,
  gdcViolet,
  gdcOrange,
  gdcYellow,
  defaultThemeColors,
} = require("./src/styles/colors");
const basePath = process.env.NEXT_PUBLIC_BASEPATH;

module.exports = {
  important: "#__next",
  content: ["../../node_modules/@gff/portal-components/dist/index.js"],
  theme: {
    extend: {
      screens: {
        "Custom-Repo-Width": "1420px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        /* These colors come from the NCI color palette. The palette defines
         * six primary and five secondary colors. The extended palette defines
         * nine shades lighter and nine shades darker for each of the primary
         * and secondary colors.
         *
         * This theme adds a named color for each of the primary and secondary
         * colors. The DEFAULT represent the value for those colors. The
         * shades from the extended palette are represented by the light,
         * lighter, lightest, dark, darker, and darkest modifiers. Each one
         * maps to every third shade.
         */

        // NCI Primary Palette
        "nci-gray": nciGray,
        "nci-red": nciRed,
        "nci-blumine": nciBlumine,
        "nci-blue": nciBlue,
        "nci-teal": nciTeal,
        "nci-cyan": nciCyan,
        // NCI Secondary Palette
        "nci-green": nciGreen,
        "nci-violet": nciViolet,
        "nci-purple": nciPurple,
        "nci-orange": nciOrange,
        "nci-yellow": nciYellow,
        "gdc-grey": gdcGrey,
        "gdc-red": gdcRed,
        "gdc-blue": gdcBlue,
        "gdc-blue-warm": gdcBlueWarm,
        "gdc-cyan": gdcCyan,
        "gdc-cyan-vivid": gdcCyanVivid,
        // NCI Secondary Palette
        "gdc-green": gdcGreen,
        "gdc-indigo": gdcIndigo,
        "gdc-violet": gdcViolet,
        "gdc-orange": gdcOrange,
        "gdc-yellow": gdcYellow,
        ...defaultThemeColors,
      },
      minHeight: {
        "screen-60vh": "60vh",
        "screen-50vh": "50vh",
      },
      maxHeight: {
        "screen-90vh": "90vh",
        "screen-60vh": "60vh",
      },
      height: {
        "nci-logo": "54px",
        "nci-logo-mobile": "28px",
        "screen/1.5": "75vh",
        "screen/2": "50vh",
        "screen/3": "calc(100vh / 3)",
        "screen/4": "calc(100vh / 4)",
        "screen/5": "calc(100vh / 5)",
        "img-viewer": "550px",
      },
      width: {
        "screen/1.5": "75vw",
        "screen/2": "50vw",
        "screen/3": "calc(100vw / 3)",
        "screen/4": "calc(100vw / 4)",
        "screen/5": "calc(100vw / 5)",
      },
      flexBasis: {
        "tools-sm": "296px",
        "tools-md": "350px",
        coretools: "400px",
        tools: "188px",
      },
      gridTemplateColumns: {
        "2flex1": "1fr auto",
        "footer-large": "1.5fr 1fr 1fr 1fr",
        "footer-small": "2fr 1fr",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
        content: ["Noto Sans", "sans-serif"],
        "content-noto": ["Noto Sans", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": `url(${basePath}/homepage/hero-background.svg)`,
        "mid-pattern": `url(${basePath}/homepage/hp-bg-mid.svg)`,
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        1: "1px",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      transitionProperty: {
        height: "height",
      },
      fontSize: {
        "2xs": ".85rem",
      },
      opacity: {
        15: ".15",
      },
      boxShadow: {
        "3xl": "0 0 5px 2px rgba(0, 0, 0, 0.25)",
        inset: "inset 0 0 20px 5px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translate(0, 100%)" },
          to: { transform: "translate(0, 0)" },
        },
        "slide-down": {
          from: { transform: "translate(0, 0)" },
          to: { transform: "translate(0, 100%)" },
        },
      },
      animation: {
        "slide-up": "slide-up 500ms ease-in-out ",
        "slide-down": "slide-down 500ms ease-in-out ",
      },
      lineHeight: {
        0: "0px",
      },
    },
  },
};
