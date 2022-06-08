import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  fetchGdcFiles,
  GdcApiRequest,
  GdcApiResponse,
  FileDefaults,
} from "../gdcapi/gdcapi";

const accessTypes = ["open", "controlled"] as const;

export type AccessType = typeof accessTypes[number];

const isAccessType = (x: unknown): x is AccessType => {
  return accessTypes.some((t) => t === x);
};

const asAccessType = (x: unknown): AccessType => {
  if (isAccessType(x)) {
    return x;
  } else {
    throw new Error(`${x} is not a valid access type`);
  }
};

const fileTypes = [
  "annotated_somatic_mutation",
  "simple_somatic_mutation",
  "aligned_reads",
  "gene_expression",
  "copy_number_segment",
  "copy_number_estimate",
  "slide_image",
  "mirna_expression",
  "biospecimen_supplement",
  "clinical_supplement",
  "methylation_beta_value",
  "structural_variation",
  "aggregated_somatic_mutation",
  "masked_somatic_mutation",
  "secondary_expression_analysis",
  "masked_methylation_array",
  "protein_expression",
  "pathology_report",
] as const;

export type FileType = typeof fileTypes[number];

const isFileType = (x: unknown): x is FileType => {
  return fileTypes.some((t) => t === x);
};

const asFileType = (x: unknown): FileType => {
  if (isFileType(x)) {
    return x;
  } else {
    throw new Error(`${x} is not a valid file type`);
  }
};

const dataCategories: ReadonlyArray<string> = [
  "Simple Nucleotide Variation",
  "Copy Number Variation",
  "Transcriptome Profiling",
  "Proteome Profiling",
  "Sequencing Reads",
  "Biospecimen",
  "Clinical",
  "DNA Methylation",
  "Structural Variation",
  "Somatic Structural Variation",
  "Combined Nucleotide Variation",
] as const;

export type DataCategory = typeof dataCategories[number];

const isDataCategory = (x: unknown): x is DataCategory => {
  return dataCategories.some((t) => t === x);
};

const asDataCategory = (x: unknown): DataCategory => {
  if (isDataCategory(x)) {
    return x;
  } else {
    throw new Error(`${x} is not a valid data category`);
  }
};

const dataFormats = [
  "TXT",
  "VCF",
  "BAM",
  "MAF",
  "SVS",
  "IDAT",
  "BCR XML",
  "TSV",
  "BCR SSF XML",
  "BEDPE",
  "BCR AUXILIARY XML",
  "BCR OMF XML",
  "BCR BIOTAB",
  "BCR Biotab",
  "BCR PPS XML",
  "CDC JSON",
  "XLSX",
  "MEX",
  "HDF5",
  "PDF",
] as const;

export type DataFormat = typeof dataFormats[number];

const isDataFormat = (x: unknown): x is DataFormat => {
  return dataFormats.some((t) => t === x);
};

const asDataFormat = (x: unknown): DataFormat => {
  if (isDataFormat(x)) {
    return x;
  } else {
    throw new Error(`${x} is not a valid data format`);
  }
};

const dataTypes = [
  "Aggregated Somatic Mutation",
  "Aligned Reads",
  "Allele-specific Copy Number Segment",
  "Annotated Somatic Mutation",
  "Biospecimen Supplement",
  "Clinical Supplement",
  "Copy Number Segment",
  "Differential Gene Expression",
  "Gene Expression Quantification",
  "Gene Level Copy Number Scores",
  "Gene Level Copy Number",
  "Isoform Expression Quantification",
  "Masked Annotated Somatic Mutation",
  "Masked Copy Number Segment",
  "Masked Somatic Mutation",
  "Methylation Beta Value",
  "Protein Expression Quantification",
  "Raw CGI Variant",
  "Raw Simple Somatic Mutation",
  "Single Cell Analysis",
  "Slide Image",
  "Splice Junction Quantification",
  "Structural Rearrangement",
  "Transcript Fusion",
  "Masked Intensities",
  "miRNA Expression Quantification",
  "Pathology Report",
] as const;

