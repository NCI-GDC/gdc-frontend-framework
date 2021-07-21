# GDC Frontend Framework

## Install

This is a multi-workspace repo that requires npm v7. The minimum node version is set to v14 only from an LTS perspective.

From the root of the project, run

```bash
npm install
```

## Development

Run the prototype in dev mode with auto-rebuilding:

```bash
npm run dev
```

Note: Recompiling the type definitions for core need to be done manually:

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
