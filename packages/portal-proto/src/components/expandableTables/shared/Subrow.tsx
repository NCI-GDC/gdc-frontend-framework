import {
  useGetGeneTableSubrowQuery,
  useGetSomaticMutationTableSubrowQuery,
} from "@gff/core";
import { useSpring } from "@react-spring/web";
import ListSpring from "./ListSpring";
import { Loader } from "@mantine/core";
import { animated } from "@react-spring/web";
import { useScrollIntoView } from "@mantine/hooks";
import { useEffect } from "react";

export interface SubrowProps {
  id: string;
  width: number;
  subrowTitle: string;
  isGene: boolean;
}

export const Subrow: React.FC<SubrowProps> = ({
  id,
  width,
  subrowTitle,
  isGene,
}: SubrowProps) => {
  const scrollOffset = 200;
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: scrollOffset,
  });

  const horizontalSpring = useSpring({
    from: { width: width / 2, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const loaderWidth = useSpring({
    from: { width: width / 2 },
    to: { width: width },
    immediate: true,
  });
  const loaderSpring = useSpring({
    from: { height: 0 },
    to: { height: 50 },
  });

  const { data, isFetching, isSuccess, isError } = (
    isGene ? useGetGeneTableSubrowQuery : useGetSomaticMutationTableSubrowQuery
  )({ id });

  useEffect(() => {
    console.log("subdata inside subrow", data);
  }, [data]);

  useEffect(() => {
    scrollIntoView();
  }, [isSuccess, scrollIntoView]);

  return (
    <div ref={targetRef}>
      {isFetching && (
        <div aria-labelledby="expandedSubrow" className={`relative`}>
          <animated.div
            className={`flex bg-inherit absolute w-screen`}
            style={loaderWidth}
          >
            <div className={`m-auto mt-2`}>
              <Loader />
            </div>
          </animated.div>
          <animated.div style={loaderSpring}></animated.div>
        </div>
      )}
      {isError && <span>Error: Failed to fetch {subrowTitle}</span>}
      {isSuccess && data.length && (
        <ListSpring
          subData={data}
          horizontalSpring={horizontalSpring}
          subrowTitle={subrowTitle}
        />
      )}
    </div>
  );
};

export default Subrow;
