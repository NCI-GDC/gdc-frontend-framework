import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import VerticalTable from "@/components/Table/VerticalTable";
import TotalItems from "@/components/Table/TotalItem";
import { HeaderTitle } from "@/components/tailwindComponents";
import useStandardPagination from "@/hooks/useStandardPagination";
import { HandleChangeInput } from "@/components/Table/types";

type ReadGroupsDataType = {
  read_group_id: string;
  is_paired_end: string;
  read_length: string | number;
  library_name: string;
  sequencing_center: string;
  sequencing_date: string;
};

const readGroupsColumnHelper = createColumnHelper<ReadGroupsDataType>();

const ReadGroups = ({
  readGroups,
}: {
  readGroups: Array<{
    readonly read_group_id: string;
    readonly is_paired_end: boolean;
    readonly read_length: number;
    readonly library_name: string;
    readonly sequencing_center: string;
    readonly sequencing_date: string;
  }>;
}): JSX.Element => {
  const data: ReadGroupsDataType[] = useMemo(() => {
    return readGroups.map((read_group) => ({
      read_group_id: read_group.read_group_id ?? "--",
      is_paired_end: read_group.is_paired_end ? "true" : "false",
      read_length: read_group.read_length ?? "--",
      library_name: read_group.library_name ?? "--",
      sequencing_center: read_group.sequencing_center ?? "--",
      sequencing_date: read_group.sequencing_date ?? "--",
    }));
  }, [readGroups]);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(data);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  const readGroupsColumns = useMemo(
    () => [
      readGroupsColumnHelper.accessor("read_group_id", {
        header: "Read Group ID",
      }),
      readGroupsColumnHelper.accessor("is_paired_end", {
        header: "Is Paired End",
      }),
      readGroupsColumnHelper.accessor("read_length", {
        header: "Read Length",
      }),
      readGroupsColumnHelper.accessor("library_name", {
        header: "Library Name",
      }),
      readGroupsColumnHelper.accessor("sequencing_center", {
        header: "Sequencing Center",
      }),
      readGroupsColumnHelper.accessor("sequencing_date", {
        header: "Sequencing Date",
      }),
    ],
    [],
  );

  return (
    <VerticalTable
      data={displayedData}
      columns={readGroupsColumns}
      tableTotalDetail={
        <TotalItems total={readGroups?.length} itemName="read group" />
      }
      pagination={{
        page,
        pages,
        size,
        from,
        total,
        label: "read group",
      }}
      tableTitle={<HeaderTitle>Read Groups</HeaderTitle>}
      handleChange={handleChange}
    />
  );
};

export default ReadGroups;
