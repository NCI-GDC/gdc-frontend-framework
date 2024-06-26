import {
  FacetDefinition,
  FilterSet,
  Operation,
  selectCurrentCohortFilters,
  useCoreSelector,
} from "@gff/core";
import { SummaryFacetInfo } from "./SummaryFacets";

export const upload_facets: Record<string, FacetDefinition> = {
  "cases.upload.case_id": {
    description: "Enter/upload cases to filter the current cohort",
    doc_type: "cases",
    facet_type: "upload",
    field: "cases.upload.case_id",
    full: "Upload Cases",
    range: undefined,
    type: "keyword",
  },
  "genes.gene_id": {
    description:
      "Enter/upload genes or select gene sets to filter the current cohort",
    doc_type: "cases",
    facet_type: "upload",
    field: "genes.gene_id",
    full: "Upload Mutated Genes",
    range: undefined,
    type: "keyword",
  },
  "ssms.ssm_id": {
    description:
      "Enter/upload simple mutations or select mutation sets to filter the current cohort",
    doc_type: "cases",
    facet_type: "upload",
    field: "ssms.ssm_id",
    full: "Upload Simple Mutations",
    range: undefined,
    type: "keyword",
  },
};
/**
 * getFacetInfo: returns information from the GDC API: description, full field, type, etc.
 * It returns information ONLY for defined fields
 * @param fields - array of fields to return data for
 * @returns array of FacetDefinitions
 */
export const getFacetInfo = (
  fields: ReadonlyArray<string>,
  facets: Record<string, FacetDefinition>,
): ReadonlyArray<FacetDefinition> => {
  return fields.map((field) => facets[field]).filter((facet) => facet);
};

export const useCohortFacetFilters = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const METADATA_FIELDS = [
  "state",
  "access",
  "md5sum",
  "data_format",
  "data_type",
  "data_category",
  "file_name",
  "file_size",
  "file_id",
  "platform",
  "experimental_strategy",
  "center.short_name",
  "annotations.annotation_id",
  "annotations.entity_id",
  "tags",
  "submitter_id",
  "archive.archive_id",
  "archive.submitter_id",
  "archive.revision",
  "associated_entities.entity_id",
  "associated_entities.entity_type",
  "associated_entities.case_id",
  "analysis.analysis_id",
  "analysis.workflow_type",
  "analysis.updated_datetime",
  "analysis.input_files.file_id",
  "analysis.metadata.read_groups.read_group_id",
  "analysis.metadata.read_groups.is_paired_end",
  "analysis.metadata.read_groups.read_length",
  "analysis.metadata.read_groups.library_name",
  "analysis.metadata.read_groups.sequencing_center",
  "analysis.metadata.read_groups.sequencing_date",
  "downstream_analyses.output_files.access",
  "downstream_analyses.output_files.file_id",
  "downstream_analyses.output_files.file_name",
  "downstream_analyses.output_files.data_category",
  "downstream_analyses.output_files.data_type",
  "downstream_analyses.output_files.data_format",
  "downstream_analyses.workflow_type",
  "downstream_analyses.output_files.file_size",
  "index_files.file_id",
];

export const METADATA_EXPAND_PROPS = [
  "metadata_files",
  "annotations",
  "archive",
  "associated_entities",
  "center",
  "analysis",
  "analysis.input_files",
  "analysis.metadata",
  "analysis.metadata_files",
  "analysis.downstream_analyses",
  "analysis.downstream_analyses.output_files",
  "reference_genome",
  "index_file",
];

export const SAMPLE_SHEET_FIELDS = [
  "file_id",
  "file_name",
  "data_category",
  "data_type",
  "cases.project.project_id",
  "cases.submitter_id",
  "cases.samples.submitter_id",
  "cases.samples.sample_type",
];

export const INITIAL_SUMMARY_FIELDS = [
  {
    field: "cases.primary_site",
    name: "Primary Site",
    docType: "cases",
    indexType: "explore",
  },
  {
    field: "cases.disease_type",
    name: "Disease Type",
    docType: "cases",
    indexType: "explore",
  },
  {
    field: "cases.project.project_id",
    name: "Project",
    docType: "cases",
    indexType: "explore",
  },
  {
    field: "cases.project.program.name",
    name: "Program",
    docType: "cases",
    indexType: "explore",
  },
  {
    field: "cases.demographic.gender",
    name: "Gender",
    docType: "cases",
    indexType: "explore",
  },
] as ReadonlyArray<SummaryFacetInfo>;

export const INVALID_COHORT_NAMES = ["unsaved_cohort"];
