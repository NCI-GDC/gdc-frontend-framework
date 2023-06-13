import { useEffect, useState } from "react";
import { Checkbox } from "@mantine/core";
import {
  addGeneId,
  addGeneIds,
  removeGeneId,
  removeGeneIds,
  selectSelectedGeneIds,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

interface SelectAllGeneIdsButtonProps {
  geneIds: ReadonlyArray<string>;
}

interface SelectGeneIdButtonProps {
  readonly geneId: string;
}

export const SelectGeneIdButton = ({
  geneId,
}: SelectGeneIdButtonProps): JSX.Element => {
  const pickedGeneIds = useCoreSelector((state) =>
    selectSelectedGeneIds(state),
  );
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(pickedGeneIds.includes(geneId));

  useEffect(() => {
    setChecked(pickedGeneIds?.includes(geneId));
  }, [geneId, pickedGeneIds]);

  return (
    <Checkbox
      size="xs"
      checked={checked}
      className="ml-1"
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(addGeneId({ geneId: geneId }));
        else dispatch(removeGeneId(geneId));
      }}
    />
  );
};

export const SelectAllGeneIdsButton = ({
  geneIds,
}: SelectAllGeneIdsButtonProps): JSX.Element => {
  const pickedGeneIds = useCoreSelector((state) =>
    selectSelectedGeneIds(state),
  );
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    pickedGeneIds.length > 0 &&
      setChecked(geneIds.every((id) => pickedGeneIds.includes(id)));
  }, [geneIds, pickedGeneIds]);

  return (
    <Checkbox
      className="ml-1"
      size="xs"
      checked={checked}
      disabled={geneIds.length === 0}
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(
            addGeneIds(
              geneIds.map((x) => {
                return { geneId: x };
              }),
            ),
          );
        else dispatch(removeGeneIds(geneIds));
      }}
    />
  );
};
