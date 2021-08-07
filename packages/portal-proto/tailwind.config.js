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
          light: "#72bdd1",  //???
          DEFAULT: "#319fbe",
          dark: "#2b8ba7",
          darker: "#227991",
          darkest: "#135f73"
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
      },
      height: {
        "nci-logo": "54px",
        "nci-logo-mobile": "28px",
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ["hover"],
      boxShadow: ["hover"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
