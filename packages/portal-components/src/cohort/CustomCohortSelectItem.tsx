import React from "react";
import {
  Tooltip,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from "@mantine/core";

interface UnsavedIconProps {
  readonly label: string;
}

export const UnsavedIcon: React.FC<UnsavedIconProps> = ({ label }) => {
  return (
    <Tooltip label={label} withArrow>
      <span className="leading-0 pointer-events-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          role="img"
        >
          <title>{label}</title>
          <g
            id="Group_811"
            data-name="Group 811"
            transform="translate(-1952 -56)"
          >
            <circle
              id="Ellipse_39"
              data-name="Ellipse 39"
              cx="8"
              cy="8"
              r="8"
              transform="translate(1952 56)"
              fill="#fff"
            />
            <circle
              id="Ellipse_38"
              data-name="Ellipse 38"
              cx="7"
              cy="7"
              r="7"
              transform="translate(1953 57)"
              fill="#825d00"
            />
            <path
              id="Icon_awesome-exclamation-circle"
              data-name="Icon awesome-exclamation-circle"
              d="M12.563,6.563a6,6,0,1,1-6-6A6,6,0,0,1,12.563,6.563Zm-6,1.21A1.113,1.113,0,1,0,7.675,8.885,1.113,1.113,0,0,0,6.563,7.772Zm-1.057-4,.179,3.29a.29.29,0,0,0,.29.275H7.15a.29.29,0,0,0,.29-.275l.179-3.29a.29.29,0,0,0-.29-.306H5.8A.29.29,0,0,0,5.506,3.772Z"
              transform="translate(1953.438 57.524)"
              fill="#faaf00"
            />
          </g>
        </svg>
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
