import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAcess";
import { CoreState } from "../../store";
import * as filesApi from "./filesApi";

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
  "BCR XML",
  "TSV",
  "BCR SSF XML",
  "BEDPE",
  "BCR AUXILIARY XML",
  "BCR OMF XML",
  "BCR BIOTAB",
  "BCR PPS XML",
  "CDC JSON",
  "XLSX",
  "MEX",
  "HDF5",
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
  "Raw CGI Variant",
  "Raw Simple Somatic Mutation",
  "Single Cell Analysis",
  "Slide Image",
  "Splice Junction Quantification",
  "Structural Rearrangement",
  "Transcript Fusion",
  "miRNA Expression Quantification",
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
  readonly state: string;
  readonly fileType: FileType;
  readonly version: string;
  readonly experimentalStrategy?: ExperimentalStrategy;
}

export interface FilesState {
  readonly files?: ReadonlyArray<GdcFile>;
  readonly status: DataStatus;
  readonly error?: string;
}

export const fetchFiles = createAsyncThunk("files/fetchFiles", async () => {
  return await filesApi.fetchFiles();
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
          state.error = Object.values(response.warnings)[0]; // TODO add better warnings parsing
        } else {
          state.files = response.data.hits.map((hit) => ({
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
            state: hit.state,
            fileType: asFileType(hit.type),
            version: hit.version,
            experimentalStrategy: asExperimentalStrategy(
              hit.experimental_strategy,
            ),
          }));
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
