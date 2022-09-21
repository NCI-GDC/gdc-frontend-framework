import { ReactNode, useState } from "react";
import { Tooltip } from "@mantine/core";

type OverflowTooltippedLabelProps = {
  children: ReactNode;
  label: string;
};

const OverflowTooltippedLabel = (
  props: OverflowTooltippedLabelProps,
): JSX.Element => {
  const { children, label } = props;

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {showTooltip ? (
        <Tooltip label={label} position="top-start" multiline>
          <div
            className="flex-grow truncate ... font-heading text-md pt-0.5"
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
      ) : (
        <div
          className="flex-grow truncate ... font-heading text-md pt-0.5"
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
      )}
    </>
  );
};

export default OverflowTooltippedLabel;
