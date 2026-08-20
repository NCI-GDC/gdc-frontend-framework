#!/usr/bin/env node
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const CLIENT_PKG = "@sjcrh/proteinpaint-client";

// Default proteinpaint API for local SJ development; override with PROTEINPAINT_API.
const DEFAULT_PROTEINPAINT_API = "https://localhost.gdc.cancer.gov:3011";

// Deepest directory shared by two absolute paths.
const commonAncestor = (a, b) => {
  const as = a.split(path.sep);
  const bs = b.split(path.sep);
  const out = [];
  for (let i = 0; i < Math.min(as.length, bs.length) && as[i] === bs[i]; i++)
    out.push(as[i]);
  return out.join(path.sep) || path.sep;
};

// Absolute path to the client's built entry (dist/app.js) from a base that may
// point at the client repo root, the dist directory, or app.js itself. Prefer
// whichever candidate exists; otherwise infer from the directory name so it also
// works before a first build.
const clientAppJs = (base) => {
  const abs = path.resolve(base);
  if (abs.endsWith(`${path.sep}app.js`)) return abs;
  const asDistDir = path.join(abs, "app.js"); // base is .../client/dist
  const asRepoRoot = path.join(abs, "dist", "app.js"); // base is .../client
  if (existsSync(asRepoRoot)) return asRepoRoot;
  if (existsSync(asDistDir)) return asDistDir;
  return path.basename(abs) === "dist" ? asDistDir : asRepoRoot;
};

/**
 * Turbopack config fragment that bundles a local proteinpaint/client build
 * instead of the published proteinpaint-client dependency, replacing the old
 * `npm link` + `cp -r dist` workflow that Turbopack no longer supports in a
 * workspace. Nested under `turbopack` in the JSON printed by this CLI and passed
 * to next.config.js via NEXT_CONFIG_OVERRIDES (see dev.sh), so the Data Portal
 * build never depends on this dev-only module.
 *
 * - resolveAlias: aliased to dist/app.js (not the package dir) so its sibling
 *   chunk-*.js files resolve from the real repo dist and rebuilds are live.
 *   The value must be project-root-relative — Turbopack rejects absolute paths.
 * - root: widened to the ancestor shared with the client, since the client
 *   typically lives outside this repo and Turbopack won't resolve files outside
 *   its root.
 *
 * @param projectDir - absolute path to the Next project root (the directory
 *   containing next.config.js).
 * @param clientDir - path to the local client (repo root, dist dir, or app.js).
 * @returns a fragment to spread into next.config.js `turbopack`.
 */
export function turbopackConfig(projectDir, clientDir) {
  if (!clientDir) return {};

  const appJs = clientAppJs(clientDir);
  let rel = path.relative(projectDir, appJs);
  if (!rel.startsWith(".")) rel = "./" + rel;

  return {
    root: commonAncestor(projectDir, appJs),
    resolveAlias: { [CLIENT_PKG]: rel },
  };
}

// CLI: print a NEXT_CONFIG_OVERRIDES JSON object for next.config.js, e.g.
//   NEXT_CONFIG_OVERRIDES="$(node ppNextConfig.mjs)" npm run dev
// It supplies everything local proteinpaint development needs:
// - turbopack:  alias to the local client build (PP_CLIENT_DIST, else the
//               conventional sibling ../proteinpaint/client)
// - env:        PROTEINPAINT_API (PROTEINPAINT_API env, else the SJ dev default)
// - connectSrc: the API host, added to the CSP connect-src directive
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const projectDir = path.resolve(scriptDir, "../../.."); // packages/portal-proto
  const clientDir =
    process.env.PP_CLIENT_DIST ||
    path.resolve(projectDir, "../../../proteinpaint/client");

  const proteinpaintApi =
    process.env.PROTEINPAINT_API || DEFAULT_PROTEINPAINT_API;
  const apiHost = proteinpaintApi.split("://")[1]?.split("/")[0] || "";

  process.stdout.write(
    JSON.stringify({
      turbopack: turbopackConfig(projectDir, clientDir),
      connectSrc: apiHost ? [`https://${apiHost}`] : [],
      env: { PROTEINPAINT_API: proteinpaintApi },
    }),
  );
}
