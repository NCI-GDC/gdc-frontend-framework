import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import * as filesApi from "./filesApi";

export type AccessType = "open" | "controlled";

export type FileType =
  | "annotated_somatic_mutation"
  | "simple_somatic_mutation"
  | "aligned_reads"
  | "gene_expression"
  | "copy_number_segment"
  | "copy_number_estimate"
  | "slide_image"
  | "mirna_expression"
  | "biospecimen_supplement"
  | "clinical_supplement"
  | "methylation_beta_value"
  | "structural_variation"
  | "aggregated_somatic_mutation"
  | "masked_somatic_mutation"
  | "secondary_expression_analysis";

export type DataCategory =
  | "simple nucleotide variation"
  | "copy number variation"
  | "transcriptome profiling"
  | "sequencing reads"
  | "biospecimen"
  | "clinical"
  | "dna methylation"
  | "structural variation"
  | "somatic structural variation"
  | "combined nucleotide variation";

export type DataFormat =
  | "txt"
  | "vcf"
  | "bam"
  | "maf"
  | "svs"
  | "bcr xml"
  | "tsv"
  | "bcr ssf xml"
  | "bedpe"
  | "bcr auxiliary xml"
  | "bcr omf xml"
  | "bcr biotab"
  | "bcr pps xml"
  | "cdc json"
  | "xlsx"
  | "mex"
  | "hdf5";

export type DataType =
  | "Aggregated Somatic Mutation"
  | "Aligned Reads"
  | "Allele-specific Copy Number Segment"
  | "Annotated Somatic Mutation"
  | "Biospecimen Supplement"
  | "Clinical Supplement"
  | "Copy Number Segment"
  | "Differential Gene Expression"
  | "Gene Expression Quantification"
  | "Gene Level Copy Number Scores"
  | "Gene Level Copy Number"
  | "Isoform Expression Quantification"
  | "Masked Annotated Somatic Mutation"
  | "Masked Copy Number Segment"
  | "Masked Somatic Mutation"
  | "Methylation Beta Value"
  | "Raw CGI Variant"
  | "Raw Simple Somatic Mutation"
  | "Single Cell Analysis"
  | "Slide Image"
  | "Splice Junction Quantification"
  | "Structural Rearrangement"
  | "Transcript Fusion"
  | "miRNA Expression Quantification";

export type ExperimentalStrategy =
  | "ATAC-Seq"
  | "Diagnostic Slide"
  | "Genotyping Array"
  | "Methylation Array"
  | "RNA-Seq"
  | "Targeted Sequencing"
  | "Tissue Slide"
  | "WGS"
  | "WXS"
  | "miRNA-Seq"
  | "scRNA-Seq"
  | "_missing";

export interface GdcFile {
  id: string;
  submitterId: string;
  access: AccessType;
  acl: ReadonlyArray<string>;
  createDatetime: string;
  updatedDatetime: string;
  dataCategory: DataCategory;
  dataFormat: DataFormat;
  dataRelease: string;
  dataType: DataType;
  fileId: string;
  fileName: string;
  fileSize: number;
  md5sum: string;
  state: string;
  type: FileType;
  version: string;
  experimentalStrategy: ExperimentalStrategy;
}

export type Status = "pending" | "fulfilled" | "rejected";

export interface FilesState {
  readonly files?: ReadonlyArray<GdcFile>;
  readonly status?: string;
  readonly error?: string;
}

export const fetchFiles = createAsyncThunk("files/fetchFiles", async () => {
  return await filesApi.fetchFiles();
});

const initialState: FilesState = {};

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
            access: hit.access,
            acl: hit.acl,
            createDatetime: hit.create_datetime,
            updatedDatetime: hit.updated_datetime,
            dataCategory: hit.data_category,
            dataFormat: hit.data_format,
            dataRelease: hit.data_release,
            dataType: hit.data_type,
            fileId: hit.file_id,
            fileName: hit.file_name,
            fileSize: hit.file_size,
            md5sum: hit.md5sum,
            state: hit.state,
            type: hit.type,
            version: hit.version,
            experimentalStrategy: hit.experimental_strategy,
          }));
          state.status = "fulfilled";
          state.error = undefined;
        }
      })
      .addCase(fetchFiles.pending, (state, _) => {
        state.files = [];
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(fetchFiles.rejected, (state, _) => {
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
