import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
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
      let tempX = event.pageX;
      let tempY = event.pageY;
      let tempPosition : "top" | "right" = "top";

      // Reposition if tooltip would be cutoff
      if (
        event.pageX + (tooltipRef.current?.getBoundingClientRect().width || 0) >
        window.innerWidth
      ) { 
        tempPosition = "right";
      }

      setX(tempX);
      setY(tempY);
      setPosition(tempPosition);
    };

    window.addEventListener("mousemove", eventListener);

    return () => window.removeEventListener("mousemove", eventListener);
  }, []);

  return ReactDOM.createPortal(
    content ? (
      <MTooltip
        label={content}  
        color={"gray"}
        style={{ left: x, top: y, position: "absolute" }}
        tooltipRef={(ref) => (tooltipRef.current = ref)}
        opened={content !== null}
        withinPortal
        withArrow
        positionDependencies={[x, y]}
        position={position}
      >
        <></>
      </MTooltip>
    ) : null,
    document.body,
  );
};

export default Tooltip;
