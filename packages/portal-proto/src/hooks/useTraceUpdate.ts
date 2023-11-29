import { useRef, useEffect } from "react";

/**
 * Debugging utility hook for figuring out why a component or hook is rendering/changing. Prints
 * out the properties that changed. Credit: https://stackoverflow.com/a/51082563
 * @param props - any component props or object
 */
const useTraceUpdate = (props: any) => {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
};

export default useTraceUpdate;
