import { ReactNode, useState } from "react";
import { Tooltip } from "@mantine/core";

type OverflowTooltippedLabelProps = {
  children: ReactNode;
  label: string;
  className?: string;
};

const OverflowTooltippedLabel = ({
  children,
  label,
  className = "flex-grow font-heading text-md pt-0.5",
}: OverflowTooltippedLabelProps): JSX.Element => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      label={label}
      disabled={!showTooltip}
      position="top-start"
      offset={0}
      multiline
      withArrow
      arrowSize={6}
      arrowOffset={20}
      classNames={{
        arrow: "bg-base-darker",
        tooltip: "bg-base-darker text-base-darker-contrast font-normal",
      }}
    >
      <div
        className={`${className} truncate ... `}
        ref={(el) => {
          if (el) {
            if (el.clientWidth < el.scrollWidth) {
              setShowTooltip(true);
            } else {
              setShowTooltip(false);
            }
          }
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltippedLabel;
