// eslint-disable-next-line  @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")([
  "@oncojs/survivalplot",
  "@oncojs/react-survivalplot",
  "oncogrid",
]);

module.exports = withTM({
  experimental: {
    outputStandalone: true,
  },
});
