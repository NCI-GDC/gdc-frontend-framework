import { useEffect } from "react";

const useScrollToHash = (valid_hashes: string[]) => {
  useEffect(() => {
    const hash = window?.location?.hash.split("#")?.[1];
    if (hash && valid_hashes.includes(hash)) {
      const hashElement = document.getElementById(hash);
      if (hashElement) {
        setTimeout(() => hashElement.scrollIntoView(), 500);
      }
    }
  }, []);
};

export default useScrollToHash;