export type DataType = typeof dataTypes[number];

const isDataType = (x: unknown): x is DataType => {
  return dataTypes.some((t) => t === x);
};

const asDataType = (x: unknown): DataType => {
  if (isDataType(x)) {
    return x;
  } else {
    throw new Error(`${x} is not a valid data type`);
  }
};

const experimentalStrategies = [
  "ATAC-Seq",
  "Diagnostic Slide",
  "Genotyping Array",
  "Methylation Array",
  "RNA-Seq",
  "Targeted Sequencing",
  "Tissue Slide",
  "WGS",
  "WXS",
  "miRNA-Seq",
  "scRNA-Seq",
  "_missing",
  "Reverse Phase Protein Array",
] as const;

export type ExperimentalStrategy = typeof experimentalStrategies[number];

const isExperimentalStrategy = (x: unknown): x is ExperimentalStrategy => {
  return experimentalStrategies.some((t) => t === x);
};

const asExperimentalStrategy = (
  x: unknown,
): ExperimentalStrategy | undefined => {
  if (x === undefined) {
    return undefined;
  }

  if (isExperimentalStrategy(x)) {
    return x;
  }

  throw new Error(`${x} is not a valid experimental strategy`);
};

export interface GdcFile {
  readonly id: string;
  readonly submitterId: string;
  readonly access: AccessType;
  readonly acl: ReadonlyArray<string>;
  readonly createDatetime: string;
  readonly updatedDatetime: string;
  readonly dataCategory: DataCategory;
  readonly dataFormat: DataFormat;
  readonly dataRelease: string;
  readonly dataType: DataType;
  readonly fileId: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly md5sum: string;
  readonly platform: string;
  readonly state: string;
  readonly fileType: FileType;
  readonly version: string;
  readonly experimentalStrategy?: ExperimentalStrategy;
  readonly project_id?: string;
  readonly cases?: ReadonlyArray<{
    readonly case_id: string;
    readonly submitter_id: string;
    readonly annotations?: ReadonlyArray<string>;
    readonly samples?: ReadonlyArray<{
      readonly sample_id: string;
      readonly sample_type: string;
      readonly submitter_id: string;
      readonly tissue_type: string;
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
    readonly input_files?: ReadonlyArray<string>;
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
    }>;
  }>;
}

export interface FilesState {
  readonly files?: ReadonlyArray<GdcFile>;
  readonly status: DataStatus;
  readonly error?: string;
}

export const fetchFiles = createAsyncThunk<
  GdcApiResponse<FileDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("files/fetchFiles", async (request?: GdcApiRequest) => {
  return await fetchGdcFiles(request);
});

const initialState: FilesState = {
  status: "uninitialized",
};

