import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation, FilterSet, GraphQLApiResponse } from "@gff/core";
import { AppState } from "./appApi";

export const fetchImageCounts = createAsyncThunk(
  "repositoryApp/getImageCounts",
  async (params: queryParams): Promise<GraphQLApiResponse> => {
    return await fetchImageViewerQuery(params);
  },
);
