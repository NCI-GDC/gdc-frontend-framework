import { Tooltip } from "@mantine/core";
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
    <button
      data-testid="button-cohort-bar-pin-unpin"
      className="bg-primary-darker hover:bg-primary-darkest h-12 w-12 grid place-items-center text-white rounded-md"
      onClick={() => handleIsSticky(!isSticky)}
      aria-label="Toggle to pin or unpin cohort bar to top of Analysis Center"
    >
      <>
        {/* Using CSS to hide/unhide is making the tooltip behave correctly */}
        <StickyOnIcon size="24px" className={isSticky ? "visible" : "hidden"} />
        <StickyOffIcon
          size="24px"
          className={!isSticky ? "visible" : "hidden"}
        />
      </>
    </button>
  </Tooltip>
);

export default StickyControl;
