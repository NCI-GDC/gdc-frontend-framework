import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDataSelectorResponse, createUseCoreDataHook, DataStatus } from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
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
}

const initialState: imageDetailsState = {
  details: {
    Format: '',
    Height: '',
    Width: '',
    TileSize: '',
    Overlap: '',
    uuid: ''
  },
  status: 'uninitialized'
}


const slice = createSlice({
  name: "imageDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImageDetails.fulfilled, (state, action) => {
      const response = action.payload

      console.log("response: ", response)

      state.details = {
        Height: response.Height,
        Width: response.Width,
        Format: response.Format,
        TileSize: response.TileSize,
        Overlap: response.Overlap,
        uuid: response.uuid
      };
      state.status = "fulfilled";

      return state;
    })
      .addCase(fetchImageDetails.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchImageDetails.rejected, (state) => {
        state.status = "rejected";
      });
  }
})

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
  status: state.imageDetails.status
})


export const useImageDetails = createUseCoreDataHook(fetchImageDetails, selectImageDetailsInfo)