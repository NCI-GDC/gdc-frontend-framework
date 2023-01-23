import { useRouter } from "next/router";

export const useIsDemoApp = (): boolean => {
  const {
    query: { demoMode },
  } = useRouter();
  return demoMode === "true";
};
