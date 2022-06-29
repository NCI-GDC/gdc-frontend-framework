import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { CoreDispatch } from "../../store";
import {
  fetchGdcSsms,
  SSMSDefaults,
  GdcApiRequest,
  GdcApiResponse,
} from "../gdcapi/gdcapi";

export interface SsmsState {
  readonly ssms?: SSMSDefaults;
  readonly summaryData?: Record<string, any>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SsmsState = {
  status: "uninitialized",
  error: undefined,
};

export const fetchSsms = createAsyncThunk<
  GdcApiResponse<SSMSDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("ssms/fetchSsms", async (request?: GdcApiRequest) => {
  return await fetchGdcSsms(request);
});

const slice = createSlice({
  name: "ssms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSsms.fulfilled, (state, action) => {
        const response = action.payload;
        console.log("response: ", response);

        state.summaryData = response.data.hits.map((hit) => ({
          uuid: hit.id,
          dna_change: hit.genomic_dna_change,
          type: hit.mutation_subtype,
          reference_genome_assembly: hit.ncbi_build,
          allele_in_the_reference_assembly: hit.reference_allele,
          civic: hit.clinical_annotations.civic.variant_id,
          transcript: hit.consequence
            .filter((con) => con.transcript.is_canonical)
            .map((item) => ({
              is_canonical: item.transcript.is_canonical,
              transcript_id: item.transcript.transcript_id,
              annotation: {
                polyphen_impact: item.transcript.annotation.polyphen_impact,
                polyphen_score: item.transcript.annotation.polyphen_score,
                sift_impact: item.transcript.annotation.sift_impact,
                sift_score: item.transcript.annotation.sift_score,
                vep_impact: item.transcript.annotation.vep_impact,
              },
            })),
        }));

        state.status = "fulfilled";
      })
      .addCase(fetchSsms.pending, (state) => {
        // state.ssms = {};
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(fetchSsms.rejected, (state) => {
        // state.ssms = {};
        state.status = "rejected";
        state.error = undefined;
      });
  },
});

export const ssmsReducer = slice.reducer;

export const selectSsmsSummaryData = (state: CoreState): any =>
  state.ssms.summaryData;

export const selectSsmsData = (
  state: CoreState,
): CoreDataSelectorResponse<SSMSDefaults> => ({
  data: state.ssms.ssms,
  status: state.ssms.status,
  error: state.ssms.error,
});

export const useSSMS = createUseCoreDataHook(fetchSsms, selectSsmsData);
