import { useEffect, useState } from "react";
import { Checkbox } from "@mantine/core";
import {
  addMutationId,
  addMutationIds,
  removeMutationId,
  removeMutationIds,
  selectSelectedMutationIds,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

interface SelectAllMutationIdsButtonProps {
  mutationIds: ReadonlyArray<string>;
}

interface SelectMutationIdButtonProps {
  readonly mutationId: string;
}

export const SelectMutationIdButton = ({
  mutationId,
}: SelectMutationIdButtonProps): JSX.Element => {
  // const pickedMutationIds = useCoreSelector((state) =>
  //   selectSelectedMutationIds(state),
  // );
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(
    // pickedMutationIds?.includes(mutationId),
    false,
  );

  // useEffect(() => {
  //   setChecked(pickedMutationIds?.includes(mutationId));
  // }, [mutationId, pickedMutationIds]);

  return (
    <Checkbox
      size="xs"
      checked={false}
      className="ml-1"
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(addMutationId({ mutationId: mutationId }));
        else dispatch(removeMutationId(mutationId));
      }}
    />
  );
};

export const SelectMutationIdsButton = ({
  mutationIds,
}: SelectAllMutationIdsButtonProps): JSX.Element => {
  // const pickedMutationIds = useCoreSelector((state) =>
  //   selectSelectedMutationIds(state),
  // );
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(false);

  // useEffect(() => {
  //   pickedMutationIds?.length > 0 &&
  //     setChecked(
  //       pickedMutationIds?.every((id) => pickedMutationIds?.includes(id)),
  //     );
  // }, [mutationIds, pickedMutationIds]);

  return (
    <Checkbox
      className="ml-1"
      size="xs"
      checked={checked}
      disabled={mutationIds.length === 0}
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(
            addMutationIds(
              mutationIds.map((x) => {
                return { mutationId: x };
              }),
            ),
          );
        else dispatch(removeMutationIds(mutationIds));
      }}
    />
  );
};
