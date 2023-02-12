import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  HUMAN_BODY_MAPPINGS,
  HUMAN_BODY_TOOS_MAP,
  HUMAN_BODY_ALL_ALLOWED_SITES,
} from "./constants";
import { groupBy, map } from "lodash";

interface Bucket {
  key: string;
  doc_count: number;
}

export interface BodyplotCountsData {
  docCount: number;
  fileCount: number;
  key: string;
}
interface BodyplotData extends BodyplotCountsData {
  allPrimarySites: string[];
  allTissuesOrOrgansOfOrigin: string[];
}

export const processData = (
  casesBuckets: Bucket[],
  filesBuckets: Bucket[],
): BodyplotData[] => {
  const results = map(
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

      console.log("group", group, majorPrimarySite);
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
  console.log("results", results);
  return results;
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
          response.data.viewer.repository.cases.aggregations
            .diagnoses__tissue_or_organ_of_origin.buckets,
          response.data.viewer.repository.files.aggregations
            .cases__diagnoses__tissue_or_organ_of_origin.buckets,
        ),
    }),
  }),
});

export const { useBodyplotCountsQuery } = bodyplotSlice;
