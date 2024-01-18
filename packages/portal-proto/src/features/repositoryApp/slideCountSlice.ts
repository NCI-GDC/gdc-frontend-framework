import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GraphQLApiResponse,
  graphqlAPI,
  DataStatus,
  AppDataSelectorResponse,
  FilterSet,
  buildCohortGqlOperator,
  joinFilters,
} from "@gff/core";
import { AppState } from "./appApi";
import { createUseAppDataHook } from "@/features/repositoryApp/hooks";

/**
 * Retreived the case count containing images based on the filters parameter.
 * Note once the ImageViewer is converted into an app this can move to either the app or the
 * core counts slice.
 */

const repositoryCaseSlidesQuery = `query repositoryCaseSlides(
  $filters: FiltersArgument
  $fileFilters: FiltersArgument
) {
  viewer {
    repository {
      cases {
        hits(case_filters: $filters) {
          total
        }
      }
      files {
        aggregations(
          case_filters: $fileFilters
          aggregations_filter_themselves: false
        ) {
          files__data_type: data_type {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  }
}`;

export const fetchImageCounts = createAsyncThunk(
  "repositoryApp/getImageCounts",
  async (
    filters: FilterSet,
  ): Promise<GraphQLApiResponse<Record<string, any>>> => {
    const fileFilters = buildCohortGqlOperator(filters);
    const caseFilters = buildCohortGqlOperator(
      joinFilters(filters, {
        mode: "and",
        root: {
          "summary.experimental_strategies.experimental_strategy": {
            operator: "includes",
            field: "summary.experimental_strategies.experimental_strategy",
            operands: ["Tissue Slide", "Diagnostic Slide"],
          },
        },
      }),
    );
    const variables = {
      filters: caseFilters,
      fileFilters: fileFilters,
    };
    return await graphqlAPI(repositoryCaseSlidesQuery, variables);
  },
);

export interface ImageCount {
  readonly casesWithImagesCount: number;
  readonly slidesCount: number;
}

export interface ImageCountState extends ImageCount {
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: stirng;
}

const initialState: ImageCountState = {
  casesWithImagesCount: -1,
  slidesCount: -1,
  status: "uninitialized",
};

const slice = createSlice({
  name: "caseImageCounts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageCounts.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const dataRoot = action.payload.data?.viewer?.repository;
        state.casesWithImagesCount = dataRoot?.cases?.hits?.total;
        const imageBucket =
          dataRoot?.files?.aggregations.files__data_type.buckets.find(
            (x) => x.bucket === "Slide Image",
          );
        state.slidesCount = imageBucket ? imageBucket.doc_count : -1;
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchImageCounts.pending, (state, action) => {
        state.casesWithImagesCount = -1;
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchImageCounts.rejected, (state) => {
        state.casesWithImagesCount = -1;
        state.status = "rejected";
        return state;
      });
  },
});

export const imageCountsReducer = slice.reducer;

export const selectCasesWithImagesCount = (
  state: AppState,
): AppDataSelectorResponse<ImageCount> => ({
  data: {
    casesWithImagesCount: state.images.casesWithImagesCount,
    slidesCount: state.images.slidesCount,
  },
  status: state.images.status,
});

export const useImageCounts = createUseAppDataHook(
  fetchImageCounts,
  selectCasesWithImagesCount,
);
