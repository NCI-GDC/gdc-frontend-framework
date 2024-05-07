import { Image } from "@/components/Image";
import {
  Tooltip,
  SelectProps,
  ComboboxItem,
  ComboboxLikeRenderOptionInput,
} from "@mantine/core";

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

export interface ComboboxItemModified extends ComboboxItem {
  readonly modified: boolean;
}

export interface CustomCohortSelectItemType extends SelectProps {
  renderOption?: (
    item: ComboboxLikeRenderOptionInput<ComboboxItemModified>,
  ) => React.ReactNode;
}

export const CustomCohortSelectItem: CustomCohortSelectItemType["renderOption"] =
  ({
    option: { value, label, modified, ...others },
  }: {
    option: ComboboxItemModified;
  }) => (
    <div {...others} className="w-full">
      <span className="flex justify-between gap-2 items-center">
        <span className="basis-11/12 break-all">{label}</span>
        <div className="basis-1/12 text-right leading-0">
          {modified && <UnsavedIcon />}
        </div>
      </span>
    </div>
  );
