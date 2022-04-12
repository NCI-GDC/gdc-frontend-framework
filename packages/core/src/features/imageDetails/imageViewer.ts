import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreState } from "../../store";
import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { fetchImageViewerQuery } from "./imageDetailsApi";

export const fetchImageViewer = createAsyncThunk(
  "imageDetails/fetchImageViewer",
  async (): Promise<GraphQLApiResponse> => {
    return await fetchImageViewerQuery();
  },
);

interface edgeDetails {
  readonly file_id: string;
  readonly submitter_id: string;
}

interface edges {
  [caseSubmitterId: string]: Array<edgeDetails>;
}

interface ImageViewerInfo {
  edges: edges;
  total: number;
}

export interface imageViewerInitialState {
  readonly status: DataStatus;
  readonly total: number;
  readonly edges: any;
}

const initialState: imageViewerInitialState = {
  status: "uninitialized",
  total: 0,
  edges: [],
};

const slice = createSlice({
  name: "imageViewer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageViewer.fulfilled, (state, action) => {
        const response = action.payload;
        console.log("RESPONSE: ", response);

        const hits = response?.data?.viewer?.repository?.cases?.hits;
        state.status = "fulfilled";
        state.total = hits?.total;

        state.edges = Object.fromEntries(
          hits?.edges?.map((edge: any) => {
            // give proper name
            const caseSubmitterId = edge?.node?.submitter_id;
            const projectID = edge?.node?.project?.project_id;
            const mapped = edge?.node?.files?.hits?.edges?.map(
              (edge: { node: { file_id: string; submitter_id: string } }) => ({
                file_id: edge.node.file_id,
                submitter_id: edge.node.submitter_id.replace(
                  "_slide_image",
                  "",
                ),
              }),
            );

            return [`${caseSubmitterId} ${projectID}`, mapped];
          }),
        );

        return state;
      })
      .addCase(fetchImageViewer.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchImageViewer.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const imageViewerReducer = slice.reducer;

export const selectImageViewerInfo = (
  state: CoreState,
): CoreDataSelectorResponse<ImageViewerInfo> => ({
  data: {
    edges: state.imageViewer.edges,
    total: state.imageViewer.total,
  },
  status: state.imageViewer.status,
});

export const useImageViewer = createUseCoreDataHook(
  fetchImageViewer,
  selectImageViewerInfo,
);
