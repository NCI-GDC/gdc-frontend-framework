import path from "path";
import { existsSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const CLIENT_PKG = "@sjcrh/proteinpaint-client";

// Deepest directory shared by two absolute paths.
const commonAncestor = (a, b) => {
  const as = a.split(path.sep);
  const bs = b.split(path.sep);
  const out = [];
  for (let i = 0; i < Math.min(as.length, bs.length) && as[i] === bs[i]; i++)
    out.push(as[i]);
  return out.join(path.sep) || path.sep;
};

/**
 * Turbopack config fragment for local proteinpaint development (next.config.js).
 *
 * When PP_CLIENT_DIST is set (see dev.sh) this bundles that local
 * proteinpaint/client build instead of the published proteinpaint-client
 * dependency, replacing the old `npm link` + `cp -r dist` workflow that
 * Turbopack no longer supports in a workspace. Returns an empty object
 * otherwise, so CI/production builds resolve the installed package normally.
 *
 * Notes on the two fields:
 * - resolveAlias: aliased to dist/app.js (not the package dir) so its sibling
 *   chunk-*.js files resolve from the real repo dist and rebuilds are live.
 *   The value must be project-root-relative — Turbopack rejects absolute paths.
 * - root: widened to the ancestor shared with the client, since the client
 *   typically lives outside this repo and Turbopack won't resolve files
 *   outside its root.
 *
 * @param projectDir - absolute path to the Next project root (the directory
 *   containing next.config.js).
 * @returns a fragment to spread into next.config.js `turbopack`.
 */
export function turbopackConfig(projectDir) {
  const dist = process.env.PP_CLIENT_DIST;
  if (!dist) return {};

  const clientDir = path.resolve(dist);
  const appJs = path.join(clientDir, "dist/app.js");
  let rel = path.relative(projectDir, appJs);
  if (!rel.startsWith(".")) rel = "./" + rel;

  return {
    root: commonAncestor(projectDir, clientDir),
    resolveAlias: { [CLIENT_PKG]: rel },
  };
}

/**
 * Jest moduleNameMapper fragment for local proteinpaint development
 * (jest.config.ts).
 *
 * proteinpaint-client is normally an installed dependency, but the local
 * development workflow (see dev.sh) bundles a local client build instead of
 * installing/linking it, so it can be absent from node_modules. The
 * proteinpaint tests all mock this module, so it only needs to resolve to some
 * file. Returns an empty object when the package is installed, so default
 * resolution is used for CI and developers not doing local proteinpaint work.
 *
 * @param projectDir - absolute path to the Jest root (the directory containing
 *   jest.config.ts).
 * @returns a fragment to spread into jest.config.ts `moduleNameMapper`.
 */
export function jestModuleNameMapper(projectDir) {
  try {
    require.resolve(CLIENT_PKG);
    return {};
  } catch {
    const dist = process.env.PP_CLIENT_DIST;
    const candidates = [
      dist && path.join(path.resolve(dist), "dist/app.js"),
      path.resolve(projectDir, "../../..", "proteinpaint/client/dist/app.js"),
    ];
    const found = candidates.find((p) => p && existsSync(p));
    return found ? { [`^${CLIENT_PKG}$`]: found } : {};
  }
}
