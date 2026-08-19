const path = require("path");

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
 * Turbopack config fragment for local proteinpaint development.
 *
 * When PP_CLIENT_DIST is set (see dev.sh) this bundles that local
 * proteinpaint/client build instead of the published @sjcrh/proteinpaint-client
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
 * @param {string} projectDir absolute path to the Next project root (the
 *   directory containing next.config.js).
 * @returns {object} a fragment to spread into next.config.js `turbopack`.
 */
module.exports = function ppTurbopackDev(projectDir) {
  const dist = process.env.PP_CLIENT_DIST;
  if (!dist) return {};

  const clientDir = path.resolve(dist);
  const appJs = path.join(clientDir, "dist/app.js");
  let rel = path.relative(projectDir, appJs);
  if (!rel.startsWith(".")) rel = "./" + rel;

  return {
    root: commonAncestor(projectDir, clientDir),
    resolveAlias: { "@sjcrh/proteinpaint-client": rel },
  };
};
