import { useRouter } from "next/router";

export type useIsDemoAppType = () => boolean;
export const useIsDemoApp: useIsDemoAppType = (): boolean => {
  const {
    query: { demoMode },
  } = useRouter();
  return demoMode === "true";
};
