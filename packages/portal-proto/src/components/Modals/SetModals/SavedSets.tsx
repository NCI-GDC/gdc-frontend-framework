import React, { useState } from "react";
import { Checkbox } from "@mantine/core";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import { VerticalTable } from "@/features/shared/VerticalTable";
import SetModalButtons from "./SetModalButtons";

interface SavedSetsProps {
  readonly sets: Record<string, string>;
  readonly fieldName: string;
  readonly createSetsInstructions: React.ReactNode;
  readonly selectSetInstructions: string;
}

const SavedSets: React.FC<SavedSetsProps> = ({
  sets,
  fieldName,
  createSetsInstructions,
  selectSetInstructions,
}: SavedSetsProps) => {
  const [selectedSets, setSelectedSets] = useState([]);

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
      <div className="p-4">
        {Object.keys(sets).length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="h-[100px] w-[100px] rounded-[50%] bg-[#e0e9f0] flex justify-center items-center">
              <FileAddIcon className="text-primary-darkest" size={40} />
            </div>
            <p className="uppercase mt-2 mb-4 text-primary-darkest">
              No Saved Sets Available
            </p>
            <div className="w-80 text-center">{createSetsInstructions}</div>
          </div>
        ) : (
          <>
            <p className="text-sm">{selectSetInstructions}</p>
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
          </>
        )}
      </div>
      <SetModalButtons
        saveButtonDisabled
        clearButtonDisabled={selectedSets.length === 0}
        submitButtonDisabled={selectedSets.length === 0}
        onClearCallback={() => setSelectedSets([])}
      />
    </>
  );
};

export default SavedSets;
