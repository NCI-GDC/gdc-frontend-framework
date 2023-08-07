import { Row } from "@tanstack/react-table";
import { Gene } from "./types";
// import { useGetGeneTableSubrowQuery } from "@gff/core";
// import { ListSpring } from "../../components/expandableTables/shared";
import { Loader } from "@mantine/core";

function GeneSubcomponent({ row }: { row: Row<Gene> }): JSX.Element {
  console.log({ row });
  // const {
  //   data: subData,
  //   isFetching,
  //   isSuccess,
  //   isError,
  // } = useGetGeneTableSubrowQuery({ id: row.original.geneID });

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

export default GeneSubcomponent;
