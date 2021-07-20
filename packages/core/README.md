# GFF Core

This is the core of the GDC Frontend Framework. It is a Redux Toolkit project.

## Installation

Install from the root of this multi-workspace repository. Installing from the individual workspaces will introduce duplicate
dependencies, which will cause problems with React.

## Development

To create a fresh build, run:

```bash
npm run build:clean
```

To start incremental building, run:

```bash
npm run build:watch
```

Note: This will build new code changes, but it does not compile the TypeScript definition files when types change.

To compile new TypeScript definitions:

```bash
npm run compile
```
