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
  return (
    <CommonSubcomponent
      subData={subData}
      subrowTitle="# Affected Cases Across The GDC"
      isFetching={isFetching}
      isError={isError}
      isSuccess={isSuccess}
    />
  );
}

export default SMTableSubcomponent;
