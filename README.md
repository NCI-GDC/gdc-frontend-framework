# GDC Frontend Framework

## Installation

### Prerequisites

This is a multi-workspace repo that requires npm v11.11.0. The minimum node version is set to v24.14.0.

Node can be downloaded from the official Node.js site. You may also consider using a [Node version manager](https://docs.npmjs.com/cli/v7/configuring-npm/install#using-a-node-version-manager-to-install-nodejs-and-npm).

Your version of Node may not ship with npm v11.11.0. To install it, run:

```bash
npm install npm@11.11.0
```

If you are using a Node version manager, you can run the following to install the correct version of Node:

```bash
nvm install 24.14.0
```

to use the correct version of Node:

```bash
nvm use 24.14.0
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

1. Configure your machine to map `localhost.gdc.cancer.gov` to resolve to `127.0.0.1`.

   In Mac or Linux, edit `/etc/hosts` (requires sudo):

```
   127.0.0.1   localhost localhost.gdc.cancer.gov
```

2. Install `mkcert` and generate a locally trusted certificate (one-time setup - assuming MacOS device):

```bash
   brew install mkcert
   mkcert -install
```

Then from the **repo root**:

```bash
   mkdir -p .certs
   mkcert -key-file .certs/localhost-key.pem -cert-file .certs/localhost.pem localhost.gdc.cancer.gov
```

3. Start the dev server from the repo root:

```bash
   npm run dev:gdc:https
```

4. Open Chrome (or any browser that you use) with web security disabled to suppress CORS warnings:

```bash
   open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --args --user-data-dir="/tmp/chrome_dev_test" \
     --disable-web-security \
     https://localhost.gdc.cancer.gov:3000
```

5. You can now access the app at `https://localhost.gdc.cancer.gov:3000` and use login and all authentication features.

6. Once you login through NIH website, it will redirect you to `https://portal.gdc.cancer.gov/?login=true` and the tab won't close. You will have to manually close it and go to the `https://localhost.gdc.cancer.gov:3000` tab you came from. You might or might not have to refresh the page for session cookie to be picked up by the tab to show that you are logged in. This is a new known behavior.

> **Note:** The `.certs/` folder is gitignored. Each developer needs to run the `mkcert` steps once on their machine.

### Mock server

A mock server can be used to mock responses from outside clients. This can be useful for testing auth related issues. To set up your dev
site to use the mock server:

1. Create a certificate for your mock server, detailed here: https://www.mocks-server.org/docs/guides/https-protocol/#creating-a-self-signed-certificate. Use `mock-server-key.pem` and `mock-server-cert.pem` for names.
2. Uncomment `https://localhost:3100` in next.config.js
3. Set your dev site to point at the mock server for auth calls with `export NEXT_PUBLIC_GDC_AUTH=https://localhost:3100` and restart the dev site
4. Start the mock server with `npm run mocks`. In the mock server process, you can select `Use route variant` to toggle between different responses.

## Version

Update the versions of all workspaces at the same time. (Replace 2.13.0 with the new version to set)

```bash
npm run version -- 2.13.0
```

## Documentation

Run build-docs to generate documentation for "portal-proto" and "core" packages
For developing applications for the GDC Portal, please review
[Developer Guide](https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/Developers_Guide).

```bash
npm run build-docs
```

After generation documentation can be found in the [docs folder](/docs/)

## Project Structure

This project is a monorepo managed by [lerna](https://lerna.js.org). It is composed of the following packages:

- `packages/core`: Contains the state management and function for accessing the APIs of the GDC.
- `packages/portal-proto`: The GDC Frontend Framework prototype. This is the main package for the project. It uses NextJS
  as the application framework and React as the UI framework. For basic components we use [Mantine.dev](https://v6.mantine.dev/) (version 6), as the UI library as it compatiable
  with our design system and use of [Tailwind CSS](https://tailwindcss.com). Please note that before the final release
  the package will be renamed to `packages/portal`.
- `packages/sapien`: is the package that contains the Bodyplot UI used on the GDC Portal V2 home page.
- `packages/lighthouse`: is the package that contains the Lighthouse UI used on the GDC Portal V2 home page for testing performance.
- `packages/survivalplot`: is the package that contains the survival plot UI used on the GDC Portal V2 apps.
