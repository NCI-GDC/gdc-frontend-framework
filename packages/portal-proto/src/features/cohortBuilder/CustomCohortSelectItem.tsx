import { Image } from "@/components/Image";
import { Tooltip } from "@mantine/core";
import { forwardRef } from "react";

export const UnsavedIcon = (): JSX.Element => (
  <Tooltip label="Changes not saved" withArrow>
    <span className="leading-0 pointer-events-auto">
      <Image
        src="/user-flow/icons/cohort_unsaved.svg"
        width={16}
        height={16}
        layout="fixed"
        alt="this cohort is not saved"
      />
    </span>
  </Tooltip>
);

export interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  modified: boolean;
}

export const CustomCohortSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, label, modified, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <span className="flex justify-between gap-2 items-center">
        <span className="basis-11/12 break-all">{label}</span>
        <div className="basis-1/12 text-right leading-0">
          {modified && <UnsavedIcon />}
        </div>
      </span>
    </div>
  ),
);
