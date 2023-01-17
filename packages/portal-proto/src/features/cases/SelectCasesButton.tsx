import { useEffect, useState } from "react";
import { Checkbox } from "@mantine/core";
import {
  addCase,
  addCases,
  removeCase,
  removeCases,
  selectSelectedCases,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

interface SelectAllCasesButtonProps {
  caseIds: ReadonlyArray<string>;
}

interface SelectCaseButtonProps {
  readonly caseId: string;
}

export const SelectCaseButton = ({
  caseId,
}: SelectCaseButtonProps): JSX.Element => {
  const pickedCases = useCoreSelector((state) => selectSelectedCases(state));
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(pickedCases.includes(caseId));

  useEffect(() => {
    setChecked(pickedCases.includes(caseId));
  }, [caseId, pickedCases]);

  return (
    <Checkbox
      size="xs"
      checked={checked}
      className="ml-1"
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked) dispatch(addCase({ caseId: caseId }));
        else dispatch(removeCase(caseId));
      }}
    />
  );
};

export const SelectAlCasesButton = ({
  caseIds,
}: SelectAllCasesButtonProps): JSX.Element => {
  const pickedCases = useCoreSelector((state) => selectSelectedCases(state));
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    caseIds.length > 0 &&
      setChecked(caseIds.every((id) => pickedCases.includes(id)));
  }, [caseIds, pickedCases]);

  return (
    <Checkbox
      className="ml-1"
      size="xs"
      checked={checked}
      disabled={caseIds.length === 0}
      onChange={(event) => {
        setChecked(event.currentTarget.checked);
        if (event.currentTarget.checked)
          dispatch(
            addCases(
              caseIds.map((x) => {
                return { caseId: x };
              }),
            ),
          );
        else dispatch(removeCases(caseIds));
      }}
    />
  );
};
