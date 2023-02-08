import { startCase } from "lodash";

export const getVersion = (version: string) => {
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
  // todo  // const { filter, alias, ...others } = getVersion(version);
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
  return params;
};

export const getAliasGraphQLQuery = (ids: string[], version: string) => {
  // todo, destructure function results and pass those vars inside the loop for readability
  // const { filter, alias, ...others } = getVersion(version);

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
  // todo, destructure function results and pass those vars inside the loop for readability
  // const { filter, alias, ...others } = getVersion(version);

  const filters = { ...caseFilter } as Record<string, unknown>;
  for (const id of ids) {
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
  return filters;
};
