import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../../dataAccess";
import { CoreState } from "../../../reducers";
import { CoreDispatch } from "../../../store";
import {
  fetchGdcSsms,
  SSMSDefaults,
  GdcApiRequest,
  GdcApiResponse,
} from "../../gdcapi/gdcapi";

export interface SsmsState {
  readonly ssms?: SSMSDefaults;
  readonly summaryData?: summaryData;
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: string;
}

export const fetchSsms = createAsyncThunk<
  GdcApiResponse<SSMSDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("ssms/fetchSsms", async (request?: GdcApiRequest) => {
  return await fetchGdcSsms(request);
});

interface summaryData {
  uuid: string;
  dna_change: string;
  type: string;
  reference_genome_assembly: string;
  cosmic_id: Array<string>;
  allele_in_the_reference_assembly: string;
  civic?: string;
  transcript: {
    is_canonical: boolean;
    transcript_id: string;
    annotation: {
      polyphen_impact: string;
      polyphen_score: number;
      sift_impact: string;
      sift_score: number;
      vep_impact: string;
      dbsnp: string;
    };
  };
}

const initialState: SsmsState = {
  status: "uninitialized",
  error: undefined,
};

const slice = createSlice({
  name: "ssms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSsms.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;

        state.summaryData = response.data.hits.map((hit) => ({
          uuid: hit.id,
          dna_change: hit.genomic_dna_change,
          type: hit.mutation_subtype,
          reference_genome_assembly: hit.ncbi_build,
          cosmic_id: hit.cosmic_id,
          allele_in_the_reference_assembly: hit.reference_allele,
          civic: hit?.clinical_annotations?.civic.variant_id,
          transcript:
            hit?.consequence
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
                  dbsnp: item.transcript.annotation.dbsnp_rs,
                },
              }))[0] || {},
        }))[0];

        state.status = "fulfilled";

        return state;
      })
      .addCase(fetchSsms.pending, (state, action) => {
        state.summaryData = undefined;
        state.status = "pending";
        state.requestId = action.meta.requestId;
        state.error = undefined;
      })
      .addCase(fetchSsms.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.summaryData = undefined;
        state.status = "rejected";
        state.error = undefined;
        return state;
      });
  },
});

export const ssmsReducer = slice.reducer;

export const selectSsmsSummaryData = (
  state: CoreState,
): CoreDataSelectorResponse<summaryData | undefined> => ({
  data: state.ssms.summaryData,
  status: state.ssms.status,
  error: state.ssms.error,
});

export const useSSMS = createUseCoreDataHook(fetchSsms, selectSsmsSummaryData);
