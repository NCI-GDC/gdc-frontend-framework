import {
  GraphQLApiResponse,
  GraphqlApiSliceRequest,
  TableSubrowData,
} from "@gff/core";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import ListSpring from "./ListSpring";
import { Loader } from "@mantine/core";

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
      TableSubrowData[],
      "graphql"
    >
  >;
  subrowTitle: string;
}

export const Subrow: React.FC<SubrowProps> = ({
  id,
  query,
  subrowTitle,
}: SubrowProps) => {
  const { data: subData, isFetching, isSuccess, isError } = query({ id });

  return (
    <div className="relative">
      {isFetching && <Loader />}
      {isError && <span>Error: Failed to fetch {subrowTitle}</span>}
      {isSuccess && <ListSpring subData={subData} subrowTitle={subrowTitle} />}
    </div>
  );
};

export default Subrow;
