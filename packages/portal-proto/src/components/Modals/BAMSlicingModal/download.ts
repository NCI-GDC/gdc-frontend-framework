import Cookies from "js-cookie";
import { assign, includes, isPlainObject, reduce, uniqueId } from "lodash";

const arrayToStringOnFields = (key, value, fields) =>
  includes(fields, key) ? [].concat(value).join() : value;

const arrayToStringFields = ["expand", "fields", "facets"];

const toHtml = (key, value) =>
  `<input
  type="hidden"
  name="${key}"
  value="${
    isPlainObject(value) ? JSON.stringify(value).replace(/"/g, "&quot;") : value
  }"
/>`;

const hashString = (s) =>
  s.split("").reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0);
const cookiePath = "/";

export const download = ({
  url,
  params,
}: {
  url: string;
  params: Record<string, any>;
}) => {
  const downloadToken = uniqueId(`${+new Date()}-`);
  // a cookie value that the server will remove as a download-ready indicator
  const cookieKey = navigator.cookieEnabled
    ? Math.abs(hashString(JSON.stringify(params) + downloadToken)).toString(16)
    : null;

  // const paramVal = params;
  if (cookieKey) {
    Cookies.set(cookieKey, downloadToken);
    assign(params, {
      downloadCookieKey: cookieKey,
      downloadCookiePath: cookiePath,
    });
  }

  const fields = reduce(
    params,
    (result, value, key) => {
      const paramValue = arrayToStringOnFields(key, value, arrayToStringFields);
      return (
        result +
        [].concat(paramValue).reduce((acc, v) => acc + toHtml(key, v), "")
      );
    },
    "",
  );

  console.log(params);

  console.log(JSON.stringify(params));

  const downloadWorker = new Worker(
    new URL("./download.worker.ts", import.meta.url),
  );

  downloadWorker.onmessage = (msg) => {
    console.log(msg);
  };
  downloadWorker.postMessage({
    url,
    method: "POST",
    params,
  });
};
