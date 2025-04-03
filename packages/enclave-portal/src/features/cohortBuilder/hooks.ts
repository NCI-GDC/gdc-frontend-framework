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
