import {
  GraphQLApiResponse,
  graphqlAPISlice,
} from "../../../gdcapi/gdcgraphql";
import {
  cdTableGeneSummaryQuery,
  cdTableMutationSummaryQuery,
  cdFilters,
  cdTableGeneSummaryFilters,
  cdTableMutationSummaryFilters,
} from "./cdFilters";

// CD = Cancer Distribution

export interface CDTableGeneSummaryData {
  cd: string;
  // gene fields
}

export interface CDTableMutationSummaryData {
  cd: string;
  // mtn fields
}

export interface CDTableProjectsResponse {
  projects: {
    project__project_id: {
      buckets: {
        doc_count: string;
        key: string;
      };
    };
  };
}

// const bucketsFields = (buckets = "buckets", fields = ["doc_count", "key"]) => {
//   return `${buckets} {
//             ${fields.join("\n")}
//           }`;
// };

const getCDQuery = (id: string, feature: string, fields: string[]): string => {
  switch (feature) {
    case "genes": {
      // let fields: columns currently visible in table
      // const dlFields = [...fields] n [...Object.keys(geneSummaryCDFields)]
      // dlFields.map(({ visibleColumn }) => mutationSummaryCDQuery)
      console.log("fields", fields);
      fields
        .map((field) => {
          return field;
          // return `${field[cdTableGeneSummaryQuery(id)]}`
        })
        .join("\n,");
      // const { } = cdTableGeneSummaryQuery;
      debugger;
      return `${id}`;
      // todo;
    }
    case "ssms": {
      // dlFields.map(({ visibleColumn }) => mutationSummaryCDFields)
      const { ...query } = cdTableMutationSummaryQuery;
      console.log(query);
      return `${id}`;
    }
    default: {
      return "defaultCDQuery";
    }
  }
};

const getCDFilters = (
  id: string,
  feature: string,
  fields: string[],
): Record<string, any> => {
  console.log("fields", fields);
  switch (feature) {
    case "genes": {
      return cdTableGeneSummaryFilters(id);
    }
    case "ssms": {
      return cdTableMutationSummaryFilters(id);
    }
    default: {
      return {};
    }
  }
};

export const cancerDistributionDownloadSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getCDTableSummaryDL: builder.mutation({
      query: ({ id, feature, fields }) => ({
        // todo, add feature tags to endpts
        graphQLQuery: getCDQuery(id, "genes", fields) as string,
        graphQLFilters: getCDFilters(id, feature, fields) as Record<
          string,
          unknown
        >,
        providesTags: (totalCDProjects: CDTableProjectsResponse[]) => [
          ...(totalCDProjects ? [...(<[]>totalCDProjects)] : []),
          { type: "Download", id: `${id}` },
        ],
      }),
      transformResponse: (
        response: GraphQLApiResponse<CDTableProjectsResponse>,
      ): CDTableGeneSummaryData[] => {
        const {
          projects: {
            project__project_id: { buckets },
          },
        } = response as unknown as CDTableProjectsResponse;
        console.log("buckets", buckets);
        debugger;
        return [] as CDTableGeneSummaryData[];
      },
    }),
  }),
});

export const { useGetCDTableSummaryDLMutation } =
  cancerDistributionDownloadSlice;

// return `
//   query CancerDistributionTable(
//     $ssmTested: FiltersArgument
//     $ssmCountsFilters: FiltersArgument
//     $filters_case_aggregations: FiltersArgument
//     $cnvGainFilter: FiltersArgument
//     $cnvLossFilter: FiltersArgument
//     $cnvTested: FiltersArgument
//   ) {
//     viewer {
//       explore {
//         ssms {
//           aggregations(filters: $ssmCountsFilters) {
//             occurrence__case__project__project_id {
//               ${bucketsFields()}
//             }
//           }
//         }
//         cases {
//           filtered: aggregations(filters: $filters_case_aggregations) {
//             project__project_id {
//               buckets {
//                 doc_count
//                 key
//               }
//             }
//           }
//           cnvGain: aggregations(filters: $cnvGainFilter) {
//             project__project_id {
//               buckets {
//                 doc_count
//                 key
//               }
//             }
//           }
//           cnvLoss: aggregations(filters: $cnvLossFilter) {
//             project__project_id {
//               buckets {
//                 doc_count
//                 key
//               }
//             }
//           }
//           cnvTotal: aggregations(filters: $cnvTested) {
//              project__project_id {
//               buckets {
//                 doc_count
//                 key
//               }
//             }
//           }
//           total: aggregations(filters: $ssmTested) {
//             project__project_id {
//               buckets {
//                 doc_count
//                 key
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `

//   todo: include these fields

//   const { data: projects, isFetching: projectsFetching } = useProjects({
//     filters: {
//       op: "in",
//       content: {
//         field: "project_id",
//         value: data?.projects.map((p) => p.key),
//       },
//     },
//     expand: [
//       "summary",
//       "summary.data_categories",
//       "summary.experimental_strategies",
//       "program",
//     ],
//     size: data?.projects.length,
//   });
// };
