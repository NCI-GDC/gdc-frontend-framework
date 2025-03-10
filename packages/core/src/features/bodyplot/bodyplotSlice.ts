import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  HUMAN_BODY_ALL_ALLOWED_SITES,
  HUMAN_BODY_SITES_MAP,
} from "./constants";

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
  const groupedResults: Record<string, Bucket[]> = {};

  casesBuckets.map((bucket) => {
    const primarySiteGroups = HUMAN_BODY_SITES_MAP[bucket.key];
    for (const primarySiteGroup of primarySiteGroups) {
      if (groupedResults[primarySiteGroup]) {
        groupedResults[primarySiteGroup] = [
          ...groupedResults[primarySiteGroup],
          bucket,
        ];
      } else {
        groupedResults[primarySiteGroup] = [bucket];
      }
    }
  });

  const formattedResults = Object.entries(groupedResults)
    .map(([group, buckets]) => ({
      key: group,
      allPrimarySites: buckets.map((b) => b.key),
      caseCount: buckets.reduce((sum, { doc_count }) => sum + doc_count, 0),
    }))
    .filter(({ key }) => HUMAN_BODY_ALL_ALLOWED_SITES.includes(key));

  return formattedResults;
};

export const bodyplotSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    bodyplotCounts: builder.query<BodyplotData[], void>({
      query: () => ({
        graphQLQuery: `query HumanBody {
        viewer {
          explore {
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
          response.data.viewer.explore.cases.aggregations.primary_site.buckets,
        ),
    }),
  }),
});

export const { useBodyplotCountsQuery } = bodyplotSlice;
