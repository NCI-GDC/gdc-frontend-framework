import { useEffect, useState, useRef } from "react";
import { Tooltip as MTooltip } from "@mantine/core";

interface TooltipProps {
  readonly content: JSX.Element;
}

const Tooltip: React.FC<TooltipProps> = ({ content }: TooltipProps) => {
  const tooltipRef = useRef(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [position, setPosition] = useState<"top" | "right">("top");

  useEffect(() => {
    const eventListener = (event) => {
      let tempPosition: "top" | "right" = "top";

      // Reposition if tooltip would be cutoff
      if (
        event.pageX + (tooltipRef.current?.getBoundingClientRect().width || 0) >
        window.innerWidth
      ) {
        tempPosition = "right";
      }

      setX(event.pageX);
      setY(event.pageY);
      setPosition(tempPosition);
    };

    window.addEventListener("mousemove", eventListener);

    return () => window.removeEventListener("mousemove", eventListener);
  }, []);

  return content ? (
    <MTooltip
      label={content}
      color={"gray"}
      style={{ left: x, top: y, position: "absolute" }}
      tooltipRef={(ref) => (tooltipRef.current = ref)}
      opened={content !== null}
      withArrow
      withinPortal={false}
      positionDependencies={[x, y]}
      position={position}
      classNames={{
        body: "bg-white shadow-md",
      }}
    >
      <></>
    </MTooltip>
  ) : null;
};

export default Tooltip;
