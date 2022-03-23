const plugin = require('tailwindcss/plugin');
module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
         * maps to a every third shade.
         */
        // NCI Primary Palette
        "nci-gray": {
          lightest: "#f1f1f1",
          lighter: "#c5c5c5",
          light: "#9b9b9b",
          DEFAULT: "#706f6f",
          dark: "#606060",
          darker: "#414150",
          darkest: "#38393a",
        },
        "nci-red": {
          lightest: "#f9e7ed",
          lighter: "#e3a5b3",
          light: "#cf5f78",
          DEFAULT: "#bb0e3d",
          dark: "#a31836",
          darker: "#8a0e2a",
          darkest: "#6a0019",
        },
        "nci-blumine": {
          lightest: "#e9eff3",
          lighter: "#a3bfcf",
          light: "#648fab",
          DEFAULT: "#1c5e86",
          dark: "#155276",
          darker: "#0c4564",
          darkest: "#00314c",
        },
        "nci-blue": {
          lightest: "#e9eff5",
          lighter: "#abc5db",
          light: "#6a9dc1",
          DEFAULT: "#2a72a5",
          dark: "#256492",
          darker: "#1d567e",
          darkest: "#0f4163",
        },
        "nci-teal": {
          lightest: "#e9f5f7",
          lighter: "#a5d5d9",
          light: "#64b7db",
          DEFAULT: "#0d95a1",
          dark: "#2b8ba7",
          darker: "#227991",
          darkest: "#135f73",
        },
        "nci-cyan": {
          lightest: "#ebf5f9",
          lighter: "#add9e5",
          light: "#72bdd1", //???
          DEFAULT: "#319fbe",
          dark: "#2b8ba7",
          darker: "#227991",
          darkest: "#135f73",
        },
        // NCI Secondary Palette
        "nci-green": {
          lightest: "#edf7f5",
          lighter: "#b3e5d5",
          light: "#7cd1b4",
          DEFAULT: "#4dbc97",
          dark: "#3ca582",
          darker: "#318f71",
          darkest: "#1e7158",
        },
        "nci-violet": {
          lightest: "#efeff5",
          lighter: "#bfb9db",
          light: "#8f85bf",
          DEFAULT: "#6254a3",
          dark: "#564990",
          darker: "#4a3d7d",
          darkest: "#392b62",
        },
        "nci-purple": {
          lightest: "#f1e9f3",
          lighter: "#cdadd1",
          light: "#a76eaf",
          DEFAULT: "#82368c",
          dark: "#742d7c",
          darker: "#64226b",
          darkest: "#4e1154",
        },
        "nci-orange": {
          lightest: "#fdefeb",
          lighter: "#f9bfaa",
          light: "#f38f6a",
          DEFAULT: "#ff5f00",
          dark: "#d1541d",
          darker: "#b34715",
          darkest: "#8d3503",
        },
        "nci-yellow": {
          lightest: "#fff9e8",
          lighter: "#ffe296",
          light: "#ffd056",
          DEFAULT: "#ffbf17",
          dark: "#d9a214",
          darker: "#bf8f11",
          darkest: "#8c690d",
        },
        "gdc-grey": {
          // gray
          lightest: "#f0f0f0",
          lighter: "#e6e6e6",
          light: "#adadad",
          DEFAULT: "#757575",
          dark: "#5c5c5c",
          darker: "#454545",
          darkest: "#2e2e2e",
        },
        "gdc-red": {
          // red-cool-vivid
          lightest: "#fff2f5",
          lighter: "#f8dfe2",
          light: "#fd8ba0",
          DEFAULT: "#e41d3d",
          dark: "#b21d38",
          darker: "#822133",
          darkest: "#4f1c24",
        },
        "gdc-blue": {
          // blue
          lightest: "#eff6fb",
          lighter: "#d9e8f6",
          light: "#73b3e7",
          DEFAULT: "#2378c3",
          dark: "#2c608a",
          darker: "#274863",
          darkest: "#1f303e",
        },
        "gdc-blue-warm": {
          // blue-warm
          lightest: "#ecf1f7",
          lighter: "#e1e7f1",
          light: "#98afd2",
          DEFAULT: "#4a77b4",
          dark: "#345d96",
          darker: "#2f4668",
          darkest: "#252f3e",
        },
        "gdc-cyan": {
          // cyan
          lightest: "#e7f6f8",
          lighter: "#ccecf2",
          light: "#5dc0d1",
          DEFAULT: "#168092",
          dark: "#2a646d",
          darker: "#2c4a4e",
          darkest: "#203133",
        },
        "gdc-cyan-vivid": {
          // cyan vivid
          lightest: "#e5faff",
          lighter: "#a8f2ff",
          light: "#00bde3",
          DEFAULT: "#0081a1",
          dark: "#00687d",
          darker: "#0e4f5c",
          darkest: "#093b44",
        },
        // NCI Secondary Palette
        "gdc-green": {
          // mint
          lightest: "#dbf6ed",
          lighter: "#c7efe2",
          light: "#5abf95",
          DEFAULT: "#2e8367",
          dark: "#286846",
          darker: "#204e34",
          darkest: "#193324",
        },
        "gdc-indigo": {
          // indigo-warm
          lightest: "#f1eff7",
          lighter: "#e7e3fa",
          light: "#afa5e8",
          DEFAULT: "#7665d1",
          dark: "#5e519e",
          darker: "#453c7b",
          darkest: "#2e2c40",
        },
        "gdc-violet": {
          // violet-warm
          lightest: "#f8f0f9",
          lighter: "#f6dff8",
          light: "#d29ad8",
          DEFAULT: "#b04abd",
          dark: "#864381",
          darker: "#5c395a",
          darkest: "#382936",
        },
        "gdc-orange": {
          // orange-warm-vivid
          lightest: "#fff3ea",
          lighter: "#ffe2d1",
          light: "#fc906d",
          DEFAULT: "#cf4900",
          dark: "#a72f10",
          darker: "#782312",
          darkest: "#3d231d",
        },
        "gdc-yellow": {
          // yellow-vivid
          lightest: "#fff5c2",
          lighter: "#fee685",
          light: "#ddaa01",
          DEFAULT: "#947100",
          dark: "#776017",
          darker: "#5c4809",
          darkest: "#422d19",
        },
      },
      height: {
        "nci-logo": "54px",
        "nci-logo-mobile": "28px",
        "screen/1.5": "75vh",
        "screen/2": "50vh",
        "screen/3": "calc(100vh / 3)",
        "screen/4": "calc(100vh / 4)",
        "screen/5": "calc(100vh / 5)",
      },
      gridTemplateColumns: {
        '2flex1': '1fr auto',
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"]
      },
      tooltipArrows: theme => ({
        'tooltip-arrow': {
            borderColor: theme("colors.nci-gray.light"),
            borderWidth: 2,
            backgroundColor: theme('colors.white'),
            size: 6,
            offset: 10
        },
    }),
    },
  },
  variants: {
    extend: {
      borderWidth: ["hover"],
      boxShadow: ["hover"],
      display: ["group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.nextImageFillFix' : {
          width: 'auto !important',
          right: 'auto !important',
          'min-width': '0 !important',
        },
      }

      addUtilities(newUtilities)
    }),
    require('tailwindcss-tooltip-arrow-after')()
  ],
};
