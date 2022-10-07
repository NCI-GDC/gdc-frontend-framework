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

  //todo: update the stepview if offset goes out of current stepview range
  const handleSteps = () => {
    // () => {
    //     if (totalPages < 5) {
    //         return Array.from({ length: totalPages }, (_, i) => i + 1)
    //     } else {
    //         if (offset > stepView[stepView.length - 1]) {
    //             return Array.from({ length: offset + 5 }, (_, i) => i + 1)
    //         } else if ((offset < stepView[0])) {
    //             return Array.from({ length: offset - 5 }, (_, i) => i + 1)
    //         } else  {
    //             return Array.from({ length:  }, (_, i) => i + 1)
    //         }
    //     }
    // }
    if (offset === 0) {
      console.log("offset 0");
    } else {
      console.log("offsetchanged", offset);
    }
  };

  useEffect(() => {
    handleSteps();
  }, [offset]);

  return (
    <div className={`flex flex-row w-max m-auto`}>
      <animated.button
        onClick={() => handleOffset(0)}
        style={rotateS}
        className={`my-auto ml-0 mr-2`}
      >
        <PagePlus />
      </animated.button>
      <button
        disabled={offset === 0}
        onClick={() => handleOffset(offset - 1)}
        className={`my-auto ml-2 mr-2 font-bold`}
      >
        <PrevPage size={"20px"} />
      </button>
      {stepView.map((step) => {
        return (
          <button
            onClick={() => handleOffset(step - 1)}
            disabled={offset === step - 1}
            className={`mx-2 text-sm ${
              offset === step - 1 ? "font-bold" : ""
            } p-2`}
          >
            {step}
          </button>
        );
      })}
      {!(offset + 1 in stepView) && (
        <button
          onClick={() => handleOffset(offset)}
          className={`mx-2 text-sm font-bold p-2`}
        >
          {offset + 1}
        </button>
      )}
      <button
        disabled={offset === totalPages}
        onClick={() => handleOffset(offset + 1)}
        className={`ml-2 my-auto mr-4 font-bold`}
      >
        <NextPage size={"20px"} />
      </button>
      <button
        onClick={() => handleOffset(totalPages)}
        className={`my-auto mr-0`}
      >
        <PagePlus />
      </button>
    </div>
  );
};

export default PageStepper;
