import { useGetSomaticMutationTableSubrowQuery } from "@gff/core";
import { Row } from "@tanstack/react-table";
import { SomaticMutation } from "./types";
import CommonSubcomponent from "../SharedComponent/CommonSubcomponent";

function SMTableSubcomponent({
  row,
}: {
  row: Row<SomaticMutation>;
}): JSX.Element {
  const {
    data: subData,
    isFetching,
    isSuccess,
    isError,
  } = useGetSomaticMutationTableSubrowQuery({ id: row.original.mutation_id });
  console.log("subData", subData, isFetching, isSuccess, isError);
  return (
    <CommonSubcomponent
      subData={subData}
      subrowTitle="# Affected Cases Across The GDC.....22"
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
    />
  );
}

export default SMTableSubcomponent;
