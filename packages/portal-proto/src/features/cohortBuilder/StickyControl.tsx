import { ActionIcon, Tooltip } from "@mantine/core";
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
}): JSX.Element => (
  <Tooltip
    label={
      isSticky ? "Unpin Cohort Bar" : "Pin Cohort Bar to top of Analysis Center"
    }
    withArrow
    position="bottom"
  >
    <span>
      <ActionIcon
        variant="filled"
        className="bg-primary-darker hover:bg-primary-darkest h-12 w-12"
        onClick={() => handleIsSticky(!isSticky)}
        aria-label="Toggle to pin or unpin cohort bar to top of Analysis Center"
      >
        <>
          {isSticky ? (
            <StickyOnIcon size="24px" />
          ) : (
            <StickyOffIcon size="24px" />
          )}
        </>
      </ActionIcon>
    </span>
  </Tooltip>
);

export default StickyControl;
