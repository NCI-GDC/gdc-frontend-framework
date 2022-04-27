import { graphqlAPI } from "../gdcapi/gdcgraphql";

interface PValueResponse {
  readonly analysis: {
    readonly pvalue: number;
  };
}

export const fetchPValue = async (data: number[][]): Promise<number> => {
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

  const response = await graphqlAPI<PValueResponse>(
    graphQLQuery,
    graphQLFilters,
  );
  return response?.data?.analysis.pvalue;
};
