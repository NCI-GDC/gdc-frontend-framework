import { GdcApiResponse } from "./gdcapi";
import Queue from "queue";
import md5 from "blueimp-md5";

export const swrFetcher = (
  endpoint: string,
  query?: string,
  variables?: Record<string, unknown>,
): Promise<GdcApiResponse<unknown>> => {
  return fetch(endpoint, {
    method: query && variables ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...(query && variables && { body: JSON.stringify({ query, variables }) }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        const queue = Queue({ concurrency: 6 });
        let { hits } = data;
      }
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
};
