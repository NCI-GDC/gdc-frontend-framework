import { useEffect, useState } from "react";
import { fetchFilterTopValues } from "../enclave/client";

export const useGetEnumFacetData = (field: string) => {
  const [enumResult, setEnumResult] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchValues = async () => {
      const result = await fetchFilterTopValues(field, 100, {});
      setEnumResult(
        Object.fromEntries([...result.top_n_values].map((filter) => [filter])),
      );
    };

    fetchValues();
  }, [field]);

  return { data: enumResult, isSuccess: true };
};

export const useGetRangeFacetData = (
  field: string,
  _: any,
  queryOptions?: { minimumField?: string; maximumField?: string },
) => {
  const [result, setResult] = useState({});

  useEffect(() => {
    const fetchValues = async () => {
      const result = await fetchFilterTopValues(
        queryOptions?.minimumField as string,
        100,
        {},
      );
      setResult(
        Object.fromEntries([...result.top_n_values].map((filter) => [filter])),
      );
    };
    fetchValues();
  }, [queryOptions]);

  return { data: result, isSuccess: true };
};
