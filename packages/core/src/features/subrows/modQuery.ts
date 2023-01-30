export const getAliasQueryList = (ids: string[]) => {
  // const aliasFragments = `{
  //     ${ids.join("\r\n")}
  // }`;
  const subrowAliases = `{
        ${`${ids
          .map((id) => {
            return `${`${id}`}Cases: cases {
                        denominators: aggregations(filters: $filters_case) {
                            project__project_id {
                                buckets {
                                    key
                                    doc_count
                                }
                            }
                        }
                        numerators: aggregations(filters: $filters_gene) {
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
  console.log(subrowAliases);
  return subrowAliases;
};
