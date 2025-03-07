import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  BodyPlotDataKey,
  HUMAN_BODY_ALL_ALLOWED_SITES,
  HUMAN_BODY_MAPPINGS,
  HUMAN_BODY_SITES_MAP,
} from "./constants";
import { groupBy, map } from "lodash";

interface Bucket {
  key: string;
  doc_count: number;
}

export interface BodyplotCountsData {
  caseCount: number;
  key: string;
}
export interface BodyplotData extends BodyplotCountsData {
  allPrimarySites: string[];
}

export const processData = (casesBuckets: Bucket[]): BodyplotData[] => {
  return map(
    groupBy(
      casesBuckets,
      (b) => HUMAN_BODY_SITES_MAP[b.key.toLowerCase()] || b.key.toLowerCase(),
    ),
    (group, majorPrimarySite) => {
      const { byPrimarySite: allPrimarySites } =
        HUMAN_BODY_MAPPINGS[majorPrimarySite as BodyPlotDataKey];

      return {
        allPrimarySites,
        caseCount: group.reduce((sum, { doc_count }) => sum + doc_count, 0),
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
            cases {
              aggregations {
                primary_site {
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
          response.data.viewer.repository.cases.aggregations.primary_site
            .buckets,
        ),
    }),
  }),
});

export const { useBodyplotCountsQuery } = bodyplotSlice;
