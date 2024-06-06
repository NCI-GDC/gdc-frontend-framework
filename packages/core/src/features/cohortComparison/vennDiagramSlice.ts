import { GqlOperation } from "../gdcapi/filters";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

const graphQLQuery = `
  query VennDiagram(
    $set1Filters: FiltersArgument
    $set2Filters: FiltersArgument
    $intersectionFilters: FiltersArgument
  ) {
    viewer {
      explore {
        set1: cases {
          hits(filters: $set1Filters, first: 0) {
            total
          }
        }
        set2: cases {
          hits(filters: $set2Filters,  first: 0) {
            total
          }
        }
        intersection: cases {
          hits(filters: $intersectionFilters,  first: 0) {
            total
          }
        }
      }
    }
  }
`;

interface CountData {
  readonly hits?: {
    readonly total: number;
  };
}

interface CohortVennDiagramData {
  readonly set1: CountData;
  readonly set2: CountData;
  readonly intersection: CountData;
}

interface VennDiagramRequest {
  set1Filters: GqlOperation;
  set2Filters: GqlOperation;
  intersectionFilters: GqlOperation;
}

const vennDiagramApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    vennDiagram: builder.query<CohortVennDiagramData, VennDiagramRequest>({
      query: ({ set1Filters, set2Filters, intersectionFilters }) => {
        const graphQLFilters = {
          set1Filters,
          set2Filters,
          intersectionFilters,
        };
        return {
          graphQLFilters,
          graphQLQuery,
        };
      },
      transformResponse: (response) => response?.data?.viewer?.explore,
    }),
  }),
});

export const { useVennDiagramQuery } = vennDiagramApiSlice;
