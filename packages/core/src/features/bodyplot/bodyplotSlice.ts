import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  HUMAN_BODY_ALL_ALLOWED_SITES,
  HUMAN_BODY_MAPPINGS,
  HUMAN_BODY_TOOS_MAP,
} from "./constants";
import { groupBy, map } from "lodash";

interface Bucket {
  key: string;
  doc_count: number;
}

export interface BodyplotCountsData {
  caseCount: number;
  fileCount: number;
  key: string;
}
export interface BodyplotData extends BodyplotCountsData {
  allPrimarySites: string[];
  allTissuesOrOrgansOfOrigin: string[];
}

export const processData = (
  casesBuckets: Bucket[],
  filesBuckets: Bucket[],
): BodyplotData[] => {
  return map(
    groupBy(
      casesBuckets,
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
        caseCount: group.reduce((sum, { doc_count }) => sum + doc_count, 0),
        fileCount: group.reduce(
          (sumFiles, { key }) =>
            (filesBuckets.find((f) => f.key === key) || { doc_count: 0 })
              .doc_count + sumFiles,
          0,
        ),
        key: majorPrimarySite,
      };
    },
  ).filter(({ key }) => HUMAN_BODY_ALL_ALLOWED_SITES.includes(key));
};

export const bodyplotSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    bodyplotCounts: builder.query<BodyplotData[], void>({
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
