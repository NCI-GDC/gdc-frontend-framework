import React, { useState, useEffect } from "react";
import { Checkbox } from "@mantine/core";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import { VerticalTable } from "@/features/shared/VerticalTable";

interface SavedSetsProps {
  readonly sets: Record<string, string>;
  readonly createSetsInstructions: React.ReactNode;
  readonly fieldName: string;
  readonly setSavedSetSelected: (setSelected: boolean) => void;
}

const SavedSets: React.FC<SavedSetsProps> = ({
  sets,
  createSetsInstructions,
  fieldName,
  setSavedSetSelected,
}: SavedSetsProps) => {
  const [selectedSets, setSelectedSets] = useState([]);

  useEffect(() => {
    setSavedSetSelected(selectedSets.length > 0);
  }, [selectedSets]);

  const tableData = Object.entries(sets).map(([id, name]) => ({
    select: (
      <Checkbox
        value={id}
        checked={selectedSets.includes(id)}
        onChange={() =>
          selectedSets.includes(id)
            ? setSelectedSets(selectedSets.filter((i) => i !== id))
            : setSelectedSets([...selectedSets, id])
        }
      />
    ),
    name,
  }));

  return (
    <>
      {Object.keys(sets).length === 0 ? (
        <div className="flex flex-col items-center">
          <div className="h-[100px] w-[100px] rounded-[50%] bg-[#e0e9f0] flex justify-center items-center">
            <FileAddIcon className="text-primary-darkest" size={40} />
          </div>
          <p>No Saved Sets Available</p>
          {createSetsInstructions}
        </div>
      ) : (
        <VerticalTable
          tableData={tableData}
          columns={[
            { columnName: "Select", id: "select", visible: true },
            { columnName: "Name", id: "name", visible: true },
            {
              columnName: `# ${fieldName}`,
              id: "count",
              visible: true,
            },
          ]}
          selectableRow={false}
          showControls={false}
        />
      )}
    </>
  );
};

export default SavedSets;
