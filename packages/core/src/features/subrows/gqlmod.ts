export const getAliasQueryList = (ids: string[]) => {
  // const aliasFragments = `{
  //     ${ids.join("\r\n")}
  // }`;
  const subrowAliases = `{
        ${`${ids
          .map((id) => {
            return `filters_gene_${`${id}`}: cases {
                        denominators: aggregations(filters: $filters_case) {
                            project__project_id {
                                buckets {
                                    key
                                    doc_count
                                }
                            }
                        }
                        numerators: aggregations(filters: $filters_gene_${id}) {
                            project__project_id {
                            buckets {
                                doc_count
                                key
                            }
                        }
                        }
                    }`;
          })
          .join("\r\n")}`}}`;
  return subrowAliases;
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

export const getAliasFilterList = (id: string) => {
  return {
    [`filters_gene_${id}`]: {
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
    },
  };
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
