import { GqlOperation } from "./filters";

export type UnknownJson = Record<string, unknown>;
export interface GdcApiResponse<H = UnknownJson> {
  readonly data: GdcApiData<H>;
  readonly warnings: Record<string, string>;
}

export interface GdcApiData<H> {
  readonly hits: ReadonlyArray<H>;
  readonly aggregations?: Record<string, Buckets | Stats>;
  readonly pagination: Pagination;
}

export interface Buckets {
  readonly buckets: ReadonlyArray<Bucket>;
}

export interface Bucket {
  readonly doc_count: number;
  readonly key: string;
}

export interface Stats {
  readonly stats: Statistics;
}

export interface Statistics {
  readonly count: number;
  readonly min?: number;
  readonly max?: number;
  readonly avg?: number;
  readonly sum: number;
}

export interface Pagination {
  readonly count: number;
  readonly total: number;
  readonly size: number;
  readonly from: number;
  readonly sort: string;
  readonly page: number;
  readonly pages: number;
}

export type gdcEndpoint =
  | "annotations"
  | "history"
  | "case_ssms"
  | "cases"
  | "cnv_occurrences"
  | "cnvs"
  | "files"
  | "genes"
  | "projects"
  | "ssm_occurrences"
  | "ssms";

/**
 * The request for requesting data from the GDC API
 * @property filters - A FilterSet object
 * @property case_filters - A FilterSet object
 * @property fields - An array of fields to return
 * @property expand - An array of fields to expand
 * @property format - The format of the response
 * @property size - The number of cases to return
 * @property from - The offset from which to return cases
 * @property sortBy - An array of fields to sort by
 * @property facets - An array of fields to facet by
 * @category GDC API
 */
export interface GdcApiRequest {
  readonly filters?: GqlOperation;
  readonly case_filters?: GqlOperation;
  readonly fields?: ReadonlyArray<string>;
  readonly expand?: ReadonlyArray<string>;
  readonly format?: "JSON" | "TSV" | "XML";
  readonly size?: number;
  readonly from?: number;
  readonly sortBy?: ReadonlyArray<SortBy>;
  readonly facets?: ReadonlyArray<string>;
}

export interface SortBy {
  readonly field: string;
  readonly direction: "asc" | "desc";
}

export interface GdcApiMapping {
  readonly _mapping: Record<string, FieldDetails>;
  readonly defaults: ReadonlyArray<string>;
  readonly expand: ReadonlyArray<string>;
  readonly fields: ReadonlyArray<string>;
  readonly multi: ReadonlyArray<string>;
  readonly nested: ReadonlyArray<string>;
}

export const FieldTypes = [
  "boolean",
  "double",
  "float",
  "id",
  "keyword",
  "long",
  "text",
] as const;
export type FieldType = (typeof FieldTypes)[number];

export interface FieldDetails {
  readonly description: string;
  readonly doc_type:
    | "annotations"
    | "history"
    | "case_centrics"
    | "cases"
    | "cnv_centrics"
    | "cnv_occurrence_centrics"
    | "files"
    | "gene_centric"
    | "projects"
    | "ssm_centrics"
    | "ssm_occurrence_centrics";
  readonly field: string;
  readonly full: string;
  readonly type: FieldType;
}

export interface FetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly gdcApiReq?: GdcApiRequest;
}

export interface EndpointRequestProps {
  readonly request: GdcApiRequest;
  readonly fetchAll?: boolean;
}

export interface caseFileType {
  readonly access: "open" | "controlled";
  readonly acl: Array<string>;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly state: string;
  readonly project_id: string;
  readonly data_format: string;
  readonly created_datetime: string;
  readonly submitter_id: string;
  readonly updated_datetime: string;
  readonly data_category: string;
  readonly md5sum: string;
  readonly type: string;
}

export interface Demographic {
  readonly demographic_id: string | null;
  readonly ethnicity: string | null;
  readonly gender: string | null;
  readonly race: string | null;
  readonly submitter_id: string | null;
  readonly vital_status: string | null;
  readonly days_to_birth: number | null;
  readonly days_to_death: number | null;
}

