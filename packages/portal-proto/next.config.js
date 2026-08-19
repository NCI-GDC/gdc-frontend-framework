/**
 * This basePath defines root of the application. This must match
 * the intended deployment path. For example, the basePath of "/v2"
 * means that the application will be available at "https://<host>/v2"
 */
// Optional Turbopack overrides for local proteinpaint client development.
const ppTurbopackDev = require("./src/features/proteinpaint/ppTurbopackDev");

const basePath = process.env.NEXT_PUBLIC_BASEPATH;
const connectSrc = [
  "https://portal.gdc.cancer.gov",
  "https://browser-intake-datadoghq.com",
  "https://api.gdc.cancer.gov",
  "https://www.google-analytics.com",
  "https://dap.digitalgov.gov",
  "https://metrics.cancer.gov",
  "https://storage.googleapis.com/idc-index-data-artifacts/",
  // Uncomment to use mock server for testing
  //"https://localhost:3100",
];

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

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.adobedtm.com https://dap.digitalgov.gov https://www.googletagmanager.com https://static-dev.cancer.gov;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' ${connectSrc.join(" ")};
    frame-src https://portal.gdc.cancer.gov;
    form-action https://portal.gdc.cancer.gov;
    img-src 'self' 'unsafe-inline' blob: data: https://metrics.cancer.gov;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

// @ts-check
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  turbopack: {
    ...ppTurbopackDev(__dirname),
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
  async headers() {
    return [
      {
        source: "/(.*)?", // Matches all pages
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
