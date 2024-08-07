import { Image } from "@/components/Image";
import {
  Tooltip,
  SelectProps,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from "@mantine/core";

export const UnsavedIcon = ({ label }: { label: string }): JSX.Element => (
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

export interface ComboboxItemModified extends ComboboxItem {
  readonly isSavedUnchanged: boolean;
  readonly cohortStatusMessage: string;
}

export interface CustomCohortSelectItemType extends SelectProps {
  renderOption?: (
    item: ComboboxLikeRenderOptionInput<ComboboxItemModified>,
  ) => React.ReactNode;
}

export const CustomCohortSelectItem: CustomCohortSelectItemType["renderOption"] =
  ({
    option: { value, label, isSavedUnchanged, cohortStatusMessage, ...others },
  }: {
    option: ComboboxItemModified;
  }) => {
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
