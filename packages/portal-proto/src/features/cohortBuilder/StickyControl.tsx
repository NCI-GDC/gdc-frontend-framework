import { StickyOffIcon, StickyOnIcon } from "@/utils/icons";
import { Tooltip, ActionIcon } from "@mantine/core";

const StickyControl = ({
  handleIsSticky,
  isSticky,
}: {
  handleIsSticky: (isSticky: boolean) => void;
  isSticky: boolean;
}): JSX.Element => {
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
      <ActionIcon
        data-testid="button-pin-unpin-cohort-bar"
        classNames={{
          root: "bg-primary-darker text-white rounded-md hover:bg-primary-darkest h-12 w-12 border-2 border-transparent hover:border-white focus:border-white cursor-pointer",
        }}
        aria-label="Pin Cohort Bar"
        onClick={() => handleIsSticky(!isSticky)}
      >
        {isSticky ? (
          <StickyOnIcon size="24px" />
        ) : (
          <StickyOffIcon size="24px" />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default StickyControl;
