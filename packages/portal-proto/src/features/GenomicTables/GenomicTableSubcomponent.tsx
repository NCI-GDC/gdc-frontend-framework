import { ListSpring } from "@/components/expandableTables/shared";
import { Loader } from "@mantine/core";

function GenomicTableSubcomponent({
  id,
  query,
}: {
  id: string;
  query: any;
}): JSX.Element {
  const { data: subData, isFetching, isSuccess, isError } = query({ id });
  return (
    <div className="relative">
      {isFetching && <Loader />}
      {isError && <span>Error: Failed to fetch </span>}
      {isSuccess && (
        <ListSpring
          subData={subData}
          subrowTitle="# SSMS Affected Cases Across The GDC"
        />
      )}
    </div>
  );
}

export default GenomicTableSubcomponent;
