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
  switch (version) {
    case "genes": {
      return { filters: "$filters_genes", id: "gene_id" };
    }
    case "ssms": {
      return { filters: "$filters_mutations", id: "ssm_id" };
    }
  }
  return { filters: "$baseCase", id: "no_id" };
};

export const getAliasGraphQLQuery = (ids: string[], version: string) => {
  const query = `
  query ${version.replace("$", "").toUpperCase()}${ids.length > 1 && "s"}Query(
      $filters_case: FiltersArgument
      ${`${ids.map((id) => {
        return `${getVersion(version).filters}_${`${id}`}: FiltersArgument`;
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
          return `filters_gene_${id}: aggregations(filters: ${
            getVersion(version).filters
          }_${`${id}`}) {
            project__project_id {
              buckets {
                key
                doc_count
              }
            }
          }`;
        })}`}}}}`;
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

export const getAliasFilters = (ids: string[], version: string) => {
  let filters = { ...caseFilter } as Record<string, unknown>;
  for (const id of ids) {
    filters[`${getVersion(version).filters?.replace("$", "")}_${id}`] = {
      op: "and",
      content: [
        {
          content: {
            field: `${getVersion(version).filters.split("_").at(-1)}${
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
