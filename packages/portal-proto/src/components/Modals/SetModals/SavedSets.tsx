import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";

interface SavedSetsProps {
  readonly sets: Record<string, string>;
  readonly createSetsInstructions: React.ReactNode;
}

const SavedSets: React.FC<SavedSetsProps> = ({
  sets,
  createSetsInstructions,
}: SavedSetsProps) => {
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
        <></>
      )}
    </>
  );
};

export default SavedSets;
