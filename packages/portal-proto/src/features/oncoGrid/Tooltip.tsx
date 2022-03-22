import ReactDOM from "react-dom";
import { useEffect, useState, useRef } from "react";
import { throttle } from "lodash";

const Tooltip = ({ content }) => {
  const tooltipRef = useRef(null);
  //const [x, setX] = useState(0);
  // Using refs instead of state because we don't want to trigger rerenders
  const x = useRef(0);
  const y = useRef(0);
  //const [y, setY] = useState(0);
  const transform = useRef(null);

  useEffect(() => {
    window.addEventListener("mousemove", eventListener);

    return () => window.removeEventListener("mousemove", eventListener);
  }, []);

  const eventListener = throttle((event) => {
    let tempX =
      event.pageX - tooltipRef.current.getBoundingClientRect().width / 2;
    let tempY =
      event.pageY - tooltipRef.current.getBoundingClientRect().height - 10;
    let tempTransform;

    if (tooltipRef.current.getBoundingClientRect().left < 0) {
      tempTransform = `translate(${
        tooltipRef.current.getBoundingClientRect().width / 2
      }px, 0)`;
    }

    if (tooltipRef.current.getBoundingClientRect().right >= window.innerWidth) {
      tempTransform = `translate(-${
        tooltipRef.current.getBoundingClientRect().width / 2
      }px, 0)`;
    }

    if (tooltipRef.current.getBoundingClientRect().top < 0) {
      tempTransform = `translate(0, ${
        tooltipRef.current.getBoundingClientRect().height / 2
      }px)`;
    }

    if (
      tooltipRef.current.getBoundingClientRect().bottom > window.innerHeight
    ) {
      tempTransform = `translate(0, -${
        tooltipRef.current.getBoundingClientRect().height / 2
      }px)`;
    }

    //setX(tempX);
    //setY(tempY);
    y.current = tempY;
    x.current = tempX;
    transform.current = tempTransform;
  }, 16);

  return ReactDOM.createPortal(
    <div
      className="inline-block absolute bg-white rounded-lg shadow-sm text-sm"
      style={{ left: x.current, top: y.current, transform: transform.current }}
      ref={(ref) => (tooltipRef.current = ref)}
    >
      {content}
    </div>,
    document.body,
  );
};

export default Tooltip;
