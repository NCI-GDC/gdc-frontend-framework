import {
  endpointSlice,
  GdcApiRequest,
  GdcApiResponse,
} from "../../gdcapi/gdcapi";
import { SSMSDefaults } from "../../gdcapi/types";

interface SummaryData {
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

export const ssmsSummarySlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    ssmsSummary: builder.query<SummaryData, GdcApiRequest>({
      query: (request) => ({
        request,
        endpoint: "ssms",
      }),
      transformResponse: (response: GdcApiResponse<SSMSDefaults>) => {
        return response.data.hits.map((hit) => ({
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
      },
    }),
  }),
});

export const { useSsmsSummaryQuery } = ssmsSummarySlice;
