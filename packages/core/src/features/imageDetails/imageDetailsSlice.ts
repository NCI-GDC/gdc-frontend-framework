import { createAsyncThunk } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import { fetchSlideImages } from "./imageDetailsApi";

export interface ImageMetadataResponse {
  readonly Format: string;
  readonly Height: string;
  readonly Width: string;
  readonly Overlap: string;
  readonly TileSize: string;
  readonly uuid: string;
}

export const fetchImageDetails = createAsyncThunk<
  ImageMetadataResponse,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("imageDetails/fetchImageDetails", async (imageId: string) => {
  return await fetchSlideImages(imageId);
});
