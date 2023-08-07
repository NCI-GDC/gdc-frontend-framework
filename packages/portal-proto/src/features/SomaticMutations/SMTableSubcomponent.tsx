import { Row } from "@tanstack/react-table";
import { SomaticMutation } from "./types";
// import { useGetSomaticMutationTableSubrowQuery } from "@gff/core";
// import { ListSpring } from "../../components/expandableTables/shared";
import { Loader } from "@mantine/core";

function SMTableSubcomponent({
  row,
}: {
  row: Row<SomaticMutation>;
}): JSX.Element {
  console.log({ row });
  //   const {
  //     data: subData,
  //     isFetching,
  //     isSuccess,
  //     isError,
  //   } = useGetSomaticMutationTableSubrowQuery({ id: row.original.mutation_id });

  return (
    <div className="relative">
      {/* {isFetching && <Loader />}
      {isError && <span>Error: Failed to fetch </span>}
      {isSuccess && (
        <ListSpring
          subData={subData}
          subrowTitle="# SSMS Affected Cases Across The GDC"
        />
      )} */}
      <Loader />
    </div>
  );
}

export default SMTableSubcomponent;
