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

### Adding Depenedencies

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
