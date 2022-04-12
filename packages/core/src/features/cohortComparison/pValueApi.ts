import { graphqlAPI } from "../gdcapi/gdcgraphql";

export const fetchPValue = async (data: any) => {
  const graphQLQuery = `
    query pValue($data: [[Int]]!) {
      analysis {
        pvalue(data: $data)
      }
    }
  `;

  const graphQLFilters = {
    data,
  };

  return await graphqlAPI(graphQLQuery, graphQLFilters);
};
