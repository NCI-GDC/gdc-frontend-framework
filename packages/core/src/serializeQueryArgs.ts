import { isPlainObject } from "lodash";
import Cookies from "js-cookie";

const cache: WeakMap<any, string> | undefined = WeakMap
  ? new WeakMap()
  : undefined;

const serializeQueryArgsWithDataRelease = ({
  endpointName,
  queryArgs,
}: {
  endpointName: string;
  queryArgs: any;
}) => {
  let serialized = "";

  const cached = cache?.get(queryArgs);

  if (typeof cached === "string") {
    serialized = cached;
  } else {
    const stringified = JSON.stringify(queryArgs, (_, value) =>
      isPlainObject(value)
        ? Object.keys(value)
            .sort()
            .reduce<any>((acc, key) => {
              acc[key] = (value as any)[key];
              return acc;
            }, {})
        : value,
    );
    if (isPlainObject(queryArgs)) {
      cache?.set(queryArgs, stringified);
    }
    serialized = stringified;
  }

  const dataRelease = Cookies.get("gdc_api_version");

  return dataRelease
    ? `${dataRelease}:${endpointName}(${serialized})`
    : `${endpointName}(${serialized})`;
};

export default serializeQueryArgsWithDataRelease;
