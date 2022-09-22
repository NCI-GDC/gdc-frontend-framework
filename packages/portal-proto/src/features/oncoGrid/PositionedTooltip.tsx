import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Tooltip as MTooltip } from "@mantine/core";

interface TooltipProps {
  readonly content: JSX.Element;
}

const PositionedTooltip: React.FC<TooltipProps> = ({
  content,
}: TooltipProps) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const eventListener = (event) => {
      setX(event.pageX);
      setY(event.pageY);
    };

    window.addEventListener("mousemove", eventListener);

    return () => window.removeEventListener("mousemove", eventListener);
  }, []);

  return content
    ? createPortal(
        <div style={{ left: x, top: y, position: "absolute", zIndex: 100 }}>
          <MTooltip
            label={content}
            color={"gray"}
            opened={content !== null}
            withArrow
            withinPortal={false}
            position={"top"}
            positionDependencies={[x, y]}
          >
            <div></div>
          </MTooltip>
        </div>,
        document.querySelector("[data-reactroot]"),
      )
    : null;
};

export default PositionedTooltip;
