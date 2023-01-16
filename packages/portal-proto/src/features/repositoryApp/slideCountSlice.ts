import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GraphQLApiResponse, graphqlAPI } from "@gff/core";
import { castDraft } from "immer";
import { DataStatus } from "@gff/core/dist/dts";

const repositoryCaseSlidesQuery = `query repositoryCaseSlides(
  $filters: FiltersArgument
  $slideFilter: FiltersArgument
) {
  viewer {
    repository {
      cases {
        hits(filters: $filters) {
          total
          edges {
            node {
              files {
                hits(filters: $slideFilter, first: 0) {
                  total
                }
              }
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
    filters: ReadonlyArray<Record<string, unknown>>,
  ): Promise<GraphQLApiResponse> => {
    const variables = {
      filters: {
        content: [
          ...[
            {
              op: "in",
              content: {
                field: "summary.experimental_strategies.experimental_strategy",
                value: ["Tissue Slide", "Diagnostic Slide"],
              },
            },
          ],
          ...filters,
        ],
        op: "and",
      },
      slideFilter: {
        content: [
          {
            content: {
              field: "files.data_type",
              value: ["Slide Image"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
    };
    return await graphqlAPI(repositoryCaseSlidesQuery, variables);
  },
);

export interface ImageCountState {
  readonly casesWithImagesCount: number;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState = {
  casesWithImagesCount: -1,
  status: "uninitialized",
};

const slice = createSlice({
  name: "caseImageCounts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageCounts.fulfilled, (state, action) => {
        const response = action.payload.data.hits[0];
        state.casesWithImagesCount = castDraft(response);
        state.status = "fulfilled";

        return state;
      })
      .addCase(fetchImageCounts.pending, (state) => {
        state.casesWithImagesCount = -1;
        state.status = "pending";

        return state;
      })
      .addCase(fetchImageCounts.rejected, (state) => {
        state.casesWithImagesCount = -1;
        state.status = "rejected";
        return state;
      });
  },
});
