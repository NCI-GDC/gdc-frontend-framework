import SelectionPanel from "@/features/set-operations/SelectionPanel";
import AdditionalCohortSelection from "@/features/cohortComparison/AdditionalCohortSelection";

export const COHORTS = [
  { name: "New Custom Cohort", facets: [] },
  {
    name: "Baily's Cohort",
    facets: [
      { field: "cases.primary_site", value: ["breast", "bronchus and lung"] },
    ],
  },
  {
    name: "Pancreas",
    facets: [{ field: "cases.primary_site", value: ["pancreas"] }],
  },
];

export const REGISTERED_APPS = [
  {
    name: "Clinical Data Analysis",
    icon: "icons/apps/ClinicalData.svg",
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    countsField: "repositoryCaseCount",
    id: "CDave",
    description:
      "Use clinical variables to perform basic statistical analysis of your cohort.",
    noDataTooltip:
      "Current cohort does not have cases available for visualization.",
  },
  {
    name: "Cohort Builder",
    icon: "icons/apps/CohortBuilder.svg",
    tags: ["generalUtility"],
    hasDemo: false,
    id: "CohortBuilder",
    countsField: "repositoryCaseCount",
    description:
      "Build and define your custom cohorts using a variety of clinical and biospecimen features.",
  },
  {
    name: "Mutation Frequency",
    icon: "icons/apps/MutationsFrequency.svg",
    tags: ["variantAnalysis", "ssm"],
    hasDemo: true,
    id: "MutationFrequencyApp",
    countsField: "ssmCaseCount",
    description:
      "Visualize most frequently mutated genes and somatic mutations.",
    noDataTooltip:
      "Current cohort does not have SSM data available for visualization.",
    optimizeRules: ["something == something"],
  },
  {
    name: "Repository",
    icon: "icons/database.svg",
    tags: ["files"],
    hasDemo: false,
    countsField: "repositoryCaseCount",
    id: "Downloads",
    description:
      "Browse and download the files associated with your cohort for more sophisticated analysis.",
  },
  {
    name: "Projects",
    icon: "icons/crowd-of-users.svg",
    tags: [],
    hasDemo: false,
    id: "Projects",
    countsField: "repositoryCaseCount",
    description:
      "View the Projects available within the GDC and select them for further exploration and analysis.",
  },
  {
    name: "Cohort Comparison",
    icon: "icons/apps/CohortComparison.svg",
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    id: "CohortComparisonApp",
    countsField: "repositoryCaseCount",
    description:
      "Display the survival analysis of your cohorts and compare characteristics such as gender, vital status and age at diagnosis.",
    noDataTooltip:
      "Current cohort does not have cases available for visualization.",
    selectionScreen: AdditionalCohortSelection,
  },
  // TODO uncomment to show gene expression card
  /*
  {
    name: "Gene Expression",
    icon: "icons/aops/GeneExpression.svg",
    tags: ["geneExpression"],
    hasDemo: true,
    id: "GeneExpression",
    description: "Visualize patterns in gene expression in your cohort.",
    caseCounts: 0.11,
    optimizeRules: ["something == something"],
    noDataTooltip:
      "Current cohort does not have gene expression data available for visualization.",
  },
  */
  {
    name: "Set Operations",
    icon: "icons/apps/SetOperations.svg",
    tags: ["generalUtility"],
    hasDemo: true,
    hideCounts: true,
    countsField: "repositoryCaseCount",
    description:
      "Display a Venn diagram and compare/contrast your cohorts or sets of the same type.",
    id: "SetOperations",
    selectionScreen: SelectionPanel,
  },
  // {
  //   name: "OncoGrid",
  //   icon: "icons/apps/Oncogrid.svg",
  //   iconSize: { width: 80, height: 48 },
  //   tags: ["variantAnalysis", "cnv", "ssm"],
  //   hasDemo: true,
  //   countsField: "ssmCaseCount",
  //   description:
  //     "Visualize the top most mutated cases and genes affected by high impact mutations in your cohort.",
  //   id: "OncoGridApp",
  //   optimizeRules: ["available data = ssm or cnv"],
  //   noDataTooltip:
  //     "Current cohort does not have SSM or CNV data available for visualization.",
  // },
  {
    name: "Sequence Reads",
    icon: "icons/apps/SequenceReads.svg",
    tags: ["sequenceAnalysis"],
    hasDemo: false,
    countsField: "sequenceReadCaseCount",
    description:
      "Visualize sequencing reads for a given gene, position, SNP, or variant.",
    id: "SequenceReadApp",
    noDataTooltip:
      "Current cohort does not have available BAMs for visualization.",
    optimizeRules: ["data format = BAM"],
  },
  {
    name: "ProteinPaint",
    icon: "icons/apps/ProteinPaint.svg",
    iconSize: { width: 80, height: 48 },
    tags: ["variantAnalysis", "ssm"],
    hasDemo: true,
    description:
      "Visualize mutations in protein-coding genes by consequence type and protein domain.",
    id: "ProteinPaintApp",
    countsField: "ssmCaseCount",
    caseCounts: 0.25,
    optimizeRules: ["available data = ssm"],
    noDataTooltip:
      "Current cohort does not have SSM data available for visualization.",
  },
  {
    name: "OncoMatrix (prototype)",
    icon: "matrix.png",
    iconSize: { width: 80, height: 48 },
    tags: ["variantAnalysis", "cnv", "ssm"],
    hasDemo: true,
    description:
      "Visualize the top most mutated cases and genes affected by high impact mutations in your cohort.",
    id: "OncoMatrix",
    countsField: "ssmCaseCount",
    caseCounts: 0.25,
    optimizeRules: ["available data = ssm or cnv"],
    noDataTooltip:
      "Current cohort does not have SSM or CNV data available for visualization.",
  },
  /*
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
    noDataTooltip:
      "Current cohort does not have scRNA-Seq data available for visualization.",
  },
  */
];

export const APPTAGS = [
  { value: "clinicalAnalysis", name: "Clinical Analysis" },
  { value: "generalUtility", name: "General Utility" },
  { value: "variantAnalysis", name: "Variant Analysis" },
  // TODO uncomment to show gene expression tag
  // { value: "geneExpression", name: "Gene Expression" },
  { value: "sequenceAnalysis", name: "Sequence Analysis" },
  { value: "cnv", name: "CNV" },
  { value: "ssm", name: "SSM" },
];

export const RECOMMENDED_APPS = ["Projects", "CohortBuilder", "Downloads"];