export interface Diagnoses {
  readonly age_at_diagnosis: number | null;
  readonly classification_of_tumor: string | null;
  readonly days_to_last_follow_up: number | null;
  readonly days_to_last_known_disease_status: number | null;
  readonly days_to_recurrence: number | null;
  readonly diagnosis_id: string | null;
  readonly last_known_disease_status: string | null;
  readonly morphology: string | null;
  readonly primary_diagnosis: string | null;
  readonly prior_malignancy: string | null;
  readonly progression_or_recurrence: string | null;
  readonly site_of_resection_or_biopsy: string | null;
  readonly submitter_id: string | null;
  readonly synchronous_malignancy: string | null;
  readonly tissue_or_organ_of_origin: string | null;
  readonly treatments?: ReadonlyArray<{
    readonly days_to_treatment_start?: number | null;
    readonly submitter_id: string | null;
    readonly therapeutic_agents?: string | null;
    readonly treatment_id: string | null;
    readonly treatment_intent_type?: string | null;
    readonly treatment_or_therapy?: string | null;
  }>;
  readonly tumor_grade: string | null;
}

export interface FamilyHistories {
  readonly family_history_id: string | null;
  readonly relationship_age_at_diagnosis: number | null;
  readonly relationship_gender: string | null;
  readonly relationship_primary_diagnosis: string | null;
  readonly relationship_type: string | null;
  readonly relative_with_cancer_history: string | null;
  readonly submitter_id: string | null;
}

export interface FollowUps {
  readonly days_to_follow_up: number | null;
  readonly disease_response: string | null;
  readonly ecog_performance_status: string | null;
  readonly follow_up_id: string | null;
  readonly karnofsky_performance_status: number | null;
  readonly molecular_tests?: ReadonlyArray<{
    readonly aa_change: string | null;
    readonly antigen: string | null;
    readonly biospecimen_type: string | null;
    readonly chromosome: string | null;
    readonly gene_symbol: string | null;
    readonly laboratory_test: string | null;
    readonly mismatch_repair_mutation: string | null;
    readonly molecular_analysis_method: string | null;
    readonly molecular_test_id: string | null;
    readonly second_gene_symbol: string | null;
    readonly submitter_id: string | null;
    readonly test_result: string | null;
    readonly test_units: string | null;
    readonly test_value: number | null;
    readonly variant_type: string | null;
  }>;
  readonly other_clinical_attributes?: ReadonlyArray<{
    readonly submitter_id: string;
    readonly other_clinical_attribute_id: string;
    readonly timepoint_category?: string;
    readonly nononcologic_therapeutic_agents?: string;
    readonly treatment_frequency?: number;
    readonly weight?: number;
    readonly height?: number;
    readonly bmi?: number;
  }>;
  readonly progression_or_recurrence: number | null;
  readonly progression_or_recurrence_anatomic_site: number | null;
  readonly progression_or_recurrence_type: number | null;
  readonly submitter_id: string | null;
}

export interface Exposures {
  readonly alcohol_history: string | null;
  readonly alcohol_intensity: string | null;
  readonly exposure_id: string | null;
  readonly tobacco_smoking_status: string | null;
  readonly submitter_id: string | null;
  readonly pack_years_smoked: number | null;
}

export interface CaseDefaults {
  readonly case_id: string;
  readonly disease_type: string;
  readonly files?: Array<caseFileType>;
  readonly demographic?: Demographic;
  readonly diagnoses?: ReadonlyArray<Diagnoses>;
  readonly family_histories?: ReadonlyArray<FamilyHistories>;
  readonly follow_ups?: ReadonlyArray<FollowUps>;
  readonly exposures?: ReadonlyArray<Exposures>;
  readonly id: string;
  readonly primary_site: string;
  readonly project: {
    readonly name: string;
    readonly program: {
      readonly name: string;
    };
    readonly project_id: string;
  };
  readonly submitter_id: string;
  readonly summary: {
    readonly data_categories: Array<{
      readonly data_category: string;
      readonly file_count: number;
    }>;
    readonly experimental_strategies: Array<{
      readonly experimental_strategy: string;
      readonly file_count: number;
    }>;
    readonly file_count: number;
  };

  readonly consent_type?: string;
  readonly days_to_consent?: number;
  readonly days_to_lost_to_followup?: number;
  readonly index_date?: string;
  readonly lost_to_followup?: string;

  readonly aliquot_ids?: ReadonlyArray<string>;
  readonly analyte_ids?: ReadonlyArray<string>;
  readonly diagnosis_ids?: ReadonlyArray<string>;
  readonly portion_ids?: ReadonlyArray<string>;
  readonly sample_ids?: ReadonlyArray<string>;
  readonly slide_ids?: ReadonlyArray<string>;
  readonly submitter_aliquot_ids?: ReadonlyArray<string>;
  readonly submitter_analyte_ids?: ReadonlyArray<string>;
  readonly submitter_diagnosis_ids?: ReadonlyArray<string>;
  readonly submitter_portion_ids?: ReadonlyArray<string>;
  readonly submitter_sample_ids?: ReadonlyArray<string>;
  readonly submitter_slide_ids?: ReadonlyArray<string>;
}

