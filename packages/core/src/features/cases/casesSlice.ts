import { endpointSlice } from "../gdcapi";
import {
  AnnotationDefaults,
  CaseDefaults,
  GdcApiResponse,
  Pagination,
  SortBy,
} from "../gdcapi/types";
import { groupBy } from "lodash";
import { GqlOperation } from "../gdcapi/filters";

interface CaseSliceResponseData {
  case_id: string;
  case_uuid: string;
  submitter_id: string;
  project_id: string;
  program: string;
  primary_site: string;
  disease_type: string;
  primary_diagnosis?: string | null;
  age_at_diagnosis?: number | null;
  vital_status?: null | string;
  days_to_death?: number | null;
  sex_at_birth?: null | string;
  race?: null | string;
  ethnicity?: null | string;
  filesCount: number;
  files?: Array<{
    access: "open" | "controlled";
    acl: string[];
    file_id: string;
    file_size: number;
    state: string;
    file_name: string;
    data_type: string;
  }>;
  data_categories: Array<{
    data_category: string;
    file_count: number;
  }>;
  experimental_strategies: Array<{
    experimental_strategy: string;
    file_count: number;
  }>;
  annotations: AnnotationDefaults[];
}

interface CaseResponseData extends CaseDefaults {
  annotations: AnnotationDefaults[];
}

interface AllCasesData {
  readonly cases: CaseSliceResponseData[];
  readonly pagination: Pagination;
}

/**
 * The request for fetching all cases from the GDC API
 * @property filters - A FilterSet object
 * @property fields - An array of fields to return
 * @property size - The number of cases to return
 * @property from - The offset from which to return cases
 * @property sortBy - An array of fields to sort by
 * @property searchTerm - A string to search for in the case_id and submitter_id fields
 * @category Cases
 */
interface FetchAllCasesRequestProps {
  filters?: GqlOperation;
  fields?: ReadonlyArray<string>;
  readonly size?: number;
  readonly from?: number;
  readonly sortBy?: ReadonlyArray<SortBy>;
}

const transformCase = (datum: CaseResponseData): CaseSliceResponseData => ({
  case_id: datum.submitter_id,
  case_uuid: datum.case_id,
  submitter_id: datum.submitter_id,
  project_id: datum.project.project_id,
  program: datum.project.program.name,
  primary_site: datum.primary_site,
  disease_type: datum.disease_type,
  primary_diagnosis: datum.diagnoses?.[0]?.primary_diagnosis,
  age_at_diagnosis: datum.diagnoses?.[0]?.age_at_diagnosis,
  vital_status: datum?.demographic?.vital_status,
  days_to_death: datum?.demographic?.days_to_death,
  sex_at_birth: datum.demographic?.sex_at_birth,
  race: datum.demographic?.race,
  ethnicity: datum.demographic?.ethnicity,
  filesCount: datum.summary.file_count,
  data_categories: datum.summary?.data_categories,
  experimental_strategies: datum.summary?.experimental_strategies,
  annotations: datum.annotations,
  files: datum?.files?.map((file) => ({
    file_id: file.file_id,
    file_name: file.file_name,
    file_size: file.file_size,
    access: file.access,
    state: file.state,
    acl: file.acl,
    data_type: file.data_type,
  })),
});

export const casesApiSlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    allCases: builder.query<AllCasesData, FetchAllCasesRequestProps>({
      queryFn: async (
        { fields, size, filters, from, sortBy },
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) => {
        const casesResult = await fetchWithBQ({
          endpoint: "cases",
          request: { fields, size, case_filters: filters, from, sortBy },
        });
        if (casesResult.error) return { error: casesResult.error };

        const { hits, pagination } = (
          casesResult.data as GdcApiResponse<CaseDefaults>
        ).data;
        if (hits.length === 0) return { data: { cases: [], pagination } };

        const annotationsResult = await fetchWithBQ({
          endpoint: "annotations",
          request: {
            filters: {
              op: "in",
              content: {
                field: "annotations.case_id",
                value: hits.map((hit) => hit.id),
              },
            },
            size: 100000,
          },
        });
        if (annotationsResult.error) return { error: annotationsResult.error };

        const annotationsByCaseId = groupBy(
          (annotationsResult.data as GdcApiResponse<AnnotationDefaults>).data
            .hits,
          "case_id",
        );

        return {
          data: {
            pagination,
            cases: hits.map((hit) =>
              transformCase({
                ...hit,
                annotations: annotationsByCaseId[hit.case_id] ?? [],
              }),
            ),
          },
        };
      },
    }),
  }),
});

export const { useAllCasesQuery } = casesApiSlice;
