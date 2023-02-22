# Overview

This package uses [Google Chrome's Lighthouse](https://github.com/GoogleChrome/lighthouse), to audit the data portal.

## Run

Lighthouse is configured to run against many portal urls. Audit results are saved as csv and html to the `reports/` directory.

To run the audits:

```
npm run audit
```

For options, run:

```
npm run audit -- --help
```
