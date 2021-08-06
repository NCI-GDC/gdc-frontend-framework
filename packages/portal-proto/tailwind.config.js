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
          DEFAULT: "#bb0e3d",
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
          DEFAULT: "#2a72a5",
        },
        "nci-teal": {
          DEFAULT: "#0d95a1",
        },
        "nci-cyan": {
          DEFAULT: "#319fbe",
        },
        // NCI Secondary Palette
        "nci-green": {
          DEFAULT: "#2dc799",
        },
        "nci-violet": {
          DEFAULT: "#6254a3",
        },
        "nci-purple": {
          DEFAULT: "#82368c",
        },
        "nci-orange": {
          DEFAULT: "#ff5f00",
        },
        "nci-yellow": {
          DEFAULT: "#ffbf17",
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
