import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import {
  fetchGdcAnnotations,
  fetchGdcCases,
  Pagination,
  AnnotationDefaults,
  SortBy,
} from "../gdcapi/gdcapi";
import { CoreDispatch } from "../../store";
import { groupBy } from "lodash";
import { caseSummaryDefaults } from "./types";
import {
  convertFilterToGqlFilter,
  Intersection,
  Union,
} from "../gdcapi/filters";
import { FilterSet, filterSetToOperation } from "../cohort";
import { appendFilterToOperation } from "../genomic/utils";

interface CaseSliceResponseData {
  case_id: string;
  case_uuid: string;
  project_id: string;
  program: string;
  primary_site: string;
  disease_type: string;
  primary_diagnosis?: string | null;
  age_at_diagnosis?: number | null;
  vital_status?: null | string;
  days_to_death?: number | null;
  gender?: null | string;
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

interface CaseResponseData extends caseSummaryDefaults {
  annotations: AnnotationDefaults[];
}

interface CasesResponse {
  readonly pagination: Pagination;
  readonly data: readonly CaseResponseData[];
}

export const buildCasesTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: "or",
      operands: [
        {
          operator: "includes",
          field: "cases.case_id", // case insensitive
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "cases.submitter_id", // case sensitive
          operands: [`*${term}*`],
        },
      ],
    };
  }
  return undefined;
};

interface FetchAllCasesRequestProps {
  filters?: FilterSet;
  fields?: ReadonlyArray<string>;
  readonly size?: number;
  readonly from?: number;
  readonly sortBy?: ReadonlyArray<SortBy>;
  searchTerm?: string;
}
export const fetchAllCases = createAsyncThunk<
  CasesResponse,
  FetchAllCasesRequestProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cases/fetchAllCases",
  async ({
    fields,
    size,
    filters,
    from,
    sortBy,
    searchTerm,
  }: FetchAllCasesRequestProps): Promise<CasesResponse> => {
    const searchFilters = buildCasesTableSearchFilters(searchTerm);
    const combinedFilters = convertFilterToGqlFilter(
      appendFilterToOperation(
        filterSetToOperation(filters) as Union | Intersection | undefined,
        searchFilters,
      ),
    );

    const casesResponse = await fetchGdcCases({
      fields,
      size,
      filters: combinedFilters,
      from,
      sortBy,
    });
    const case_ids = casesResponse.data.hits.map((d) => d.id);
    const parsedCasesResponse: Record<string, any> =
      casesResponse.data.hits.reduce(
        (acc, hit) => ({
          ...acc,
          [hit.case_id]: {
            ...hit,
            annotations: [],
          },
        }),
        {},
      );

    if (casesResponse.data.hits.length > 0) {
      const annotationsResponse = await fetchGdcAnnotations({
        filters: {
          op: "in",
          content: {
            field: "annotations.case_id",
            value: case_ids,
          },
        },
        size: 100000,
      });

      const grouped = groupBy(annotationsResponse.data.hits, "case_id");

      const newObject = Object.keys(parsedCasesResponse).map((key) => {
        let initial = parsedCasesResponse[key];
        if (grouped[key]) {
          initial = {
            ...initial,
            annotations: grouped[key],
          };
        }
        return initial;
      });

      return {
        pagination: casesResponse.data.pagination,
        data: newObject,
      };
    }

    return {
      pagination: casesResponse.data.pagination,
      data: [],
    };
  },
);
export interface CasesState {
  readonly allCasesData: CoreDataSelectorResponse<CaseSliceResponseData[]>;
  readonly totalSelectedCases?: number;
}

const initialState: CasesState = {
  allCasesData: {
    status: "uninitialized",
  },
};

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCases.fulfilled, (state, action) => {
        const response = action.payload;
        const map = action.payload.data.map((datum) => ({
          case_id: datum.submitter_id,
          case_uuid: datum.case_id,
          project_id: datum.project.project_id,
          program: datum.project.program.name,
          primary_site: datum.primary_site,
          disease_type: datum.disease_type,
          primary_diagnosis: datum.diagnoses?.[0]?.primary_diagnosis,
          age_at_diagnosis: datum.diagnoses?.[0]?.age_at_diagnosis,
          vital_status: datum?.demographic?.vital_status,
          days_to_death: datum?.demographic?.days_to_death,
          gender: datum.demographic?.gender,
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
        }));
        state.allCasesData = {
          status: "fulfilled",
        };
        state.allCasesData.data = map;
        state.allCasesData.pagination = response.pagination;
      })
      .addCase(fetchAllCases.pending, (state) => {
        state.allCasesData = {
          status: "pending",
        };
        return state;
      })
      .addCase(fetchAllCases.rejected, (state, action) => {
        state.allCasesData = {
          status: "rejected",
        };
        if (action.error) {
          state.allCasesData.error = action.error.message;
        }

        return state;
      });
  },
});

export const casesReducer = slice.reducer;

export const selectAllCasesData = (
  state: CoreState,
): CoreDataSelectorResponse<CaseSliceResponseData[]> => {
  return state.cases.allCasesData;
};

export const useAllCases = createUseCoreDataHook(
  fetchAllCases,
  selectAllCasesData,
);
