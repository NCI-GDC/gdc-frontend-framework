# Notes for Proteinpaint Developers

## NPM link

When developing analysis tool features using Proteinpaint, `npm link`
should be used to simplify the dynamic rebundling of updated Proteinpaint
code as a node_module within the GFF dependencies.

From the gdc-frontend-framework directory,

```bash
npm link path/to/proteinpaint/client
rm -rf packages/portal-proto/node_modules/@stjude
rm -rf packages/portal-proto/.next

# NOTES for above:
#
# An issue with npm link and workspaces: the non-linked @stjude/proteinpaint-client package
# may be moved to portal-proto/node_modules, creating 2 separate modules of the same package,
# must ensure only the linked module is used for bundling so delete
#
# also not able to do a simpler
# `cd packages/portal-proto && npm link path/to/proteinpaint/client`,
# where the linked module would be in portal-proto/node_modules instead of the
# other way around
```

## Testing

Uncomment or add this entry to portal-proto/jest.config.ts to make the code is transformed properly:

```ts
transform: {
	"proteinpaint/client": "ts-jest"
},
transformIgnorePatterns: [..., "!proteinpaint"]

```
