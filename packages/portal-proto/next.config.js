/**
 * This basePath defines root of the application. This must match
 * the intended deployment path. For example, the basePath of "/v2"
 * means that the application will be available at "https://<host>/v2"
 */
const basePath = process.env.NEXT_PUBLIC_BASEPATH;
const connectSrc = [
  "https://portal.gdc.cancer.gov",
  "https://browser-intake-datadoghq.com",
  "https://api.gdc.cancer.gov",
  "https://www.google-analytics.com",
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
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://assets.adobedtm.com https://dap.digitalgov.gov https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' ${connectSrc.join(" ")};
    frame-src https://portal.gdc.cancer.gov;
    form-action https://portal.gdc.cancer.gov;
    img-src 'self' 'unsafe-inline' blob: data:;
    font-src 'self';
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
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: "standalone",
  basePath,
  publicRuntimeConfig: {
    basePath,
  },
  experimental: {
    esmExternals: true,
  },
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
