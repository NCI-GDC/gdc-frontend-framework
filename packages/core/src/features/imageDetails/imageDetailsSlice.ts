import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { GDC_API } from "../../constants";
import { coreCreateApi } from "src/coreCreateApi";

export interface ImageMetadataResponse {
  readonly Format: string;
  readonly Height: string;
  readonly Width: string;
  readonly Overlap: string;
  readonly TileSize: string;
  readonly uuid: string;
}

export const fetchSlideImages = async (file_id: string) => {
  const response = await fetch(`${GDC_API}/tile/metadata/${file_id}`);

  if (response.ok) {
    return { data: response.json() };
  }

  return { error: await response.text() };
};

const imageDetailsApi = coreCreateApi({
  reducerPath: "imageDetails",
  baseQuery: fetchSlideImages,
  endpoints: (builder) => ({
    imageDetails: builder.query<ImageMetadataResponse, string>({
      query: (file_id) => file_id,
    }),
  }),
});

export const { useImageDetailsQuery } = imageDetailsApi;

export const imageDetailsApiMiddleware =
  imageDetailsApi.middleware as Middleware;
export const imageDetailsApiReducerPath: string = imageDetailsApi.reducerPath;
export const imageDetailsApiReducer: Reducer =
  imageDetailsApi.reducer as Reducer;
