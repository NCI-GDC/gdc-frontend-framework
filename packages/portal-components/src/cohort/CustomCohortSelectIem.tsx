import React, { useContext } from "react";
import {
  Tooltip,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from "@mantine/core";
import { AppContext } from "src/context";

interface UnsavedIconProps {
  readonly label: string;
}

export const UnsavedIcon: React.FC<UnsavedIconProps> = ({ label }) => {
  const { Image } = useContext(AppContext);

  return (
    <Tooltip label={label} withArrow>
      <span className="leading-0 pointer-events-auto">
        <Image
          src="/user-flow/icons/cohort_unsaved.svg"
          width={16}
          height={16}
          layout="fixed"
          alt={label}
        />
      </span>
    </Tooltip>
  );
};

export interface ComboboxItemModified extends ComboboxItem {
  readonly isSavedUnchanged: boolean;
  readonly cohortStatusMessage: string;
}

export const CustomCohortSelectItem = ({
  option: { value, label, isSavedUnchanged, cohortStatusMessage, ...others },
}: ComboboxLikeRenderOptionInput<ComboboxItemModified>) => {
  return (
    <div {...others} className="w-full">
      <span className="flex justify-between gap-2 items-center">
        <span className="basis-11/12 break-all">{label}</span>
        <div className="basis-1/12 text-right leading-0">
          {!isSavedUnchanged && <UnsavedIcon label={cohortStatusMessage} />}
        </div>
      </span>
    </div>
  );
};
