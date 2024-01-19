import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { fetchSlideImages, ImageMetadataResponse } from "./imageDetailsApi";

export const fetchImageDetails = createAsyncThunk<
  ImageMetadataResponse,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("imageDetails/fetchImageDetails", async (imageId: string) => {
  return await fetchSlideImages(imageId);
});
export interface imageDetailsState {
  readonly details: ImageMetadataResponse;
  readonly status: DataStatus;
  readonly requestId?: string;
}

const initialState: imageDetailsState = {
  details: {
    Format: "",
    Height: "",
    Width: "",
    TileSize: "",
    Overlap: "",
    uuid: "",
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "imageDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageDetails.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;

        state.details = {
          ...response,
        };
        state.status = "fulfilled";

        return state;
      })
      .addCase(fetchImageDetails.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchImageDetails.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        return state;
      });
  },
});

export const imageDetailsReducer = slice.reducer;

export const selectImageDetailsInfo = (
  state: CoreState,
): CoreDataSelectorResponse<ImageMetadataResponse> => ({
  data: {
    Height: state.imageDetails.details.Height,
    Width: state.imageDetails.details.Width,
    Format: state.imageDetails.details.Format,
    Overlap: state.imageDetails.details.Overlap,
    TileSize: state.imageDetails.details.TileSize,
    uuid: state.imageDetails.details.uuid,
  },
  status: state.imageDetails.status,
});

export const useImageDetails = createUseCoreDataHook(
  fetchImageDetails,
  selectImageDetailsInfo,
);
