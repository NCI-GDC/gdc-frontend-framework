/**
 * This basePath defines root of the application. This must match
 * the intended deployment path. For example, the basePath of "/v2"
 * means that the application will be available at "https://<host>/v2"
 */
const basePath = process.env.NEXT_PUBLIC_BASEPATH;

if (process.env.NODE_ENV == "development") {
  // in SJ dev environment, this would point to a local PP server instance
  const PROTEINPAINT_API =
    process.env.PROTEINPAINT_API ||
    process.env.NEXT_PUBLIC_PROTEINPAINT_API ||
    "";
  const PROTEINPAINT_HOST =
    PROTEINPAINT_API.split("://")[1]?.split("/")[0] || "";

  if (PROTEINPAINT_HOST && !connectSrc.includes(`https://${PROTEINPAINT_HOST}`))
    connectSrc.push(`https://${PROTEINPAINT_HOST}`);
}

// Fallback if Docker is not run: This calls git directly
const buildHash = () => {
  try {
    return require("child_process") // eslint-disable-line  @typescript-eslint/no-var-requires
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
  } catch (error) {
    console.debug(error);
    return "";
  }
};

// @ts-check
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: "standalone",
  basePath,
  allowedDevOrigins: ["localhost.gdc.cancer.gov"],
  experimental: {
    esmExternals: true,
  },
  allowedDevOrigins: ["localhost.gdc.cancer.gov"],
  env: {
    // passed via command line, `PROTEINPAINT_API=... npm run dev`
    PROTEINPAINT_API:
      process.env.PROTEINPAINT_API || process.env.NEXT_PUBLIC_PROTEINPAINT_API,
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    // NEXT_PUBLIC_BUILD_SHORT_SHA is passed from gitlab to docker when docker is not run it tries to get it directly from git
    NEXT_PUBLIC_APP_HASH:
      process.env.npm_lifecycle_event === "dev"
        ? buildHash()
        : process.env.NEXT_PUBLIC_BUILD_SHORT_SHA,
  },
};
