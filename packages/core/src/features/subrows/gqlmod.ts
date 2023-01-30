export const getAliasQueryList = (ids: string[]) => {
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

export const getGQLQuery = (ids: string[]) => {
  // geneIds: string[], filters: string
  // ${filters}
  const query = `
  query GenesTableSubrows(
      $filters_case: FiltersArgument
      ${`${ids.map((id) => {
        return `$filters_gene_${`${id}`}: FiltersArgument`;
      })}`}
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
        } ${`${ids.map((id) => {
          return `filters_gene_${id}: aggregations(filters: $filters_gene_${`${id}`}) {
            project__project_id {
              buckets {
                key
                doc_count
              }
            }
          }`;
        })}`}
  }
}
}`;
  // ${getAliasQueryList(geneIds).replaceAll(",", " ")}
  console.log("QUEWRYYY", query);
  debugger;
  return query.replaceAll(",", " ");
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

export const getAliasFilters = (ids: string[]) => {
  let filters = { ...caseFilter } as Record<string, unknown>;
  for (const id of ids) {
    filters[`filters_gene_${id}`] = {
      op: "and",
      content: [
        {
          content: {
            field: "genes.gene_id",
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
