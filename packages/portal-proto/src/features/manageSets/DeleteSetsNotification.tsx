import React from "react";
import { Button } from "@mantine/core";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { useCoreDispatch, addSet } from "@gff/core";
import { SetData } from "./types";

interface DeleteSetsNotificationProps {
  readonly sets: SetData[];
}

const DeleteSetsNotification: React.FC<DeleteSetsNotificationProps> = ({
  sets,
}: DeleteSetsNotificationProps) => {
  const dispatch = useCoreDispatch();
  return (
    <>
      {sets.length === 1 ? (
        <p>
          <b>{sets[0].setName}</b> has been deleted
        </p>
      ) : (
        <p>{sets.length} sets have been deleted</p>
      )}
      <Button
        variant={"white"}
        onClick={() => sets.map((set) => dispatch(addSet(set)))}
        leftSection={<UndoIcon aria-hidden="true" />}
      >
        <span className="underline">Undo</span>
      </Button>
    </>
  );
};

export default DeleteSetsNotification;
