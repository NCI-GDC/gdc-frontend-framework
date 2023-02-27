# Notes for Proteinpaint Developers

## NPM link

When developing analysis tool features using Proteinpaint, `npm link`
should be used to simplify the dynamic rebundling of updated Proteinpaint
code as a node_module within the GFF dependencies.

From the gdc-frontend-framework directory,

```bash
# this creates a fresh symlink to the local proteinpaint/client workspace,
# to avoid issues with the GDC bundle not updating when pp-client code changes
./packages/portal-proto/src/features/proteinpaint/dev.sh
```

## Login testing

For Proteinpaint tracks that require user login, such as the Sequence Read tool,
refer to the "Running Auth" section in the root README.md.

## Testing

Uncomment or add this entry to portal-proto/jest.config.ts to make sure the code is transformed properly:

```ts
transform: {
	"proteinpaint/client": "ts-jest"
},
transformIgnorePatterns: [..., "!proteinpaint"]

```
