import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { v4 as uuidv4 } from "uuid";
import {
  useCoreDispatch,
  hideModal,
  isIncludes,
  Operation,
  FilterSet,
  FilterGroup,
} from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface UpdateCohortButtonProps {
  readonly ids: string[];
  readonly disabled: boolean;
  readonly hooks: {
    readonly updateFilters?: (
      field: string,
      op: Operation,
      groups?: FilterGroup[],
    ) => void;
    readonly createSet?: UseMutation<any>;
    readonly getExistingFilters?: () => FilterSet;
    readonly useAddNewFilterGroups?: () => (groups: FilterGroup[]) => void;
  };
  readonly facetField: string;
}

const UpdateCohortButton: React.FC<UpdateCohortButtonProps> = ({
  ids,
  disabled,
  hooks,
  facetField,
}: UpdateCohortButtonProps) => {
  const dispatch = useCoreDispatch();
  const existingFilters = hooks.getExistingFilters();
  const existingOperation = existingFilters?.root?.[facetField];
  const addNewFilterGroups = hooks.useAddNewFilterGroups();

  return (
    <DarkFunctionButton
      disabled={disabled}
      onClick={() => {
        hooks.updateFilters(facetField, {
          field: facetField,
          operator: "includes",
          operands: [
            ...(existingOperation && isIncludes(existingOperation)
              ? existingOperation?.operands
              : []),
            ...ids,
          ],
        });
        if (ids.length > 1) {
          addNewFilterGroups([{ ids, field: facetField, groupId: uuidv4() }]);
        }
        dispatch(hideModal());
      }}
    >
      Submit
    </DarkFunctionButton>
  );
};

export default UpdateCohortButton;
