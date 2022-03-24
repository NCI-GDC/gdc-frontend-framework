import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
  readonly content: JSX.Element;
}

const Tooltip: React.FC<TooltipProps> = ({ content }: TooltipProps) => {
  const tooltipRef = useRef(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [arrowPosition, setArrowPosition] = useState("bottom");

  useEffect(() => {
    const eventListener = (event) => {
      let tempX = event.pageX - 18;
      let tempY =
        event.pageY -
        (tooltipRef.current?.getBoundingClientRect().height || 0) -
        15;
      let tempArrowPosition = "bottom";

      // Reposition if tooltip would be cutoff
      if (
        event.pageX + (tooltipRef.current?.getBoundingClientRect().width || 0) >
        window.innerWidth
      ) {
        tempX =
          event.pageX -
          (tooltipRef.current?.getBoundingClientRect().width || 0) -
          15;
        tempY = event.pageY - 18;
        tempArrowPosition = "right";
      }

      setX(tempX);
      setY(tempY);
      setArrowPosition(tempArrowPosition);
    };

    window.addEventListener("mousemove", eventListener);

    return () => window.removeEventListener("mousemove", eventListener);
  }, []);

  return ReactDOM.createPortal(
    content ? (
      <div
        className={`inline-block bg-white rounded-lg shadow-sm text-sm border-2 border-nci-gray-light tooltip-arrow-${arrowPosition}`}
        style={{ left: x, top: y, position: "absolute" }}
        ref={(ref) => (tooltipRef.current = ref)}
      >
        {content}
      </div>
    ) : null,
    document.body,
  );
};

export default Tooltip;
