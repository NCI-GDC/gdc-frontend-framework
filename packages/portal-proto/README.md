# Portal Prototype

This prototype is built with React v17, Next.js v11, and Tailwind CSS v2. It also makes use of Redux-Toolkit and TypeScript.

The minimum node version is currently set to v14 for LTS reasons. The actual minimum for Next.js is v12.

## Installation

Install from the root of this multi-workspace repository. Installing from the individual workspaces will introduce duplicate
dependencies, which will cause problems with React.

## Development

To start a dev server on port 3000, run:

```bash
npm run dev
```

You can connect at http://localhost:3000/v2

## Base Path

This application is configured to use a base path. It is configured in next.config.js.

### Images

In next.js, the configuring the basePath does not automatically apply the base path to
the image components from `next/image`. To make development easier, we added the `Image`
component int `components/Image.tsx`. This will automatically add the base path if needed.
It has the same props as `next/image`.

```
import { Image } from "@/components/Image";
```
