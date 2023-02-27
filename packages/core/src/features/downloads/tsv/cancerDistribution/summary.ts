import {
  GraphQLApiResponse,
  graphqlAPISlice,
} from "../../../gdcapi/gdcgraphql";
import { cdFilters } from "./cdFilters";

// CD = Cancer Distribution

export interface CDTableGeneSummaryData {
  cd: string;
  // gene fields
}

export interface CDTableMutationSummaryData {
  cd: string;
  // mtn fields
}

const bucketsFields = (buckets = "buckets", fields = ["doc_count", "key"]) => {
  return `${buckets} {
            ${fields.join("\n")}
          }`;
};

const aggregationTree = (root: string, filters: string[]): string => {
  // filter (:)

  const reduce = root.split(".").reduce((r, acc) => {
    return `${r} ${acc ? `{${acc} ` : `{}`}`;
  });
  console.log("filters", filters);
  const rlen = [...Array(root.length).keys()];
  const len = [`}`, `}`, `}`];
  const test = len.join("\n");
  console.log("test", reduce + test, "rlen", rlen);
  return reduce;

  // todo: include these fields

  // const { data: projects, isFetching: projectsFetching } = useProjects({
  //   filters: {
  //     op: "in",
  //     content: {
  //       field: "project_id",
  //       value: data?.projects.map((p) => p.key),
  //     },
  //   },
  //   expand: [
  //     "summary",
  //     "summary.data_categories",
  //     "summary.experimental_strategies",
  //     "program",
  //   ],
  //   size: data?.projects.length,
  // });
};

const getCDQuery = (id: string, entity: string): string => {
  switch (entity) {
    case "genes": {
      const {
        ssmsTestedFilter,
        cnvLossFilters,
        cnvGainFilters,
        ...otherFilters
      } = cdFilters(id);
      console.log("otherFilters", otherFilters);
      aggregationTree(
        "ssms.aggregations(filters).occurrence__case__project__project_id",
        [
          "filters_case_aggregations",
          "ssms_counts",
          "cnv_tested",
          "entity_tested",
        ],
      );
      // todo
      return `
      query CancerDistributionTable(
        $ssmTested: FiltersArgument
        $ssmCountsFilters: FiltersArgument
        $filters_case_aggregations: FiltersArgument
        $cnvGainFilter: FiltersArgument
        $cnvLossFilter: FiltersArgument
        $cnvTested: FiltersArgument
      ) {
        viewer {
          explore {
            ssms {
              aggregations(filters: $ssmCountsFilters) {
                occurrence__case__project__project_id {
                  ${bucketsFields()}
                }
              }
            }
            cases {
              filtered: aggregations(filters: $filters_case_aggregations) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              cnvGain: aggregations(filters: $cnvGainFilter) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              cnvLoss: aggregations(filters: $cnvLossFilter) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              cnvTotal: aggregations(filters: $cnvTested) {
                 project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              total: aggregations(filters: $ssmTested) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      }
    `;
    }
    case "ssms": {
      // todo
      return `MutationsCDTableQuery`;
    }
    default: {
      return "defaultCDQuery";
    }
  }
};

const getCDFilters = (id: string, entity: string): Record<string, any> => {
  switch (entity) {
    case "genes": {
      return { id: id };
    }
    // case "ssms": {
    //   return {};
    // }
    default: {
      return {};
    }
  }
};

export const cancerDistributionDownloadSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getCDTableGeneSummaryDL: builder.query({
      query: (request: { gene: string }) => ({
        graphQLQuery: getCDQuery(request.gene, "genes") as string,
        graphQLFilters: getCDFilters(request.gene, "genes") as Record<
          string,
          unknown
        >,
      }),
      transformResponse: (
        response: GraphQLApiResponse<any>,
      ): CDTableGeneSummaryData[] => {
        console.log("cd table response", response);
        return [] as CDTableGeneSummaryData[];
      },
    }),
  }),
});

export const { useGetCDTableGeneSummaryDLQuery } =
  cancerDistributionDownloadSlice;
