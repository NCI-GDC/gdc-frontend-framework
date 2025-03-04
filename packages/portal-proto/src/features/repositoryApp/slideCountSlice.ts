import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GraphQLApiResponse,
  graphqlAPI,
  DataStatus,
  AppDataSelectorResponse,
  FilterSet,
  buildCohortGqlOperator,
  Bucket,
} from "@gff/core";
import { AppState } from "./appApi";
import { createUseAppDataHook } from "@/features/repositoryApp/hooks";

/**
 * Retreived the case count containing images based on the filters parameter.
 * Note once the ImageViewer is converted into an app this can move to either the app or the
 * core counts slice.
 */

const repositoryCaseSlidesQuery = `query repositoryCaseSlides(
  $caseFilters: FiltersArgument
  $fileFilters: FiltersArgument
) {
  viewer {
    repository {
      files {
        aggregations(
          case_filters: $caseFilters
          filters: $fileFilters
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
  async ({
    cohortFilters,
    repositoryFilters,
  }: {
    cohortFilters: FilterSet;
    repositoryFilters: FilterSet;
  }): Promise<GraphQLApiResponse<Record<string, any>>> => {
    const variables = {
      caseFilters: buildCohortGqlOperator(cohortFilters),
      fileFilters: buildCohortGqlOperator(repositoryFilters),
    };
    return await graphqlAPI(repositoryCaseSlidesQuery, variables);
  },
);

export interface ImageCount {
  readonly slidesCount: number;
}

export interface ImageCountState extends ImageCount {
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: string;
}

const initialState: ImageCountState = {
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
        const imageBucket =
          dataRoot?.files?.aggregations.files__data_type.buckets.find(
            (x: Bucket) => x.key === "Slide Image",
          );
        state.slidesCount = imageBucket ? imageBucket.doc_count : -1;
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchImageCounts.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchImageCounts.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
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
    slidesCount: state.images.slidesCount,
  },
  status: state.images.status,
});

export const useImageCounts = createUseAppDataHook(
  fetchImageCounts,
  selectCasesWithImagesCount,
);
