import { fetchSlice } from "@gff/core";

onmessage = async (event) => {
  const res = await fetchSlice(event.data.url, event.data.params);
  postMessage(res.status);
};
