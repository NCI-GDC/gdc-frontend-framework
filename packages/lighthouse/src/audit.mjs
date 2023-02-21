import fs from "fs";
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

/* 
  These configs are based on these desktop configs
  https://github.com/GoogleChrome/lighthouse/blob/c9584689210c4fff8398e7a124f0819a5d91a4e8/core/config/lr-desktop-config.js
*/
const outputTypes = ["html", "csv"];
const lighthouseConfig = {
  extends: "lighthouse:default",
  settings: {
    output: outputTypes,
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    formFactor: "desktop",
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0, // 0 means unset
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
    skipAudits: ["uses-http2"],
    onlyCategories: ["accessibility", "best-practices", "performance", "seo"],
  },
};

const auditUrl = async (name, url) => {
  let chrome = undefined;
  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const flags = { logLevel: "error", port: chrome.port };
    console.log(`Auditing ${name}`);
    const results = await lighthouse(url, flags, lighthouseConfig);
    return results;
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
};

const saveAuditResults = (name, results, date, reportsDir) => {
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  for (let i = 0; i < outputTypes.length; i++) {
    fs.writeFileSync(
      `${reportsDir}/lighthouse-report-${name}-${date.toISOString()}.${
        outputTypes[i]
      }`,
      // `.report` is the HTML report as a string
      results.report[i],
    );
  }

  // `.lhr` is the Lighthouse Result as a JS object
  console.log(
    `${name} performance score: ${
      results.lhr.categories.performance.score * 100
    }`,
  );
};

const performAudits = async (baseUrl, paths, reportsDir) => {
  const runtimeDate = new Date();
  for (const [name, path] of Object.entries(paths)) {
    const results = await auditUrl(name, `${baseUrl}${path}`);
    saveAuditResults(name, results, runtimeDate, reportsDir);
  }
};

const PATHS = {
  home: "/",
  analysisCenter: "/analysis_page",
  projects: "/analysis_page?app=Projects",
  cohortBuilder: "/analysis_page?app=CohortBuilder",
  downloads: "/analysis_page?app=Downloads",
  clinicalAnalysis: "/analysis_page?app=CDave",
  cohortComparison: "/analysis_page?app=CohortComparisonApp",
  mutationFrequency: "/analysis_page?app=MutationFrequencyApp",
  oncoGrid: "/analysis_page?app=OncoGridApp",
  oncoMatrix: "/analysis_page?app=OncoMatrix",
  proteinPaint: "/analysis_page?app=ProteinPaintApp",
  sequenceRead: "/analysis_page?app=SequenceReadApp",
  setOperations: "/analysis_page?app=SetOperations",
  cart: "/cart",
  geneSummary: "/genes/ENSG00000141510",
  projectSummary: "/projects/TCGA-BRCA",
  caseSummary: "/cases/93ed6066-b567-4e1c-ab81-23370f9d3452",
  fileSummary: "/files/e18b4c33-e3c7-48df-a42c-3fb60e1a96fe",
  slideFileSummary: "/files/5bd2d920-fb46-45b2-9995-bd383330c8f6",
};

const argv = yargs(hideBin(process.argv))
  .option("reports-dir", {
    alias: "d",
    type: "string",
    description: "Directory to store reports",
    default: "reports",
  })
  .option("base-url", {
    alias: "b",
    type: "string",
    description: "host to audit",
    default: "https://portal.gdc.cancer.gov/v2",
  })
  .parse();

performAudits(argv.baseUrl, PATHS, argv.reportsDir);
