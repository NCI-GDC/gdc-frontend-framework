//@ts-check

// eslint-disable-next-line  @typescript-eslint/no-var-requires
const plugin = require("tailwindcss/plugin");

// define NCI colors so all at 10 color pallets
// note addition of vivid, white, black to "pad" the
// nci color to 10 colors
const basePath = process.env.NEXT_PUBLIC_BASEPATH;
const nciGray = {
  max: "#FFFFFF",
  lightest: "#f1f1f1",
  lighter: "#c5c5c5",
  light: "#9b9b9b",
  DEFAULT: "#706f6f",
  dark: "#606060",
  darker: "#414150",
  darkest: "#38393a",
  ink: "#1b1b1b",
  min: "#000000",
};

const nciGrayContent = {
  max: "#FFFFFF",
  lightest: "#f1f1f1",
  lighter: "#c5c5c5",
  light: "#9b9b9b",
  DEFAULT: "#706f6f",
  dark: "#606060",
  darker: "#414150",
  darkest: "#38393a",
  ink: "#1b1b1b",
  min: "#000000",
};

const nciBlueContent = {
  max: "#FFFFFF",
  lightest: "#F8F9FA",
  lighter: "#c5c5c5",
  light: "#9b9b9b",
  DEFAULT: "#706f6f",
  dark: "#606060",
  darker: "#414150",
  darkest: "#00334D",
  ink: "#1b1b1b",
  min: "#000000",
};