export interface ProjectDefaults {
  readonly dbgap_accession_number: string;
  readonly disease_type: Array<string>;
  readonly name: string;
  readonly primary_site: Array<string>;
  readonly project_id: string;
  readonly summary?: {
    readonly case_count: number;
    readonly file_count: number;
    readonly file_size: number;
    readonly data_categories?: Array<{
      readonly case_count: number;
      readonly data_category: string;
      readonly file_count: number;
    }>;
    readonly experimental_strategies?: Array<{
      readonly case_count: number;
      readonly experimental_strategy: string;
      readonly file_count: number;
    }>;
  };
  readonly program?: {
    readonly dbgap_accession_number: string;
    readonly name: string;
    readonly program_id: string;
  };
}

export interface AnnotationDefaults {
  readonly id: string;
  readonly entity_submitter_id: string;
  readonly notes: string;
  readonly submitter_id: string;
  readonly classification: string;
  readonly entity_id: string;
  readonly created_datetime: string;
  readonly annotation_id: string;
  readonly entity_type: string;
  readonly updated_datetime: string;
  readonly case_id: string;
  readonly state: string;
  readonly category: string;
  readonly case_submitter_id: string;
  readonly status: string;
  readonly project?: {
    readonly primary_site: Array<string>;
    readonly dbgap_accession_number: string;
    readonly project_id: string;
    readonly disease_type: Array<string>;
    readonly name: string;
    readonly releasable: boolean;
    readonly state: string;
    readonly released: boolean;
    readonly program?: {
      readonly name: string;
      readonly program_id: string;
      readonly dbgap_accession_number: string;
    };
  };
}

interface transcript {
  aa_change: string;
  aa_end: number;
  aa_start: number;
  annotation: {
    ccds: string;
    dbsnp_rs: string;
    existing_variation: string;
    hgvsc: string;
    polyphen_impact: string;
    polyphen_score: number;
    pubmed: string;
    sift_impact: string;
    sift_score: number;
    transcript_id: string;
    vep_impact: string;
  };
  is_canonical: boolean;
  transcript_id: string;
  consequence_type: string;
  gene?: GenesDefaults;
}

export interface SSMSDefaults {
  id: string;
  ssm_id: string;
  consequence: Array<{ transcript: transcript }>;
  clinical_annotations?: {
    civic: {
      variant_id: string;
    };
  };
  reference_allele: string;
  ncbi_build: string;
  cosmic_id: Array<string>;
  mutation_subtype: string;
  chromosome: string;
  genomic_dna_change: string;
}

export interface HistoryDefaults {
  readonly uuid: string;
  readonly version: string;
  readonly file_change: string;
  readonly release_date: string;
  readonly data_release: string;
}

