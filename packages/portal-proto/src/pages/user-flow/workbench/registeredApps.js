
export const COHORTS = [
  { name: 'New Custom Cohort',
    facets : [  ],
  },
  { name: 'Current Cohort',
    facets : [ { name:"Primary Site", op:"any of", value: "bronchus and lung"} ],
    case_count: "12,027",
    file_count: "52,234"
  },
  {
    name: "Baily's Cohort",
    facets: [
      { name: "Primary Site", op: "any of", value: "bronchus and lung" },
      { name: "Age of Diagnosis", op: "between", value: "65 and 89" },
    ],
    case_count: "2,425",
    file_count: "29,074"
  },
  { name: " Final Cohort",
    facets : [
      { name:"Primary Site", op:"any of ", value: "bronchus and lung"},
      { name:"Primary Diagnosis", op:"any_of", value: "squamous cell carcinoma, nos / squamous cell carcinoma, keratinizing, nos / basaloid squamous cell car…"},
      { name:"Age of Diagnosis", op:"between", value: "65 and 89"},
      { name:"Gene", op:"any of", value: "TP53,KMT2D,PIK3CA,NFE2L2,CDH8,KEAP1,PTEN,ADCY8,PTPRT,CALCR,GRM8,FBXW7,RB1,CDKN2A"}

    ],
    case_count: "179",
    file_count: "2,198"
  }
];


export const REGISTERED_APPS = [
  {
    name: "Clinical Data Analysis",
    icon: "icons/apps/cdave.svg",
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    id: "CDave",
    description: "Display basic statistical analyses for the selected case set."
  },
  {
    name: "Cohort Builder",
    icon: "icons/build.svg",
    tags: ["generalUtility"],
    hasDemo: false,
    id: "CohortBuilder",
    description: "Build and define your custom cohorts using a variety of clinical and biospecimen features."
  },
  {
    name: "Mutations Frequency",
    icon: "icons/apps/mutations.svg",
    tags: ["variantAnalysis", "ssm"],
    hasDemo: true,
    id: "MutationFrequencyApp",
    description: "Visualize most frequently mutated genes and most frequent somatic mutations."
  },
  {
    name: "Repository",
    icon: "icons/database.svg",
    tags: ["files"],
    hasDemo: false,
    id: "Downloads",
    description: "Browse and download the files associated with your cohort for more sophisticated analysis."
  },
  {
    name: "Studies",
    icon: "icons/crowd-of-users.svg",
    tags: [],
    hasDemo: false,
    id: "Studies",
    description: "View the Studies available within the GDC and select them for further exploration and analysis."
  },
  {
    name: "Cohort Comparison",
    icon: "icons/apps/cohortComparison.svg",
    tags: ["clinicalAnalysis"],
    hasDemo: true,
    id: "CohortComparison",
    description: "Display the survival analysis of your case sets and compare characteristics such as gender, vital status and age at diagnosis."
  },
  {
    name: "Gene Expression",
    icon: "gene-expression.png",
    tags: ["geneExpression"],
    hasDemo: true,
    id: "GeneExpression",
    description: "Visualize patterns in gene expression in your cohort."
  },
  {
    name: "Set Operations",
    icon: "icons/apps/setOps.svg",
    tags: ["variantAnalysis", "cnv", "ssm"],
    hasDemo: true,
    description: "Display Venn diagram and find intersection or union, etc. of your cohorts.",
    id: "SetOperations",
  },
  {
    name: "OncoGrid",
    icon: "icons/apps/oncogrid.svg",
    iconSize: { width: 124, height: 64},
    tags: ["variantAnalysis", "cnv", "ssm"],
    hasDemo: true,
    description: "Visualize the top most mutated cases and genes affected by high impact mutations in your cohort.",
    id: "OncoGrid",
  },
  {
    name: "Sequence Reads",
    icon: "sequence-reads.png",
    tags: ["sequenceAnalysis"],
    hasDemo: true,
    description: "Visualize sequencing reads.",
    id: "SequenceReads",
  },
  {
    name: "ProteinPaint",
    icon: "proteinpaint.png",
    iconSize: { width: 124, height: 64},
    tags: ["variantAnalysis","ssm" ],
    hasDemo: true,
    description:  "Visualize mutations in protein-coding genes.",
    id: "ProteinPaint",
  },
  {
    name: "scRNA-Seq",
    icon: "scRnaSeqViz.png",
    tags: ["geneExpression"],
    hasDemo: true,
    description:  "Visualize patterns in single-cell gene expression in your cohort.",
    id: "SingleCellRnaSeq",
  },
];

export const APPTAGS =  [
  { value: "clinicalAnalysis", name: "Clinical Analysis" },
  { value: "generalUtility",name: "General Utility" },
  { value: "variantAnalysis",name: "Variant Analysis" },
  { value: "geneExpression",name: "Gene Expression" },
  { value: "sequenceAnalysis",name: "Sequence Analysis" },
  { value: "cnv",name: "cnv" },
  { value: "ssm",name: "ssm" },
];

