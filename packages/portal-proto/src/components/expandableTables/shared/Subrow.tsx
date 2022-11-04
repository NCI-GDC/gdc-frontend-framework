import {
  GraphQLApiResponse,
  GraphqlApiSliceRequest,
  TableSubrowData,
} from "@gff/core";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useSpring } from "react-spring";
import ListSpring from "./ListSpring";
import { Loader } from "@mantine/core";
import { animated } from "react-spring";
import { useScrollIntoView } from "@mantine/hooks";
import { useEffect } from "react";

export interface SubrowProps {
  id: string;
  width: number;
  query: UseQuery<
    QueryDefinition<
      {
        id: string;
      },
      (request: GraphqlApiSliceRequest) => Promise<
        | {
            error: unknown;
            data?: undefined;
          }
        | {
            data: GraphQLApiResponse<any>;
            error?: undefined;
          }
      >,
      never,
      TableSubrowData,
      "graphql"
    >
  >;
  subrowTitle: string;
}

export const Subrow: React.FC<SubrowProps> = ({
  id,
  width,
  query,
  subrowTitle,
}: SubrowProps) => {
  const scrollOffset: number = 100;
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: scrollOffset,
  });

  const horizontalSpring = useSpring({
    from: { width: width / 2, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const loaderWidth = useSpring({
    from: { width: 0 },
    to: { width: width },
    immediate: true,
  });
  const loaderSpring = useSpring({
    from: { height: 0 },
    to: { height: 50 },
  });

  const { data: subData, isFetching, isSuccess, isError } = query({ id });

  useEffect(() => {
    scrollIntoView();
  }, [isSuccess]);

  return (
    <div>
      {isFetching && (
        <div className={`relative`}>
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
      {isSuccess && (
        <div ref={targetRef} className={`relative`}>
          <ListSpring
            subData={subData}
            horizontalSpring={horizontalSpring}
            subrowTitle={subrowTitle}
          />
        </div>
      )}
    </div>
  );
};

export default Subrow;
