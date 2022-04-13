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

  const response = await graphqlAPI(graphQLQuery, graphQLFilters) as any;
  return response?.data?.analysis.pvalue;
};