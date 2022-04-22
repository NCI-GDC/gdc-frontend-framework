export const COHORTS = [
  { name: "New Custom Cohort", facets: [] },
  {
    name: "Baily's Cohort",
    facets: [
      { field: "cases.primary_site", value: ["breast", "bronchus and lung"] },
    ],
  },
];

export const REGISTERED_APPS = [
  {
    name: "Clinical Data Analysis",
    icon: "icons/apps/cdave.svg",
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    id: "CDave",
    description:
      "Display basic statistical analyses for the selected case set.",
  },
  {
    name: "Cohort Builder",
    icon: "icons/build.svg",
    tags: ["generalUtility"],
    hasDemo: false,
    id: "CohortBuilder",
    description:
      "Build and define your custom cohorts using a variety of clinical and biospecimen features.",
  },
  {
    name: "Mutations Frequency",
    icon: "icons/apps/mutations.svg",
    tags: ["variantAnalysis", "ssm"],
    hasDemo: true,
    id: "MutationFrequencyApp",
    description:
      "Visualize most frequently mutated genes and most frequent somatic mutations.",
    optimizeRules: ["something == something"],
  },
  {
    name: "Repository",
    icon: "icons/database.svg",
    tags: ["files"],
    hasDemo: false,
    id: "Downloads",
    description:
      "Browse and download the files associated with your cohort for more sophisticated analysis.",
  },
  {
    name: "Studies",
    icon: "icons/crowd-of-users.svg",
    tags: [],
    hasDemo: false,
    id: "Studies",
    description:
      "View the Studies available within the GDC and select them for further exploration and analysis.",
  },
  {
    name: "Cohort Comparison",
    icon: "icons/apps/cohortComparison.svg",
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    id: "CohortComparisonApp",
    description:
      "Display the survival analysis of your case sets and compare characteristics such as gender, vital status and age at diagnosis.",
  },
  {
    name: "Gene Expression",
    icon: "gene-expression.png",
    tags: ["geneExpression"],
    hasDemo: true,
    id: "GeneExpression",
    description: "Visualize patterns in gene expression in your cohort.",
    caseCounts: 0.11,
    optimizeRules: ["something == something"],
  },
  {
    name: "Set Operations",
    icon: "icons/apps/setOps.svg",
    tags: ["generalUtility"],
    hasDemo: true,
    hideCounts: true,
    description:
      "Display Venn diagram and find intersection or union, etc. of your cohorts.",
    id: "SetOperations",
  },
  {
    name: "OncoGrid",
    icon: "icons/apps/oncogrid.svg",
    iconSize: { width: 100, height: 48 },
    tags: ["variantAnalysis", "cnv", "ssm"],
    hasDemo: true,
    description:
      "Visualize the top most mutated cases and genes affected by high impact mutations in your cohort.",
    id: "OncoGridApp",
    optimizeRules: ["available data = ssm or cnv"],
  },
  {
    name: "Sequence Reads",
    icon: "sequence-reads.png",
    tags: ["sequenceAnalysis"],
    hasDemo: true,
    description: "Visualize sequencing reads.",
    id: "SequenceReads",
    optimizeRules: ["data format = BAM"],
  },
  {
    name: "ProteinPaint",
    icon: "proteinpaint.png",
    iconSize: { width: 100, height: 48 },
    tags: ["variantAnalysis", "ssm"],
    hasDemo: true,
    description: "Visualize mutations in protein-coding genes.",
    id: "ProteinPaint",
    caseCounts: 0.25,
    optimizeRules: ["available data = ssm"],
  },
  {
    name: "scRNA-Seq",
    icon: "scRnaSeqViz.png",
    tags: ["geneExpression"],
    hasDemo: true,
    description:
      "Visualize patterns in single-cell gene expression in your cohort.",
    id: "SingleCellRnaSeq",
    caseCounts: 0.1,
    optimizeRules: ["experimental_strategy === scrna-seq"],
  },
];

export const APPTAGS = [
  { value: "clinicalAnalysis", name: "Clinical Analysis" },
  { value: "generalUtility", name: "General Utility" },
  { value: "variantAnalysis", name: "Variant Analysis" },
  { value: "geneExpression", name: "Gene Expression" },
  { value: "sequenceAnalysis", name: "Sequence Analysis" },
  { value: "cnv", name: "cnv" },
  { value: "ssm", name: "ssm" },
];

export const RECOMMENDED_APPS = ["Studies", "CohortBuilder", "Downloads"];
