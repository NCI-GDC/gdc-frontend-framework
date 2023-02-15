// eslint-disable-next-line  @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")([
  "@oncojs/survivalplot",
  "@oncojs/react-survivalplot",
  "oncogrid",
  "@stjude/proteinpaint-client",
]);

/**
 * This basePath defines root of the application. This must match
 * the intended deployment path. For example, the basePath of "/v2"
 * means that the application will be available at "https://<host>/v2"
 */
const basePath = "/v2";

// This gets the git info from the git directory by checking what the head is set to then getting that branches hash
const buildHash = () =>
  require("child_process") // eslint-disable-line  @typescript-eslint/no-var-requires
    .execSync("(cd ../../.git; head=$(cat HEAD); cat ${head##*: })")
    .toString()
    .trim()
    .slice(0, 8);

module.exports = withTM({
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: "standalone",
  basePath,
  publicRuntimeConfig: {
    basePath,
  },
  env: {
    // passed via command line, `PROTEINPAINT_API=... npm run dev`
    PROTEINPAINT_API: process.env.PROTEINPAINT_API,
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_APP_HASH:
      process.env.NEXT_PUBLIC_BUILD_SHORT_SHA || buildHash(),
  },
});