const nciGrayContrast = {
  min: "#FFFFFF",
  darkest: "#f1f1f1",
  darker: "#f1f1f1",
  dark: "#f1f1f1",
  DEFAULT: "#FFFFFF",
  vivid: "#f1f1f1",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const nciBlue = {
  max: "#ffffff",
  lightest: "#e9eff5",
  lighter: "#abc5db",
  light: "#6a9dc1",
  DEFAULT: "#2a72a5",
  vivid: "#3671A8",
  dark: "#256492",
  darker: "#1d567e",
  darkest: "#0f4163",
  min: "#11324A",
};

const nciBlueContrast = {
  min: "#FFFFFF",
  darkest: "#f1f1f1",
  darker: "#f1f1f1",
  dark: "#f1f1f1",
  DEFAULT: "#f1f1f1",
  vivid: "#000000",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const nciRed = {
  max: "#ffffff",
  lightest: "#f9e7ed",
  lighter: "#e3a5b3",
  light: "#cf5f78",
  DEFAULT: "#bb0e3d",
  vivid: "#d01145",
  dark: "#a31836",
  darker: "#8a0e2a",
  darkest: "#6a0019",
  min: "#3D000E",
};

const nciRedContrast = {
  min: "#FFFFFF",
  darkest: "#f1f1f1",
  darker: "#f1f1f1",
  dark: "#f1f1f1",
  DEFAULT: "#f1f1f1",
  vivid: "#f1f1f1",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const nciBlumine = {
  max: "#ffffff",
  lightest: "#e9eff3",
  lighter: "#a3bfcf",
  light: "#648fab",
  DEFAULT: "#1c5e86",
  vivid: "#2884BD",
  dark: "#155276",
  darker: "#0c4564",
  darkest: "#00314c",
  min: "#001926",
};

const nciBlumineContrast = {
  min: "#FFFFFF",
  darkest: "#f1f1f1",
  darker: "#f1f1f1",
  dark: "#f1f1f1",
  DEFAULT: "#f1f1f1",
  vivid: "#000000",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const nciTeal = {
  max: "#ffffff",
  lightest: "#e9f5f7",
  lighter: "#a5d5d9",
  light: "#64b7db",
  DEFAULT: "#0d95a1",
  vivid: "#0FB1BF",
  dark: "#82368C",
  darker: "#227991",
  darkest: "#135f73",
  min: "#0C3945",
};

const nciTealContrast = {
  min: "#FFFFFF",
  darkest: "#f1f1f1",
  darker: "#ffffff",
  dark: "#000000",
  DEFAULT: "#000000",
  vivid: "#000000",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const nciCyan = {
  max: "#ffffff",
  lightest: "#ebf5f9",
  lighter: "#add9e5",
  light: "#72bdd1",
  DEFAULT: "#319fbe",
  vivid: "#37B2D4",
  dark: "#2b8ba7",
  darker: "#227991",
  darkest: "#135f73",
  min: "#092A33",
};

const nciCyanContrast = {
  min: "#FFFFFF",
  darkest: "#f1f1f1",
  darker: "#ffffff",
  dark: "#111111",
  DEFAULT: "#000000",
  vivid: "#000000",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const nciGreen = {
  max: "#ffffff",
  lightest: "#edf7f5",
  lighter: "#b3e5d5",
  light: "#7cd1b4",
  DEFAULT: "#4dbc97",
  vivid: "#5CE0B4",
  dark: "#3ca582",
  darker: "#318f71",
  darkest: "#1e7158",
  min: "#0F382C",
};

const nciViolet = {
  max: "#ffffff",
  lightest: "#efeff5",
  lighter: "#bfb9db",
  light: "#8f85bf",
  DEFAULT: "#6254a3",
  vivid: "#7A69C9",
  dark: "#564990",
  darker: "#4a3d7d",
  darkest: "#392b62",
  min: "#1F1836",
};

const nciPurple = {
  max: "#ffffff",
  lightest: "#f1e9f3",
  lighter: "#cdadd1",
  light: "#a76eaf",
  DEFAULT: "#82368c",
  vivid: "#AD49BA",
  dark: "#742d7c",
  darker: "#64226b",
  darkest: "#4e1154",
  min: "#1F1836",
};

const nciOrange = {
  max: "#ffffff",
  lightest: "#fdefeb",
  lighter: "#f9bfaa",
  light: "#f38f6a",
  DEFAULT: "#ff5f00",
  vivid: "#ff5f00",
  dark: "#d1541d",
  darker: "#b34715",
  darkest: "#8d3503",
  min: "#471B01",
};

const nciYellow = {
  max: "#ffffff",
  lightest: "#fff9e8",
  lighter: "#ffe296",
  light: "#ffd056",
  DEFAULT: "#ffbf17",
  vivid: "#FFB700",
  dark: "#d9a214",
  darker: "#bf8f11",
  darkest: "#8c690d",
  min: "#4D3907",
};

const nciYellowContrast = {
  min: "#FFFFFF",
  darkest: "#FFFFFF",
  darker: "#1b1b1b",
  dark: "#1b1b1b",
  DEFAULT: "#000000",
  vivid: "#000000",
  light: "#1b1b1b",
  lighter: "#1b1b1b",
  lightest: "#1b1b1b",
  max: "#000000",
};

const gdcGrey = {
  // gray
  max: "#FFFFFF",
  lightest: "#f0f0f0",
  lighter: "#e6e6e6",
  light: "#adadad",
  DEFAULT: "#757575",
  vivid: "#9f9f9f",
  dark: "#5c5c5c",
  darker: "#454545",
  darkest: "#2e2e2e",
  min: "#1a1a1a",
};

// red-cool-vivid
const gdcRed = {
  max: "#fff9fb",
  lightest: "#fff2f5",
  lighter: "#f8dfe2",
  light: "#fd8ba0",
  DEFAULT: "#e41d3d",
  vivid: "#ef183a",
  dark: "#b21d38",
  darker: "#822133",
  darkest: "#4f1c24",
  min: "#230c0e",
};

const gdcBlue = {
  // blue
  max: "#f8fcff",
  lightest: "#eff6fb",
  lighter: "#d9e8f6",
  light: "#73b3e7",
  DEFAULT: "#2378c3",
  vivid: "#298fe8",
  dark: "#2c608a",
  darker: "#274863",
  darkest: "#1f303e",
  min: "#111a23",
};

const gdcBlueWarm = {
  // blue-warm
  max: "#ecf1f7",
  lightest: "#ecf1f7",
  lighter: "#e1e7f1",
  light: "#98afd2",
  DEFAULT: "#4a77b4",
  vivid: "#4a87dc",
  dark: "#345d96",
  darker: "#2f4668",
  darkest: "#252f3e",
  min: "#ecf1f7",
};

const gdcCyan = {
  // cyan
  max: "#f5fafc",
  lightest: "#e7f6f8",
  lighter: "#ccecf2",
  light: "#5dc0d1",
  DEFAULT: "#168092",
  vivid: "#1ca7be",
  dark: "#2a646d",
  darker: "#2c4a4e",
  darkest: "#203133",
  min: "#11191a",
};

const gdcCyanVivid = {
  // cyan vivid
  max: "#ecf1f7",
  lightest: "#e5faff",
  lighter: "#a8f2ff",
  light: "#00bde3",
  DEFAULT: "#0081a1",
  vivid: "#01a7d0",
  dark: "#00687d",
  darker: "#0e4f5c",
  darkest: "#093b44",
  min: "#051e21",
};
// NCI Secondary Palette
const gdcGreen = {
  // mint
  max: "#e9f6f4",
  lightest: "#dbf6ed",
  lighter: "#c7efe2",
  light: "#5abf95",
  DEFAULT: "#2e8367",
  vivid: "#39a985",
  dark: "#286846",
  darker: "#204e34",
  darkest: "#193324",
  min: "#112118",
};

const gdcIndigo = {
  // indigo-warm
  max: "#f4f4fc",
  lightest: "#f1eff7",
  lighter: "#e7e3fa",
  light: "#afa5e8",
  DEFAULT: "#7665d1",
  vivid: "#7f6de8",
  dark: "#5e519e",
  darker: "#453c7b",
  darkest: "#2e2c40",
  min: "#1b1a26",
};

const gdcViolet = {
  // violet-warm
  max: "#f7f2f8",
  lightest: "#f8f0f9",
  lighter: "#f6dff8",
  light: "#d29ad8",
  DEFAULT: "#b04abd",
  vivid: "#c452d2",
  dark: "#864381",
  darker: "#5c395a",
  darkest: "#382936",
  min: "#251c24",
};

const gdcOrange = {
  // orange-warm-vivid
  max: "#fdf8f4",
  lightest: "#fff3ea",
  lighter: "#ffe2d1",
  light: "#fc906d",
  DEFAULT: "#cf4900",
  dark: "#a72f10",
  darker: "#782312",
  darkest: "#3d231d",
  min: "#2f1c18",
};

const gdcYellow = {
  // yellow-vivid
  max: "#fcf7de",
  lightest: "#fff5c2",
  lighter: "#fee685",
  light: "#ddaa01",
  DEFAULT: "#947100",
  vivid: "#e1b10f",
  dark: "#776017",
  darker: "#5c4809",
  darkest: "#422d19",
  min: "#231910",
};

const utility = {
  link: "#155276",
  success: "#318f71",
  warning: "#d9a214",
  error: "#8a0e2a",
  emergency: "#6a0019",
  info: "#1c5e86",
  category1: "#1c5e86",
  category2: "#d1541d",
  category3: "#564990",
  category4: "#4dbc97",
};

const utilityContrast = {
  link: "#f1f1f1",
  success: "#000000",
  warning: "#1b1b1b",
  error: "#f1f1f1",
  emergency: "#f1f1f1",
  info: "#f1f1f1",
  category1: "#f1f1f1",
  category2: "#000000",
  category3: "#f1f1f1",
  category4: "#1b1b1b",
};

const pastelBase = {
  colors: {
    max: "#ffe1cb",
    lightest: "#ffc7b1",
    lighter: "#f0ae98",
    light: "#d6947e",
    DEFAULT: "#bd7b65",
    vivid: "#c8755a",
    dark: "#a76048",
    darker: "#844b38",
    darkest: "#603729",
    min: "#3c221a",
  },
  contrast: {
    max: "#111111",
    lightest: "#111111",
    lighter: "#111111",
    light: "#111111",
    DEFAULT: "#111111",
    vivid: "#111111",
    dark: "#fefefe",
    darker: "#fefefe",
    darkest: "#fefefe",
    min: "#fefefe",
  },
};
const pastelPrimary = {
  colors: {
    max: "#ededff",
    lightest: "#d3d3ff",
    lighter: "#babaf5",
    light: "#a0a0db",
    DEFAULT: "#8787c2",
    vivid: "#7e7ecb",
    dark: "#6565b1",
    darker: "#4c4c96",
    darkest: "#3b3b75",
    min: "#2a2a53",
  },
  contrast: {
    max: "#111111",
    lightest: "#111111",
    lighter: "#111111",
    light: "#111111",
    DEFAULT: "#111111",
    vivid: "#111111",
    dark: "#fefefe",
    darker: "#fefefe",
    darkest: "#fefefe",
    min: "#fefefe",
  },
};
const pastelSecondary = {
  colors: {
    max: "#ffc1b3",
    lightest: "#f9a799",
    lighter: "#e08e80",
    light: "#c67466",
    DEFAULT: "#ad5b4d",
    vivid: "#b95240",
    dark: "#8a483d",
    darker: "#66362e",
    darkest: "#43231e",
    min: "#20110e",
  },
  contrast: {
    max: "#111111",
    lightest: "#111111",
    lighter: "#111111",
    light: "#111111",
    DEFAULT: "#fefefe",
    vivid: "#fefefe",
    dark: "#fefefe",
    darker: "#fefefe",
    darkest: "#fefefe",
    min: "#fefefe",
  },
};
const pastelAccent = {
  colors: {
    max: "#c3efff",
    lightest: "#a9d5ff",
    lighter: "#90bcee",
    light: "#76a2d4",
    DEFAULT: "#5d89bb",
    vivid: "#5288c6",
    dark: "#4470a1",
    darker: "#35577d",
    darkest: "#263e59",
    min: "#162536",
  },
  contrast: {
    max: "#111111",
    lightest: "#111111",
    lighter: "#111111",
    light: "#111111",
    DEFAULT: "#111111",
    vivid: "#111111",
    dark: "#fefefe",
    darker: "#fefefe",
    darkest: "#fefefe",
    min: "#fefefe",
  },
};
const pastelChart = {
  colors: {
    max: "#8c8dba",
    lightest: "#7273a0",
    lighter: "#595a87",
    light: "#3f406d",
    DEFAULT: "#262754",
    vivid: "#20215a",
    dark: "#161731",
    darker: "#06060e",
    darkest: "#000000",
    min: "#000000",
  },
  contrast: {
    max: "#111111",
    lightest: "#000000",
    lighter: "#fefefe",
    light: "#fefefe",
    DEFAULT: "#fefefe",
    vivid: "#fefefe",
    dark: "#fefefe",
    darker: "#fefefe",
    darkest: "#fefefe",
    min: "#fefefe",
  },
};

const V2Secondary = {
  max: "#E8F3F6",
  lightest: "#C0DDE5",
  lighter: "#98C6D3",
  light: "#71AFC0",
  DEFAULT: "#267F98",
  vivid: "#4B97AC",
  dark: "#1B6478",
  darker: "#124857",
  darkest: "#00314c",
  min: "#030D10",
};

const V2SecondaryContrast = {
  max: "#030D10",
  lightest: "#0A2B34",
  lighter: "#333333",
  light: "#414141",
  DEFAULT: "#ffffff",
  vivid: "#c4c4c4",
  dark: "#71AFC0",
  darker: "#98C6D3",
  darkest: "#ffffff",
  min: "#ffffff",
};

const V2Accent = {
  max: "#FBEDE6",
  lightest: "#F3CDBB",
  lighter: "#EAAD91",
  light: "#E08D68",
  DEFAULT: "#D46E40",
  vivid: "#C7501A",
  dark: "#9E3D11",
  darker: "#722A0A",
  darkest: "#451804",
  min: "#160701",
};

const V2AccentContrast = {
  max: "#111111",
  lightest: "#111111",
  lighter: "#111111",
  light: "#111111",
  DEFAULT: "#ffffff",
  vivid: "#FFFFFF",
  dark: "#FFFFFF",
  darker: "#FFFFFF",
  darkest: "#FFFFFF",
  min: "#FFFFFF",
};

const V2AccentCool = {
  max: "#E9F4F1",
  lightest: "#C1DED6",
  lighter: "#9FDFC9",
  light: "#39B588",
  DEFAULT: "#2A836A",
  vivid: "#2A836A",
  dark: "#217657",
  darker: "#154B3B",
  darkest: "#0C2D23",
  min: "#030E0B",
};

const v2AccentCoolContent = {
  max: "#EBF8FB",
  lightest: "#D5EBF1",
  lighter: "#A5DBE8",
  light: "#84CCDD",
  DEFAULT: "#64BCD2",
  vivid: "#44acc5",
  dark: "#32879B",
  darker: "#226170",
  darkest: "#133A43",
  min: "#061215",
};

// got these from v1 (portal-ui)
// https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/theme/versions/active.ts#L88
const vep = {
  high: "rgb(185, 36, 36)",
  moderate: "#634d0c",
  modifier: "#634d0c",
  low: "#015c0a",
};

const sift = {
  deleterious: "rgb(185, 36, 36)",
  deleterious_low_confidence: "#634d0c",
  tolerated: "#634d0c",
  tolerated_low_confidence: "#015c0a",
};

const polyphen = {
  benign: "#015c0a",
  possibly_damaging: "#634d0c",
  probably_damaging: "rgb(185, 36, 36)",
  unknown: "rgb(107,98,98)",
};

const impact = {
  vep,
  sift,
  polyphen,
};

module.exports = {
  important: "#__next",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-gdc-survival-0",
    "bg-gdc-survival-1",
    "bg-gdc-survival-2",
    "bg-gdc-survival-3",
    "bg-gdc-survival-4",
    "bg-gdc-survival-5",
    "bg-gdc-survival-6",
    "bg-gdc-survival-7",
    "bg-gdc-survival-8",
    "bg-gdc-survival-9",
    "text-gdc-survival-0",
    "text-gdc-survival-1",
    "text-gdc-survival-2",
    "text-gdc-survival-3",
    "text-gdc-survival-4",
    "text-gdc-survival-5",
    "text-gdc-survival-6",
    "text-gdc-survival-7",
    "text-gdc-survival-8",
    "text-gdc-survival-9",
  ],
  theme: {
    extend: {
      screens: {
        "Custom-Repo-Width": "1370px",
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
        "gdc-survival": {
          0: "#1F77B4",
          1: "#BD5800",
          2: "#258825",
          3: "#D62728",
          4: "#8E5FB9",
          5: "#8C564B",
          6: "#D42BA1",
          7: "#757575",
          8: "#7A7A15",
          9: "#10828E",
        },
        focusColor: "rgb(39, 93, 197)",
        hoverColor: "#E8F0E2",
        activeColor: "#204461",
        "percentage-bar": {
          base: "#d5e8e1",
          complete: "#249c4f",
          label: "#111111",
        },
        summarybar: {
          text: "#42346F",
          "icon-background": "#FBD5C7",
          border: "#C5E3DF",
          borderAlt: "#F0E4CB",
        },
        warningColor: "#FFAD0D", //orangish
        warningColorText: "#976F21", //lighter orangish
        cartDarkerOrange: "#C7501A",
        cartLighterOrange: "#C7501A33",
        linkDarkerColor: "#1D6796",
        emptyIconLighterColor: "#e0e9f0",
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
        coretools: "400px",
        tools: "188px",
      },
      gridTemplateColumns: {
        "2flex1": "1fr auto",
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
      variants: {
        textColor: ["responsive", "hover", "focus", "group-hover"],
        extend: {},
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
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),

    plugin(function ({ addVariant }) {
      // add mantine.dev variants
      addVariant("data-checked", "&[data-checked]");
      addVariant("data-active", "&[data-active]");
      addVariant("data-selected", "&[data-selected]");
      addVariant("data-hovered", "&[data-hovered]");
      addVariant("data-disabled", "&[data-disabled]");
      addVariant("data-in-range", "&[data-in-range]");
      addVariant("data-first-in-range", "&[data-first-in-range]");
      addVariant("data-last-in-range", "&[data-last-in-range]");
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".nextImageFillFix": {
          width: "auto !important",
          right: "auto !important",
          "min-width": "0 !important",
        },
      };
      addUtilities(newUtilities);
    }),
    /**
     * Color theme follows USWGS Color Tokens https://designsystem.digital.gov/design-tokens/color/theme-tokens/
     * with an addition of content and contrast colors
     * Note: the contrast color is defined to be a 508 compliant contrast
     * so while primary-darker is a darker version of primary
     * primary-contrast-darker is lighter but is named to match the primary color shade
     * the content variant allows finder control over the theme but at the risk of creating 508 contrast errors
     * Any component using content should be checked.
     */
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("tailwindcss-themer")({
      defaultTheme: {
        extend: {
          colors: {
            base: nciGray,
            "base-content": nciGrayContent,
            "base-contrast": nciGrayContrast,
            primary: nciBlue,
            "primary-content": nciBlueContent,
            "primary-contrast": nciBlueContrast,
            secondary: V2Secondary,
            "secondary-content": nciGrayContent,
            "secondary-contrast": V2SecondaryContrast,
            accent: V2Accent,
            "accent-content": nciGrayContent,
            "accent-contrast": V2AccentContrast,
            "accent-warm": nciYellow,
            "accent-warm-content": nciGrayContent,
            "accent-warm-contrast": nciYellowContrast,
            "accent-cool": V2AccentCool,
            "accent-cool-content": v2AccentCoolContent,
            "accent-cool-contrast": nciCyanContrast,
            chart: nciTeal,
            "chart-contrast": nciTealContrast,
            utility: utility,
            "utility-contrast": utilityContrast,
            impact: impact,
          },
        },
      },
      themes: [
        {
          name: "invert-primary",
          extend: {
            colors: {
              base: nciGray,
              "base-content": nciGrayContent,
              "base-contrast": nciGrayContrast,
              primary: nciRed,
              "primary-content": nciGrayContent,
              "primary-contrast": nciRedContrast,
              secondary: nciBlue,
              "secondary-content": nciGrayContent,
              "secondary-contrast": nciBlueContrast,
              accent: nciBlumine,
              "accent-content": nciGrayContent,
              "accent-contrast": nciBlumineContrast,
              "accent-warm": nciYellow,
              "accent-warm-content": nciGrayContent,
              "accent-warm-contrast": nciYellowContrast,
              "accent-cool": nciCyan,
              "accent-cool-content": nciGrayContent,
              "accent-cool-contrast": nciCyanContrast,
              chart: nciTeal,
              "chart-contrast": nciTealContrast,
              utility: utility,
              "utility-contrast": utilityContrast,
            },
          },
        },
        {
          name: "pastel",
          extend: {
            colors: {
              base: pastelBase.colors,
              "base-content": nciGrayContent,
              "base-contrast": pastelBase.contrast,
              primary: pastelPrimary.colors,
              "primary-content": nciGrayContent,
              "primary-contrast": pastelPrimary.contrast,
              secondary: pastelSecondary.colors,
              "secondary-content": nciGrayContent,
              "secondary-contrast": pastelSecondary.contrast,
              accent: pastelAccent.colors,
              "accent-content": nciGrayContent,
              "accent-contrast": pastelAccent.contrast,
              "accent-warm": nciYellow,
              "accent-warm-content": nciGrayContent,
              "accent-warm-contrast": nciYellowContrast,
              "accent-cool": nciCyan,
              "accent-cool-content": nciGrayContent,
              "accent-cool-contrast": nciCyanContrast,
              chart: pastelChart.colors,
              "chart-contrast": pastelChart.contrast,
              utility: utility,
              "utility-contrast": utilityContrast,
            },
          },
        },
      ],
    }),
  ],
};
