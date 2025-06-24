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
follow the initial setup in the "Running Auth" section in the root README.md. Then,
the following dev-only changes will likely be required:

- add the `auth proxy` entry to `proteinpaint/ssl-proxy.json`:

```json
  "GFF proxy": {
    "source": 3010,
    "target": 3001,
    "hostname": "localhost.gdc.cancer.gov",
    "key": "./localhost.gdc.cancer.gov-key.pem",
    "cert": "./localhost.gdc.cancer.gov.pem"
  },
  "PP proxy": {
    "source": 3011,
    "target": 3456,
    "hostname": "localhost.gdc.cancer.gov",
    "key": "./localhost.gdc.cancer.gov-key.pem",
    "cert": "./localhost.gdc.cancer.gov.pem"
  },
  "auth proxy": {
    "source": 3333,
    "target": 3000,
    "hostname": "localhost.gdc.cancer.gov",
    "key": "./localhost.gdc.cancer.gov-key.pem",
    "cert": "./localhost.gdc.cancer.gov.pem"
  },
```

- edit `portal-proto/.env.development` to have `NEXT_PUBLIC_GDC_AUTH=https://localhost.gdc.cancer.gov:3333/auth`
- edit `portal-proto/features/layout/openAuthWindow.ts` to force `if (true) {win.close() ....}` instead of detecting `window.document.URL` substrings
- from the `proteinpaint` dir, run `local-ssl-proxy --config ssl-proxy.json --cert localhost.gdc.cancer.gov.pem --key localhost.gdc.cancer.gov-key.pem`

## Testing

Uncomment or add this entry to portal-proto/jest.config.ts to make sure the code is transformed properly:

```ts
transform: {
	"proteinpaint/client": "ts-jest"
},
transformIgnorePatterns: [..., "!proteinpaint"]

```
