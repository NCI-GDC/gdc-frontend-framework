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

/**
 * This gets api info for footer
 */
const apiBuildInfo = fetch(`${process.env.NEXT_PUBLIC_GDC_API}/status`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  })
  .then((data) => {
    return {
      tag: data.tag,
      hash: data.commit?.slice(0, 8),
    };
  })
  .catch((err) => {
    console.error(`Unable to get GDC API details at buildtime`, err);
    return {
      tag: "",
      hash: "",
    };
  });
// eslint-disable-next-line  @typescript-eslint/no-var-requires
const buildHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

module.exports = () => {
  return apiBuildInfo.then((apiInfo) =>
    withTM({
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
        NEXT_PUBLIC_APP_HASH: buildHash,
        NEXT_PUBLIC_API_VERSION: apiInfo.tag,
        NEXT_PUBLIC_API_HASH: apiInfo.hash,
      },
    }),
  );
};
