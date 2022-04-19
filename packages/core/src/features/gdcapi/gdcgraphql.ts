
export interface GraphQLFetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly variables?: Record<string, any>;
}

type UnknownJson = Record<string, any>;

export interface GraphQLApiResponse<H = UnknownJson> {
  readonly data: H;
  readonly errors: Record<string, string> | Record<string, string>[];
}

export interface TablePageOffsetProps {
  readonly pageSize?: number;
  readonly offset?: number;
}

const buildGraphQLFetchError = async (
  res: Response,
  variables?: Record<string, any>,
): Promise<GraphQLFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    variables: variables,
  };
};

export const graphqlAPI = async <T>(query: string, variables: Record<string, unknown>): Promise<GraphQLApiResponse<T>> => {
  const res = await fetch("https://api.gdc.cancer.gov/v0/graphql", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (res.ok)
    return res.json();

  throw await buildGraphQLFetchError(res, variables);
};