export interface FileDefaults {
  readonly id?: string;
  readonly submitter_id: string;
  readonly access: string;
  readonly acl: ReadonlyArray<string>;
  readonly created_datetime: string;
  readonly updated_datetime: string;
  readonly data_category: string;
  readonly data_format: string;
  readonly data_release?: string;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly md5sum: string;
  readonly platform?: string;
  readonly state: string;
  readonly type: string;
  readonly version?: string;
  readonly experimental_strategy?: string;
  readonly total_reads?: number;
  readonly average_base_quality?: number;
  readonly average_insert_size?: number;
  readonly average_read_length?: number;
  readonly mean_coverage?: number;
  readonly pairs_on_diff_chr?: number;
  readonly contamination?: number;
  readonly contamination_error?: number;
  readonly proportion_reads_mapped?: number;
  readonly proportion_reads_duplicated?: number;
  readonly proportion_base_mismatch?: number;
  readonly proportion_targets_no_coverage?: number;
  readonly proportion_coverage_10x?: number;
  readonly proportion_coverage_30x?: number;
  readonly msi_score?: number;
  readonly msi_status?: number;
  readonly annotations?: ReadonlyArray<{
    readonly annotation_id: string;
    readonly category: string;
    readonly classification: string;
    readonly created_datetime: string;
    readonly entity_id: string;
    readonly entity_submitter_id: string;
    readonly entity_type: string;
    readonly notes: string;
    readonly state: string;
    readonly status: string;
    readonly updated_datetime: string;
  }>;
  readonly cases?: ReadonlyArray<{
    readonly case_id: string;
    readonly submitter_id: string;
    readonly annotations?: ReadonlyArray<{
      readonly annotation_id: string;
    }>;
    readonly project?: {
      readonly dbgap_accession_number?: string;
      readonly disease_type: string;
      readonly name: string;
      readonly primary_site: string;
      readonly project_id: string;
      readonly releasable: boolean;
      readonly released: boolean;
      readonly state: string;
    };
    readonly samples?: ReadonlyArray<{
      readonly sample_id: string;
      readonly tissue_type: string;
      readonly tumor_descriptor: string;
      readonly submitter_id: string;
      readonly portions?: ReadonlyArray<{
        readonly submitter_id: string;
        readonly analytes?: ReadonlyArray<{
          readonly analyte_id: string;
          readonly analyte_type: string;
          readonly submitter_id: string;
          readonly aliquots?: ReadonlyArray<{
            readonly aliquot_id: string;
            readonly submitter_id: string;
          }>;
        }>;
        readonly slides?: ReadonlyArray<{
          readonly created_datetime: string | null;
          readonly number_proliferating_cells: number | null;
          readonly percent_eosinophil_infiltration: number | null;
          readonly percent_granulocyte_infiltration: number | null;
          readonly percent_inflam_infiltration: number | null;
          readonly percent_lymphocyte_infiltration: number | null;
          readonly percent_monocyte_infiltration: number | null;
          readonly percent_neutrophil_infiltration: number | null;
          readonly percent_necrosis: number | null;
          readonly percent_normal_cells: number | null;
          readonly percent_stromal_cells: number | null;
          readonly percent_tumor_cells: number | null;
          readonly percent_tumor_nuclei: number | null;
          readonly section_location: string | null;
          readonly slide_id: string | null;
          readonly state: string | null;
          readonly submitter_id: string | null;
          readonly updated_datetime: string | null;
        }>;
      }>;
    }>;
  }>;
  readonly associated_entities?: ReadonlyArray<{
    readonly entity_submitter_id: string;
    readonly entity_type: string;
    readonly case_id: string;
    readonly entity_id: string;
  }>;
  readonly analysis?: {
    readonly workflow_type: string;
    readonly updated_datetime: string;
    readonly input_files?: ReadonlyArray<{
      readonly file_name: string;
      readonly data_category: string;
      readonly data_type: string;
      readonly data_format: string;
      readonly file_size: number;
      readonly file_id: string;
      readonly state: string;
      readonly submitter_id: string;
      readonly access: string;
      readonly created_datetime: string;
      readonly updated_datetime: string;
      readonly md5sum: string;
    }>;
    readonly metadata?: {
      readonly read_groups: Array<{
        readonly read_group_id: string;
        readonly is_paired_end: boolean;
        readonly read_length: number;
        readonly library_name: string;
        readonly sequencing_center: string;
        readonly sequencing_date: string;
      }>;
    };
  };
  readonly downstream_analyses?: ReadonlyArray<{
    readonly workflow_type: string;
    readonly output_files?: ReadonlyArray<{
      readonly file_name: string;
      readonly data_category: string;
      readonly data_type: string;
      readonly data_format: string;
      readonly file_size: number;
      readonly file_id: string;
      readonly state: string;
      readonly submitter_id: string;
      readonly access: string;
      readonly created_datetime: string;
      readonly updated_datetime: string;
      readonly md5sum: string;
    }>;
  }>;
  readonly index_files?: ReadonlyArray<{
    readonly submitter_id: string;
    readonly created_datetime: string;
    readonly updated_datetime: string;
    readonly data_category: string;
    readonly data_format: string;
    readonly data_type: string;
    readonly file_id: string;
    readonly file_name: string;
    readonly file_size: number;
    readonly md5sum: string;
    readonly state: string;
  }>;
}

export interface GenesDefaults {
  readonly biotype: string;
  readonly symbol: string;
  readonly cytoband: ReadonlyArray<string>;
  readonly synonyms: ReadonlyArray<string>;
  readonly description: string;
  readonly canonical_transcript_id: string;
  readonly canonical_transcript_length: number;
  readonly canonical_transcript_length_cds: number;
  readonly canonical_transcript_length_genomic: string;
  readonly gene_chromosome: string;
  readonly gene_end: string;
  readonly gene_id: string;
  readonly gene_start: number;
  readonly gene_strand: string;
  readonly is_cancer_gene_census: boolean;
  readonly name: string;
}
