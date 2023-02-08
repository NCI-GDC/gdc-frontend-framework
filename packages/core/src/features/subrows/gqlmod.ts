import { startCase } from "lodash";

export const getVersion = (version: string): Record<string, string> => {
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

export const getGQLParams = (ids: string[], version: string): string => {
  const { filters } = getVersion(version);
  const params = `
  $filters_case: FiltersArgument,
  ${`${ids
    .map((id) => {
      return `${filters}_${`${id.replaceAll("-", "_")}`}: FiltersArgument`;
    })
    .join(",\r\n")}`}`;
  return params;
};

export const getAliasGraphQLQuery = (
  ids: string[],
  version: string,
): string => {
  const { filters } = getVersion(version);
  // hyphens not allowed in gql aliases
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
                 return `${filters.replace("$", "")}_${`${id.replaceAll(
                   "-",
                   "_",
                 )}`}: aggregations(filters: ${filters}_${`${id.replaceAll(
                   "-",
                   "_",
                 )}`}) {
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

export const getAliasFilters = (
  ids: string[],
  version: string,
): Record<string, unknown> => {
  const { filters: aliasFilter, id: aliasId } = getVersion(version);

  const filters = { ...caseFilter } as Record<string, unknown>;
  for (const id of ids) {
    filters[`${aliasFilter.replace("$", "")}_${id.replaceAll("-", "_")}`] = {
      op: "and",
      content: [
        {
          content: {
            field: `${aliasFilter.split("_").at(-1)}.${aliasId}`,
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
