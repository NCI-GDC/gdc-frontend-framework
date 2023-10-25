import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import {
  useCoreDispatch,
  hideModal,
  isIncludes,
  Operation,
  FilterSet,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { useEffect } from "react";

interface UpdateCohortButtonProps {
  readonly ids: string[];
  readonly disabled: boolean;
  readonly hooks: {
    readonly updateFilters?: (field: string, op: Operation) => void;
    readonly createSet?: UseMutation<MutationDefinition<any, any, any, string>>;
    readonly getExistingFilters?: () => FilterSet;
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
  const [createSet, response] = hooks.createSet();

  useEffect(() => {
    if (response.isSuccess) {
      hooks.updateFilters(facetField, {
        field: facetField,
        operator: "includes",
        operands: [
          ...(existingOperation && isIncludes(existingOperation)
            ? existingOperation?.operands ?? []
            : []),
          `set_id:${response.data}`,
        ],
      });

      dispatch(hideModal());
    } else if (response.isError) {
      showNotification({ message: "Problem applying set.", color: "red" });
    }
  }, [
    response.data,
    response.isSuccess,
    response.isError,
    dispatch,
    existingOperation,
    facetField,
    hooks,
  ]);

  return (
    <DarkFunctionButton
      disabled={disabled}
      onClick={() => {
        if (ids.length > 1) {
          createSet({ values: ids });
        } else {
          hooks.updateFilters(facetField, {
            field: facetField,
            operator: "includes",
            operands: [
              ...(existingOperation && isIncludes(existingOperation)
                ? existingOperation?.operands ?? []
                : []),
              ...ids,
            ],
          });
          dispatch(hideModal());
        }
      }}
    >
      Submit
    </DarkFunctionButton>
  );
};

export default UpdateCohortButton;
