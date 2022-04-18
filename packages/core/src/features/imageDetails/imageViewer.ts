import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreState } from "../../store";
import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { fetchImageViewerQuery, queryParams } from "./imageDetailsApi";
import trimEnd from "lodash/trimEnd";
import find from "lodash/find";

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
  readonly isPerformingSearch: boolean;
}

const initialState: imageViewerInitialState = {
  status: "uninitialized",
  total: 0,
  edges: {},
  isPerformingSearch: false,
};

export const getSlides = (caseNode: any) => {
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

  const slideImageIds = caseNode.files.hits.edges.map(({ node }: any) => ({
    file_id: node.file_id,
    submitter_id: trimEnd(node.submitter_id, "_slide_image"),
  }));

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
    setIsPerformingSearch(state, action) {
      state.isPerformingSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageViewer.fulfilled, (state, action) => {
        const response = action.payload;

        const hits = response?.data?.viewer?.repository?.cases?.hits;
        state.status = "fulfilled";
        state.total = hits?.total;

        const obj = Object.fromEntries(
          hits?.edges?.map((edge: any) => {
            // give proper name
            const mapped = getSlides(edge?.node);
            const caseSubmitterId = edge?.node?.submitter_id;
            const projectID = edge?.node?.project?.project_id;

            return [`${caseSubmitterId} ${projectID}`, mapped];
          }),
        );

        if (!state.isPerformingSearch) {
          state.edges = { ...state.edges, ...obj };
        } else {
          state.edges = obj;
        }

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

export const { setIsPerformingSearch } = slice.actions;

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
