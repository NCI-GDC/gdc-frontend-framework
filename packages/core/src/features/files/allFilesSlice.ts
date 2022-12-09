import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GqlOperation } from "../gdcapi/filters";
import {
  fetchGdcFiles,
  GdcApiRequest,
  GdcApiResponse,
  FileDefaults,
} from "../gdcapi/gdcapi";

export const fetchAllFiles = createAsyncThunk<
  GdcApiResponse<FileDefaults>,
  GqlOperation,
  { dispatch: CoreDispatch; state: CoreState }
>("files/fetchAllFiles", async (filters?: GqlOperation) => {
  const request: GdcApiRequest = {
    filters: filters,
    fields: ["file_size"],
    size: 10001, //set one over max add to cart function allows
  };
  return await fetchGdcFiles(request);
});

export interface FilesState {
  readonly files?: ReadonlyArray<string>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: FilesState = {
  status: "uninitialized",
};

const slice = createSlice({
  name: "fetchAllFiles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFiles.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.files = [];
          state.status = "rejected";
          state.error = Object.values(response.warnings)[0]; // TODO add better errors parsing
        } else {
          state.files = response.data.hits.map((obj: FileDefaults) => obj.id); // only return arry of file ids
          state.status = "fulfilled";
          state.error = undefined;
        }
      })
      .addCase(fetchAllFiles.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAllFiles.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const filesAllReducer = slice.reducer;

export const selectAllFiles = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<string>> => {
  return {
    data: state.filesAll.files,
    status: state.filesAll.status,
  };
};

export const useAllFiles = createUseCoreDataHook(fetchAllFiles, selectAllFiles);
