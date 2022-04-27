import { useEffect } from "react";

function useOutsideClickAlert(
  ref: React.RefObject<any>,
  callback: () => void,
): void {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);
}

export default useOutsideClickAlert;
