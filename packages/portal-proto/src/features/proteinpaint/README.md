# Notes for Proteinpaint Developers

When developing analysis tool features using Proteinpaint, `npm link`
should be used to simplify the dynamic rebundling of updated Proteinpaint
code as a node_module within the GFF dependencies.

From the gdc-frontend-framework directory,

```bash
cd path/to/proteinpaint/client
npm link

cd path/to/gdc-frontend-framework

# !!! next.js seems to cache the proteinpaint bundle even after using `npm link` !!!
# so portal-proto/.next/static/chunks/*proteinpaint* do not get updated with edits to the PP code
#
# !!! TEMPORARY WORKAROUND (do not commit!!!):
# vim packages/portal-proto/package.json
# remove the entry for dependencies['@stjude/proteinpaint-client'] ONLY DURING DEV WORK, do not commit
#
# probable cause: nextjs sees that dependencies['@stjude/proteinpaint-client'] is a tarball
# and assumes that it is static, with considering that `npm link` has been used for this dependency

npm link @stjude/proteinpaint-client

```
