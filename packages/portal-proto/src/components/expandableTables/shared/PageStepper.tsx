import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import {
  MdChevronRight as NextPage,
  MdChevronLeft as PrevPage,
  MdDoubleArrow as PagePlus,
} from "react-icons/md";

interface PageStepperProps {
  offset: number;
  totalPages: number;
  handleOffset: (offset: number) => any;
}

const PageStepper: React.FC<PageStepperProps> = ({
  offset,
  totalPages,
  handleOffset,
}: PageStepperProps) => {
  const [stepView, setStepView] = useState([1, 2, 3, 4, 5]);

  const rotateS = useSpring({
    transform: `rotateY(180deg)`,
  });

  useEffect(() => {
    offset > 2
      ? setStepView([offset - 1, offset, offset + 1, offset + 2, offset + 3])
      : setStepView([1, 2, 3, 4, 5]);
  }, [offset, totalPages]);

  return (
    <div className={`flex flex-row w-max m-auto`}>
      <animated.button
        disabled={offset === 0}
        onClick={() => handleOffset(0)}
        style={rotateS}
        className={`my-auto ml-0 mr-1 text-xs ${
          offset === 0 ? "" : "hover:text-sm"
        }`}
      >
        <PagePlus />
      </animated.button>
      <button
        disabled={offset === 0}
        onClick={() => handleOffset(offset - 1)}
        className={`my-auto ml-1 mr-1 font-bold text-xs ${
          offset === 0 ? "" : "hover:text-sm"
        }`}
      >
        <PrevPage />
      </button>
      {stepView.map((step) => {
        return (
          step < totalPages + 1 && (
            <button
              onClick={() => handleOffset(step - 1)}
              disabled={offset === step - 1}
              className={`mx-1 my-auto text-xs ${
                offset === step - 1 ? "text-sm font-bold" : "hover:text-sm"
              } p-1`}
            >
              {step}
            </button>
          )
        );
      })}
      <button
        disabled={offset === totalPages - 1}
        onClick={() => handleOffset(offset + 1)}
        className={`ml-1 my-auto mr-2 font-bold text-xs ${
          offset === totalPages - 1 ? `` : `hover:text-sm`
        }`}
      >
        <NextPage />
      </button>
      <button
        disabled={offset === totalPages - 1}
        onClick={() => handleOffset(totalPages - 1)}
        className={`my-auto mr-0 text-xs ${
          offset === totalPages - 1 ? `` : `hover:text-sm`
        }`}
      >
        <PagePlus />
      </button>
    </div>
  );
};

export default PageStepper;