const slice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.files = [];
          state.status = "rejected";
          state.error = Object.values(response.warnings)[0]; // TODO add better errors parsing
        } else {
          state.files = response.data.hits.map((hit) => {
            return {
              id: hit.id,
              submitterId: hit.submitter_id,
              access: asAccessType(hit.access),
              acl: [...hit.acl],
              createDatetime: hit.create_datetime,
              updatedDatetime: hit.updated_datetime,
              dataCategory: asDataCategory(hit.data_category),
              dataFormat: asDataFormat(hit.data_format),
              dataRelease: hit.data_release,
              dataType: asDataType(hit.data_type),
              fileId: hit.file_id,
              fileName: hit.file_name,
              fileSize: hit.file_size,
              md5sum: hit.md5sum,
              platform: hit.platform,
              state: hit.state,
              fileType: asFileType(hit.type),
              version: hit.version,
              experimentalStrategy: asExperimentalStrategy(
                hit.experimental_strategy,
              ),
              project_id: hit.cases?.[0]?.project?.project_id,
              cases: hit.cases?.map((caseObj) => {
                return {
                  case_id: caseObj.case_id,
                  submitter_id: caseObj.submitter_id,
                  annotations: caseObj.annotations?.map(
                    (annotation) => annotation.annotation_id,
                  ),
                  samples: caseObj.samples?.map((sample) => {
                    return {
                      sample_id: sample.sample_id,
                      sample_type: sample.sample_type,
                      submitter_id: sample.submitter_id,
                      tissue_type: sample.tissue_type,
                      portions: sample.portions?.map((portion) => {
                        return {
                          submitter_id: portion.submitter_id,
                          analytes: portion.analytes?.map((analyte) => {
                            return {
                              analyte_id: analyte.analyte_id,
                              analyte_type: analyte.analyte_type,
                              submitter_id: analyte.submitter_id,
                              aliquots: analyte.aliquots?.map((aliquot) => {
                                return {
                                  aliquot_id: aliquot.aliquot_id,
                                  submitter_id: aliquot.submitter_id,
                                };
                              }),
                            };
                          }),
                          slides: portion.slides?.map((slide) => {
                            return {
                              number_proliferating_cells:
                                slide.number_proliferating_cells,
                              percent_eosinophil_infiltration:
                                slide.percent_eosinophil_infiltration,
                              percent_granulocyte_infiltration:
                                slide.percent_granulocyte_infiltration,
                              percent_inflam_infiltration:
                                slide.percent_inflam_infiltration,
                              percent_lymphocyte_infiltration:
                                slide.percent_lymphocyte_infiltration,
                              percent_monocyte_infiltration:
                                slide.percent_monocyte_infiltration,
                              percent_necrosis: slide.percent_necrosis,
                              percent_neutrophil_infiltration:
                                slide.percent_neutrophil_infiltration,
                              percent_normal_cells: slide.percent_normal_cells,
                              percent_stromal_cells:
                                slide.percent_stromal_cells,
                              percent_tumor_cells: slide.percent_tumor_cells,
                              percent_tumor_nuclei: slide.percent_tumor_nuclei,
                              section_location: slide.section_location,
                              slide_id: slide.slide_id,
                              state: slide.state,
                              submitter_id: slide.submitter_id,
                              updated_datetime: slide.updated_datetime,
                              created_datetime: slide.created_datetime,
                            };
                          }),
                        };
                      }),
                    };
                  }),
                };
              }),
              associated_entities: hit.associated_entities?.map(
                (associated_entity) => ({
                  entity_submitter_id: associated_entity.entity_submitter_id,
                  entity_type: associated_entity.entity_type,
                  case_id: associated_entity.case_id,
                  entity_id: associated_entity.entity_id,
                }),
              ),
              analysis: hit.analysis
                ? {
                    workflow_type: hit.analysis.workflow_type,
                    updated_datetime: hit.analysis.updated_datetime,
                    input_files: hit.analysis.input_files?.map(
                      (file) => file.file_id,
                    ),
                  }
                : undefined,
              downstream_analyses: hit.downstream_analyses?.map((analysis) => {
                return {
                  workflow_type: analysis.workflow_type,
                  output_files: analysis.output_files?.map((file) => {
                    return {
                      file_name: file.file_name,
                      data_category: file.data_category,
                      data_type: file.data_type,
                      data_format: file.data_format,
                      file_size: file.file_size,
                      file_id: file.file_id,
                    };
                  }),
                };
              }),
            };
          });
          state.status = "fulfilled";
          state.error = undefined;
        }
      })
      .addCase(fetchFiles.pending, (state) => {
        state.files = [];
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(fetchFiles.rejected, (state) => {
        state.files = [];
        state.status = "rejected";
        state.error = undefined; // TODO - extract error message from object or error
      });
  },
});

export const filesReducer = slice.reducer;

export const selectFilesState = (state: CoreState): FilesState => state.files;

export const selectFiles = (
  state: CoreState,
): ReadonlyArray<GdcFile> | undefined => state.files.files;

export const selectFilesData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<GdcFile> | undefined> => {
  return {
    data: state.files.files,
    status: state.files.status,
    error: state.files.error,
  };
};
