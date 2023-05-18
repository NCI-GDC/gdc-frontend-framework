// eslint-disable-next-line  @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")([
  "@oncojs/survivalplot",
  "@oncojs/react-survivalplot",
  "oncogrid",
  "@sjcrh/proteinpaint-client",
]);

/**
 * This basePath defines root of the application. This must match
 * the intended deployment path. For example, the basePath of "/v2"
 * means that the application will be available at "https://<host>/v2"
 */
const basePath = "/v2";

// Fallback if Docker is not run: This calls git directly
const buildHash = () => {
  try {
    return require("child_process") // eslint-disable-line  @typescript-eslint/no-var-requires
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
  } catch (error) {
    console.error(error);
    return "";
  }
};

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
    // NEXT_PUBLIC_BUILD_SHORT_SHA is passed from gitlab to docker when docker is not run it tries to get it directly from git
    NEXT_PUBLIC_APP_HASH:
      process.env.NEXT_PUBLIC_BUILD_SHORT_SHA || buildHash(),
  },
  async headers() {
    return [
      {
        source: "/(.*)?", // Matches all pages
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
});
