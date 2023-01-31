import { startCase } from "lodash";

export const getSubrowQuery = (ids: string[]) => {
  // const aliasFragments = `{
  //     ${ids.join("\r\n")}
  // }`;
  //   denominators__${`${id}`}: aggregations(filters: $filters_case) {
  //     project__project_id {
  //         buckets {
  //             key
  //             doc_count
  //         }
  //     }
  // }
  const subrowAliases = `${`${ids.map((id) => {
    return `numerators__${`${id}`}: aggregations(filters: $filters_gene_${id}) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                } 
              }`;
  })}`}`;
  console.log("subrowAliases", subrowAliases);
  return subrowAliases;
};

export const getVersion = (version: string) => {
  console.log("getVersion", version);
  switch (version) {
    case "genes": {
      return { filters: "$filters_genes", id: "gene_id" };
    }
    case "ssms": {
      return { filters: "$filters_ssms", id: "ssm_id" };
    }
  }
  return { filters: "", id: "" };
};

export const getGQLParams = (ids: string[], version: string) => {
  const params = `
  $filters_case: FiltersArgument,
  ${`${ids
    .map((id) => {
      return `${getVersion(version).filters}_${`${id.replaceAll(
        "-",
        "_",
      )}`}: FiltersArgument`;
    })
    .join(",\r\n")}`}`;
  console.log("params", params);
  debugger;
  return params;
};

export const getAliasGraphQLQuery = (ids: string[], version: string) => {
  const query = `
  query ${startCase(version)}Query(${getGQLParams(ids, version)}
  ) {
      explore {
        cases {
        denominators: aggregations(filters: $filters_case) {
          project__project_id {
              buckets {
                  key
                  doc_count
              }
          }
        }
         ${
           version
             ? `${ids.map((id) => {
                 return `${getVersion(version).filters.replace(
                   "$",
                   "",
                 )}_${`${id.replaceAll("-", "_")}`}: aggregations(filters: ${
                   getVersion(version).filters
                 }_${`${id.replaceAll("-", "_")}`}) {
            project__project_id {
              buckets {
                key
                doc_count
              }
            }
          }`;
               })}`
             : ``
         }
      }
    }
  }`;
  console.log("query", query);
  debugger;
  return query;
};

export const caseFilter = {
  filters_case: {
    content: [
      {
        content: {
          field: "cases.available_variation_data",
          value: ["ssm"],
        },
        op: "in",
      },
    ],
    op: "and",
  },
};

export const getAliasFilters = (ids: string[], version: string) => {
  let filters = { ...caseFilter } as Record<string, unknown>;
  // filters_mutation: {
  //   content: [
  //     {
  //       content: {
  //         field: "ssms.ssm_id",
  //         value: [request.id],
  //       },
  //       op: "in",
  //     },
  //     {
  //       content: {
  //         field: "cases.gene.ssm.observation.observation_id",
  //         value: "MISSING",
  //       },
  //       op: "NOT",
  //     },
  //   ],
  //   op: "and",
  // },
  for (const id of ids) {
    // getVersion(version).filters => "$filters_ssms"
    filters[
      `${getVersion(version).filters.replace("$", "")}_${id.replaceAll(
        "-",
        "_",
      )}`
    ] = {
      op: "and",
      content: [
        {
          content: {
            field: `${getVersion(version).filters.split("_").at(-1)}.${
              getVersion(version).id
            }`,
            value: [id],
          },
          op: "in",
        },
        {
          op: "NOT",
          content: {
            field: "cases.gene.ssm.observation.observation_id",
            value: "MISSING",
          },
        },
      ],
    };
  }
  console.log("ssms filters", filters);
  return filters;
};

// inside explore

// cases {
//     denominators: aggregations(filters: $filters_case) {
//       project__project_id {
//           buckets {
//               key
//               doc_count
//           }
//       }
//     }
//       numerators: aggregations(filters: $filters_gene) {
//           project__project_id {
//               buckets {
//                   doc_count
//                   key
//               }
//           }
//       }
//   }
