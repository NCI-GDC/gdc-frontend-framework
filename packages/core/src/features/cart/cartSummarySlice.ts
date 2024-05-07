import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

const graphQLQuery = `
  query CartSummary(
    $fileFilters: FiltersArgument
  ) {
    viewer {
      cart_summary {
        aggregations(filters: $fileFilters) {
          project__project_id {
            buckets {
              case_count
              doc_count
              file_size
              key
            }
          }
        }
      }
    }
  }
`;

export interface CartAggregation {
  case_count: number;
  doc_count: number;
  file_size: number;
  key: string;
}

export interface CartSummaryData {
  total_case_count: number;
  total_doc_count: number;
  total_file_size: number;
  byProject: CartAggregation[];
}

const cartSummarySlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    cartSummary: builder.query<CartSummaryData, string[]>({
      query: (cart) => {
        const graphQLFilters = {
          fileFilters: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "files.file_id",
                  value: cart,
                },
              },
            ],
          },
        };
        return {
          graphQLFilters,
          graphQLQuery,
        };
      },
      transformResponse: (response) => {
        const byProject: CartAggregation[] =
          response.data.viewer.cart_summary?.aggregations.project__project_id
            .buckets || [];

        return {
          total_case_count: byProject
            .map((project) => project.case_count)
            .reduce((previous, current) => previous + current, 0),
          total_doc_count: byProject
            .map((project) => project.doc_count)
            .reduce((previous, current) => previous + current, 0),
          total_file_size: byProject
            .map((project) => project.file_size)
            .reduce((previous, current) => previous + current, 0),
          byProject,
        };
      },
    }),
  }),
});

export const { useCartSummaryQuery } = cartSummarySlice;
