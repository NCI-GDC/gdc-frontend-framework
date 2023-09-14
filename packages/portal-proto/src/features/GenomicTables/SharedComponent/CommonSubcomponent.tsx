import { Loader } from "@mantine/core";
import { TableSubrowData } from "@gff/core";
import ListAffectedCases from "./ListAffectedCases";

interface CommonSubcomponentProps {
  subData: ReadonlyArray<TableSubrowData>;
  subrowTitle: string;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
}

function CommonSubcomponent({
  subData,
  subrowTitle,
  isFetching,
  isError,
  isSuccess,
}: CommonSubcomponentProps): JSX.Element {
  return (
    <div className="relative">
      {isFetching && (
        <div className="py-5 flex justify-center items-center">
          <Loader />
        </div>
      )}
      {isError && <span>Error: Failed to fetch </span>}
      {isSuccess && (
        <ListAffectedCases subData={subData} subrowTitle={subrowTitle} />
      )}
    </div>
  );
}

export default CommonSubcomponent;
