import { Tooltip, Checkbox, CheckboxProps } from "@mantine/core";
import {
  BsPin as StickyOffIcon,
  BsPinFill as StickyOnIcon,
} from "react-icons/bs";

const StickyControl = ({
  handleIsSticky,
  isSticky,
}: {
  handleIsSticky: (isSticky: boolean) => void;
  isSticky: boolean;
}): JSX.Element => {
  const CheckboxIcon: CheckboxProps["icon"] = ({
    indeterminate,
    className,
  }: {
    indeterminate: boolean;
    className: string;
  }) =>
    indeterminate ? (
      <StickyOffIcon size="24px" className={className} />
    ) : (
      <StickyOnIcon size="24px" className={className} />
    );

  return (
    <Tooltip
      label={
        isSticky
          ? "Unpin Cohort Bar"
          : "Pin Cohort Bar to top of Analysis Center"
      }
      withArrow
      position="bottom"
    >
      <Checkbox
        data-testid="button-cohort-bar-pin-unpin"
        classNames={{
          input:
            "bg-primary-darker rounded-md hover:bg-primary-darkest h-12 w-12 border-2 border-transparent hover:border-white focus:border-white cursor-pointer",
          inner: "h-12 w-12 text-white",
        }}
        icon={CheckboxIcon}
        aria-label="Pin Cohort Bar"
        checked={isSticky}
        indeterminate={!isSticky}
        onClick={() => handleIsSticky(!isSticky)}
      />
    </Tooltip>
  );
};

export default StickyControl;
