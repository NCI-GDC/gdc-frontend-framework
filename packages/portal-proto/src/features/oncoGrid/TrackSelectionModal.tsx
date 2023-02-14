import { useState } from "react";
import { Modal, Button } from "@mantine/core";
import { Track } from "./trackConfig";

interface TrackSelectionModalProps {
  readonly hiddenTracks: Track[];
  readonly addTracks: (tracks: Track[]) => void;
  readonly closeModal: () => void;
}

const TrackSelectionModal: React.FC<TrackSelectionModalProps> = ({
  hiddenTracks,
  addTracks,
  closeModal,
}: TrackSelectionModalProps) => {
  const [selectedTracks, setSelectedTracks] = useState([]);

  const toggleSelectedTracks = (track: Track) => {
    if (!selectedTracks.includes(track)) {
      setSelectedTracks([...selectedTracks, track]);
    } else {
      setSelectedTracks(
        selectedTracks.filter((t) => t.fieldName !== track.fieldName),
      );
    }
  };

  return (
    <Modal
      opened
      withinPortal={false}
      zIndex={400}
      onClose={closeModal}
      title="Select Tracks to Add"
    >
      <div className="flex flex-col p-2">
        {hiddenTracks.map((track) => (
          <div key={track.fieldName}>
            <input
              type="checkbox"
              onChange={() => toggleSelectedTracks(track)}
            />
            <label className="pl-1 align-middle">{track.name}</label>
          </div>
        ))}
      </div>
      <div className="flex justify-evenly pt-2">
        <Button
          onClick={() => {
            addTracks(selectedTracks);
            closeModal();
          }}
        >
          Add Tracks
        </Button>
        <Button variant={"outline"} onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default TrackSelectionModal;
