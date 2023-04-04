export const fetcher = (
  url: string,
  query: string,
  variables: Record<string, any>,
): any => {
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .then((data) => {
      // process data
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
};
