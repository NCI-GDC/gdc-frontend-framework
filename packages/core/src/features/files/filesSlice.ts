import { Middleware, Reducer } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import { DataStatus } from "../../dataAccess";
import {
  GdcApiRequest,
  GdcApiResponse,
  FileDefaults,
  Pagination,
  endpointSlice,
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
  "BCR Auxiliary XML",
  "BCR OMF XML",
  "BCR BIOTAB",
  "BCR Biotab",
  "BCR PPS XML",
  "CDC JSON",
  "XLSX",
  "MEX",
  "HDF5",
  "PDF",
  "BAI",
  "TBI",
  "CEL",
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

// TODO use CartFile instead and combine anything that submits to cart
export interface GdcCartFile {
  readonly file_name: string;
  readonly data_category: string;
  readonly data_type: string;
  readonly data_format: DataFormat;
  readonly state: string;
  readonly file_size: number;
  readonly file_id: string;
  readonly access: AccessType;
  readonly acl: ReadonlyArray<string>;
  readonly project_id?: string;
  readonly createdDatetime: string;
  readonly updatedDatetime: string;
  readonly submitterId: string;
  readonly md5sum: string;
}
export type FileAnnontationsType = ReadonlyArray<{
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
export type FileCaseType = ReadonlyArray<{
  readonly case_id: string;
  readonly submitter_id: string;
  readonly annotations?: ReadonlyArray<string>;
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
export interface GdcFile {
  readonly id?: string;
  readonly submitterId: string;
  readonly access: AccessType;
  readonly acl: ReadonlyArray<string>;
  readonly createdDatetime: string;
  readonly updatedDatetime: string;
  readonly data_category: string;
  readonly data_format: DataFormat;
  readonly dataRelease?: string;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly md5sum: string;
  readonly platform?: string;
  readonly state: string;
  readonly fileType?: string;
  readonly version?: string;
  readonly experimental_strategy?: ExperimentalStrategy;
  readonly project_id?: string;
  readonly annotations?: FileAnnontationsType;
  readonly cases?: FileCaseType;
  readonly associated_entities?: ReadonlyArray<{
    readonly entity_submitter_id: string;
    readonly entity_type: string;
    readonly case_id: string;
    readonly entity_id: string;
  }>;
  readonly analysis?: {
    readonly workflow_type: string;
    readonly updated_datetime: string;
    readonly input_files?: GdcCartFile[];
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
    readonly output_files?: GdcCartFile[];
  }>;
  readonly index_files?: ReadonlyArray<{
    readonly submitterId: string;
    readonly createdDatetime: string;
    readonly updatedDatetime: string;
    readonly data_category: string;
    readonly data_format: DataFormat;
    readonly data_type: string;
    readonly file_id: string;
    readonly file_name: string;
    readonly file_size: number;
    readonly md5sum: string;
    readonly state: string;
  }>;
}

export const mapFileData = (files: ReadonlyArray<FileDefaults>): GdcFile[] => {
  return files.map((hit) => ({
    id: hit.id,
    submitterId: hit.submitter_id,
    access: asAccessType(hit.access),
    acl: [...hit.acl],
    createdDatetime: hit.created_datetime,
    updatedDatetime: hit.updated_datetime,
    data_category: hit.data_category,
    data_format: asDataFormat(hit.data_format),
    dataRelease: hit.data_release,
    data_type: hit.data_type,
    file_id: hit.file_id,
    file_name: hit.file_name,
    file_size: hit.file_size,
    md5sum: hit.md5sum,
    platform: hit.platform,
    state: hit.state,
    fileType: hit.type,
    version: hit.version,
    experimental_strategy: asExperimentalStrategy(hit.experimental_strategy),
    project_id: hit.cases?.[0]?.project?.project_id,
    annotations: hit.annotations?.map((annotation) => annotation),
    cases: hit.cases?.map((caseObj) => {
      return {
        case_id: caseObj.case_id,
        submitter_id: caseObj.submitter_id,
        annotations: caseObj.annotations?.map(
          (annotation) => annotation.annotation_id,
        ),
        project: caseObj?.project
          ? {
              dbgap_accession_number: caseObj.project.dbgap_accession_number,
              disease_type: caseObj.project.disease_type,
              name: caseObj.project.name,
              primary_site: caseObj.project.primary_site,
              project_id: caseObj.project.project_id,
              releasable: caseObj.project.releasable,
              released: caseObj.project.released,
              state: caseObj.project.state,
            }
          : undefined,
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
                    percent_stromal_cells: slide.percent_stromal_cells,
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
    associated_entities: hit.associated_entities?.map((associated_entity) => ({
      entity_submitter_id: associated_entity.entity_submitter_id,
      entity_type: associated_entity.entity_type,
      case_id: associated_entity.case_id,
      entity_id: associated_entity.entity_id,
    })),
    analysis: hit.analysis
      ? {
          workflow_type: hit.analysis.workflow_type,
          updated_datetime: hit.analysis.updated_datetime,
          input_files: hit.analysis.input_files?.map((file) => {
            return {
              file_name: file.file_name,
              data_category: file.data_category,
              data_type: file.data_type,
              data_format: asDataFormat(file.data_format),
              file_size: file.file_size,
              file_id: file.file_id,
              acl: hit.acl,
              access: asAccessType(file.access),
              project_id: hit.cases?.[0].project?.project_id,
              state: file.state,
              submitterId: file.submitter_id,
              createdDatetime: file.created_datetime,
              updatedDatetime: file.updated_datetime,
              md5sum: file.md5sum,
            };
          }),
          metadata: hit.analysis.metadata
            ? {
                read_groups: hit.analysis.metadata.read_groups.map(
                  (read_group) => ({
                    read_group_id: read_group.read_group_id,
                    is_paired_end: read_group.is_paired_end,
                    read_length: read_group.read_length,
                    library_name: read_group.library_name,
                    sequencing_center: read_group.sequencing_center,
                    sequencing_date: read_group.sequencing_date,
                  }),
                ),
              }
            : undefined,
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
            data_format: asDataFormat(file.data_format),
            file_size: file.file_size,
            file_id: file.file_id,
            acl: hit.acl,
            access: asAccessType(file.access),
            project_id: hit.cases?.[0].project?.project_id,
            state: file.state,
            submitterId: file.submitter_id,
            createdDatetime: file.created_datetime,
            updatedDatetime: file.updated_datetime,
            md5sum: file.md5sum,
          };
        }),
      };
    }),
    index_files: hit.index_files?.map((idx) => ({
      submitterId: idx.submitter_id,
      createdDatetime: idx.created_datetime,
      updatedDatetime: idx.updated_datetime,
      data_category: idx.data_category,
      data_format: asDataFormat(idx.data_format),
      data_type: idx.data_type,
      file_id: idx.file_id,
      file_name: idx.file_name,
      file_size: idx.file_size,
      md5sum: idx.md5sum,
      state: idx.state,
    })),
  }));
};

export interface FilesState {
  readonly files?: ReadonlyArray<GdcFile>;
  readonly pagination?: Pagination;
  readonly status: DataStatus;
  readonly error?: string;
}

export const filesApiSlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "files",
        fetchAll: false,
      }),
      transformResponse: (response: GdcApiResponse<FileDefaults>) => {
        if (response.warnings && Object.keys(response.warnings).length > 0)
          return {
            files: [],
            pagination: undefined,
          };

        return {
          files: castDraft(mapFileData(response?.data?.hits ?? [])),
          pagination: response.data.pagination,
        };
      },
    }),
  }),
});
export const { useGetFilesQuery } = filesApiSlice;

export const filesApiSliceMiddleware = filesApiSlice.middleware as Middleware;
export const filesApiSliceReducerPath: string = filesApiSlice.reducerPath;
export const filesApiReducer: Reducer = filesApiSlice.reducer as Reducer;
