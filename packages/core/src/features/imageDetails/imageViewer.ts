import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { fetchImageViewerQuery, queryParams } from "./imageDetailsApi";
import { trimEnd, find } from "lodash";
import {
  caseNodeType,
  ImageViewerInfo,
  imageViewerInitialState,
} from "./types";

export const fetchImageViewer = createAsyncThunk(
  "imageDetails/fetchImageViewer",
  async (params: queryParams): Promise<GraphQLApiResponse> => {
    return await fetchImageViewerQuery(params);
  },
);

export interface edgeDetails {
  readonly file_id: string;
  readonly submitter_id: string;
}

const initialState: imageViewerInitialState = {
  status: "uninitialized",
  total: 0,
  edges: {},
};

export const getSlides: (caseNode: caseNodeType) => any[] = (
  caseNode: caseNodeType,
) => {
  const portions = (
    caseNode.samples || {
      hits: { edges: [] },
    }
  ).hits.edges.reduce(
    (acc: any, { node }: any) => [
      ...acc,
      ...node.portions.hits.edges.map((p: { node: any }) => p.node),
    ],
    [],
  );

  const slideImageIds = caseNode.files.hits.edges.map(
    ({ node }: { node: { file_id: string; submitter_id: string } }) => ({
      file_id: node.file_id,
      submitter_id: trimEnd(node.submitter_id, "_slide_image"),
    }),
  );

  const slides = portions.reduce(
    (acc: any, { slides }: any) => [
      ...acc,
      ...slides.hits.edges.map((p: { node: any }) => p.node),
    ],
    [],
  );

  return slideImageIds.map((id: { submitter_id: any }) => {
    const matchBySubmitter = find(slides, { submitter_id: id.submitter_id });
    return { ...id, ...matchBySubmitter };
  });
};

const slice = createSlice({
  name: "imageViewer",
  initialState,
  reducers: {
    setShouldResetEdgesState(state) {
      state.edges = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageViewer.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;

        const hits = response?.data?.viewer?.repository?.cases?.hits;
        state.status = "fulfilled";
        state.total = hits?.total;

        const obj = Object.fromEntries(
          hits?.edges?.map((edge: any) => {
            const parsedSlideImagesInfo = getSlides(edge?.node);
            const caseSubmitterId = edge?.node?.submitter_id;
            const projectID = edge?.node?.project?.project_id;

            return [`${caseSubmitterId} - ${projectID}`, parsedSlideImagesInfo];
          }),
        );

        state.edges = { ...state.edges, ...obj };

        return state;
      })
      .addCase(fetchImageViewer.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchImageViewer.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const imageViewerReducer = slice.reducer;

export const { setShouldResetEdgesState } = slice.actions;

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
