# GDC Frontend Framework

## Installation

### Prerequisites

This is a multi-workspace repo that requires npm v7. The minimum node version is set to v14 only from an LTS perspective.

Node can be downloaded from the official Node.js site. You may also consider using a [Node version manager](https://docs.npmjs.com/cli/v7/configuring-npm/install#using-a-node-version-manager-to-install-nodejs-and-npm).

Your version of Node may not ship with npm v7. To install it, run:

```bash
npm install npm@7
```

### Install Dependencies

From the root of the project, install dependencies by running:

```bash
npm install
```

Installing from the root of the repository is required to avoid
multiple installations of React in the workspaces. When this happens,
React will fail to render.

### Adding Dependencies

Dependencies can also be installed from the root of the repository.
To install a dependency for a specific workspace, you can run:

```bash
npm install --save my-package --workspace=packages/core
```

Since this is a TypeScript project, installing the community type definitions may also be required:

```bash
npm install --save-dev @types/my-package --workspace=packages/core
```

## Development

Run the prototype in dev mode with auto-rebuilding:

```bash
npm run dev
```

By default, this will start a dev server listening to http://localhost:3000

Note: Recompiling the type definitions for core needs to be done manually:

```bash
npm run compile --w=packages/core
```

### Linting

Run ESLint for all of the workspaces:

```bash
npm run lint
```

### Formatting

Run prettier for all of the workspaces:

```bash
npm run format
```

## Testing

This project uses `jest` for testing.

### Naming Convention

| Test Type   | Filename         |
| ----------- | ---------------- |
| Unit        | `*.unit.test.ts` |
| Integration | `*.int.test.ts`  |

### Locations

Tests should live in the same directory as if a single module is under test. Since unit tests should only test a single module, they should also live in the directory.
For example,

```
+ /src
| - monarch.ts
| - monarch.unit.ts
| - monarch.int.ts
```

### Running tests

`npm run test` will run unit tests.

`npm run test:int` will run integration tests.

`npm run test:all` will run both unit and integration tests.

### Running the portal in Docker

The portal has support for running in a Docker container
To create a docker container:

```
 docker build -t GDCV2 .
```

to run it:

```
 docker run -p 3000:3000 -t GDCV2
```

### Running Auth in Localhost (Login and other Auth related actions)

1. [Open Chrome (web browser)](https://alfilatov.com/posts/run-chrome-without-cors/) which disables web security to suppress the CORS warning.
2. Configure your machine to map `localhost.gdc.cancer.gov` (or a similar subdomain) to resolve to `127.0.0.1`.

   In Mac or Linux, edit the file `/etc/hosts` (You need to give sudo access to edit this file), add the following line:

   ```
       127.0.0.1   localhost localhost.gdc.cancer.gov
   ```

3. Since the `sessionid` cookie can only be send through `HTTPS`, you need to [add https to your localhost](https://dev.to/defite/adding-https-to-your-localhost-15hg).
4. After these steps, you can access the app on `https://localhost.gdc.cancer.gov:3010/`.
5. Even after all these steps you will see `SecurityError: Blocked a frame with origin "https://localhost.gdc.cancer.gov:3010" from accessing a cross-origin frame` error. But you can close the error and refresh the page. This warning will be supressed in production.
6. Now you can Login and use features that are available with Authentication.
