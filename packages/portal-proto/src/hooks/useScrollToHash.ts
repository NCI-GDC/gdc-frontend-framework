import { useEffect } from "react";

/**
 * Scrolls to hash in url when component mounts and removes hash from url when component unmounts
 * @param valid_hashes what hashes in url should trigger scroll
 */
const useScrollToHash = (valid_hashes: string[]) => {
  useEffect(() => {
    const hash = window?.location?.hash.split("#")?.[1];
    if (hash && valid_hashes.includes(hash)) {
      const hashElement = document.getElementById(hash);
      if (hashElement) {
        setTimeout(() => hashElement.scrollIntoView(), 500);
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Remove hash when component unmounts
    return () => history.replaceState(null, null, " ");
  }, []);
};

export default useScrollToHash;
