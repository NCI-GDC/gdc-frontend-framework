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

## How to Store Results

```
1. Run the lighthouse performance tests on desired environment.
2. Take the results, and store them to the appropriate folder in lighthouse-reports.
    - https://github.com/NCI-GDC/lighthouse-reports
3. In lighthouse-reports, modify the variables in script collect_performance_scores.py to add the performance test results to the correct master list.
4. Execute the script.
5. Make a PR in lighthouse-reports to add the test results and updated master list.
```
