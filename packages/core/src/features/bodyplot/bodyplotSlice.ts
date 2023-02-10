import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  HUMAN_BODY_MAPPINGS,
  HUMAN_BODY_TOOS_MAP,
  HUMAN_BODY_ALL_ALLOWED_SITES,
} from "./constants";
import { groupBy, map } from "lodash";
import { CoreState } from "../../reducers";

interface Bucket {
  key: string;
  doc_count: number;
}

interface BodyplotData {
  allPrimarySites: string[];
  allTissuesOrOrgansOfOrigin: string[];
  docCount: number;
  fileCount: number;
  key: string;
}

const processData = (
  casesBuckets: Bucket[],
  filesBuckets: Bucket[],
): BodyplotData[] => {
  return map(
    groupBy(
      casesBuckets,
      // cases.aggregations.primary_site.buckets,
      (b) => HUMAN_BODY_TOOS_MAP[b.key.toLowerCase()] || b.key.toLowerCase(),
    ),
    (group, majorPrimarySite) => {
      const {
        byPrimarySite: allPrimarySites,
        byTissueOrOrganOfOrigin: allTissuesOrOrgansOfOrigin,
      } = HUMAN_BODY_MAPPINGS[majorPrimarySite];

      return {
        allPrimarySites,
        allTissuesOrOrgansOfOrigin,
        docCount: group.reduce((sum, { doc_count }) => sum + doc_count, 0),
        fileCount: group.reduce(
          (sumFiles, { key }) =>
            (
              filesBuckets
                // files.aggregations.cases__primary_site.buckets
                .find((f) => f.key === key) || { doc_count: 0 }
            ).doc_count + sumFiles,
          0,
        ),
        key: majorPrimarySite,
      };
    },
  ).filter(({ key }) => HUMAN_BODY_ALL_ALLOWED_SITES.includes(key));
};

export const bodyplotSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    bodyplotCounts: builder.query({
      query: () => ({
        graphQLQuery: `query HumanBody {
  viewer {
    repository {
      files {
        aggregations {
          cases__primary_site {
            buckets {
              doc_count
              key
            }
          }
          cases__diagnoses__tissue_or_organ_of_origin {
            buckets {
              doc_count
              key
            }
          }
        }
      }
      cases {
        aggregations {
          primary_site {
            buckets {
              doc_count
              key
            }
          }
          diagnoses__tissue_or_organ_of_origin {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  }
}`,
        graphQLFilters: {
          filters: {},
        },
      }),
      transformResponse: (response) =>
        processData(
          response.data.viewer.repository.cases,
          response.data.viewer.repository.files,
        ),
    }),
  }),
});

export const selectBodyplotCounts = (
  state: CoreState,
): Record<string, string> => state.bodyplot.bodyplotCounts;

export const bodyplotReducer = bodyplotSlice.reducer;

export const { useBodyplotCountsQuery } = bodyplotSlice;
