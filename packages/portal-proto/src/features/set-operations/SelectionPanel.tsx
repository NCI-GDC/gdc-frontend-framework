import React from "react";
import {
  useCoreSelector,
  selectAvailableCohorts,
  selectSetsByType,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";

const SelectionPanel = () => {
  const availableCohorts = useCoreSelector((state) =>
    selectAvailableCohorts(state),
  );

  const geneSets = useCoreSelector((state) => selectSetsByType(state, "genes"));

  const mutationSets = useCoreSelector((state) =>
    selectSetsByType(state, "ssms"),
  );

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination([]);

  const columns = [
    {
      id: "select",
      columnName: "Select",
      visible: true,
    },
    {
      id: "entity_type",
      columnName: "Entity Type",
      visible: true,
    },
    {
      id: "name",
      columnName: "Name",
      visible: true,
    },
    { id: "count", columnName: "# Items", visible: true },
  ];

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

  return (
    <div className="bg-base-max flex flex-col flex-grow h-full ">
      <VerticalTable
        tableData={displayedData}
        columns={columns}
        selectableRow={false}
        showControls={false}
        pagination={{
          page,
          pages,
          size,
          from,
          total,
          label: "cohorts",
        }}
        handleChange={handleChange}
      />
    </div>
  );
};

export default SelectionPanel;
