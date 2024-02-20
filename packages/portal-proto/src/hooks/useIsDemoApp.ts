import { useRouter } from "next/router";

export type useIsDemoAppType = () => boolean;

/**
 * Returns true if the demoMode query param is set to true
 * @category Hooks
 */
export const useIsDemoApp: useIsDemoAppType = (): boolean => {
  const {
    query: { demoMode },
  } = useRouter();
  return demoMode === "true";
};
