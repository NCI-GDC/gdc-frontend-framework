// eslint-disable-next-line  @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")([
  "@oncojs/survivalplot",
  "@oncojs/react-survivalplot",
  "oncogrid",
  "@stjude/proteinpaint-client",
]);

module.exports = withTM({
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});
