import { useRouter } from "next/router";

function useIsDemoApp(): boolean {
  const {
    query: { demoMode },
  } = useRouter();
  return demoMode === "true";
}

export default useIsDemoApp;
