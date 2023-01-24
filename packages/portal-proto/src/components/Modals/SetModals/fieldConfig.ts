export default {
  genes: {
    searchField: "gene_autocomplete.lowercase",
    mappedToFields: ["gene_id", "symbol"],
    matchAgainstIdentifiers: [
      "gene_id",
      "symbol",
      "external_db_ids.entrez_gene",
      "external_db_ids.hgnc",
      "external_db_ids.omim_gene",
      "external_db_ids.uniprotkb_swissprot",
    ],
    fieldDisplay: {
      symbol: "Symbol",
      gene_id: "Ensembl",
      "external_db_ids.entrez_gene": "Entrez",
      "external_db_ids.hgnc": "HGNC",
      "external_db_ids.uniprotkb_swissprot": "UniProtKB/Swiss-Prot",
      "external_db_ids.omim_gene": "OMIM",
    },
    createSetField: "gene_id",
    facetField: "genes.gene_id",
  },
  cases: {
    mappedToFields: ["submitter_id", "project.project_id"],
    matchAgainstIdentifiers: [
      "case_id",
      "submitter_id",
      "samples.sample_id",
      "samples.submitter_id",
      "samples.portions.portion_id",
      "samples.portions.submitter_id",
      "samples.portions.analytes.analyte_id",
      "samples.portions.analytes.submitter_id",
      "samples.portions.analytes.aliquots.aliquot_id",
      "samples.portions.analytes.aliquots.submitter_id",
      "samples.portions.slides.slide_id",
      "samples.portions.slides.submitter_id",
    ],
    searchField: "case_autocomplete.lowercase",
    fieldDisplay: {
      case_id: "Case UUID",
      submitter_id: "Case ID",
      "project.project_id": "Project",
      "samples.sample_id": "Sample UUID",
      "samples.submitter_id": "Sample ID",
      "samples.portions.portion_id": "Portion UUID",
      "samples.portions.submitter_id": "Portion ID",
      "samples.portions.slides.slide_id": "Slide UUID",
      "samples.portions.slides.submitter_id": "Slide ID",
      "samples.portions.analytes.analyte_id": "Analyte UUID",
      "samples.portions.analytes.submitter_id": "Analyte ID",
      "samples.portions.analytes.aliquots.aliquot_id": "Aliquot UUID",
      "samples.portions.analytes.aliquots.submitter_id": "Aliquot ID",
    },
    facetField: "cases.case_id",
    createSetField: "case_id",
  },
  ssms: {
    searchField: "ssm_autocomplete.lowercase",
    mappedToFields: ["ssm_id"],
    matchAgainstIdentifiers: ["ssm_id", "genomic_dna_change"],
    fieldDisplay: {
      ssm_id: "Mutation UUID",
      genomic_dna_change: "DNA Change",
    },
    createSetField: "ssm_id",
    facetField: "ssms.ssm_id",
  },
};
