import React, { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import {
  MdChevronRight as NextPage,
  MdChevronLeft as PrevPage,
  MdDoubleArrow as PagePlus,
} from "react-icons/md";

interface PageStepperProps {
  page: number;
  totalPages: number;
  handlePage: (page: number) => any;
}

const PageStepper: React.FC<PageStepperProps> = ({
  page,
  totalPages,
  handlePage,
}: PageStepperProps) => {
  const [stepView, setStepView] = useState([1, 2, 3, 4, 5]);

  const rotateS = useSpring({
    transform: `rotateY(180deg)`,
  });

  useEffect(() => {
    page > 2
      ? setStepView([page - 1, page, page + 1, page + 2, page + 3])
      : setStepView([1, 2, 3, 4, 5]);
  }, [page, totalPages]);

  return (
    <div className={`flex flex-row w-max m-auto`}>
      <animated.button
        disabled={page === 0}
        onClick={() => handlePage(0)}
        style={rotateS}
        className={`my-auto ml-0 mr-1 text-xs ${
          page === 0 ? `` : "hover:text-sm"
        }`}
      >
        <PagePlus />
      </animated.button>
      <button
        disabled={page === 0}
        onClick={() => handlePage(page - 1)}
        className={`my-auto ml-1 mr-1 font-bold text-xs ${
          page === 0 ? `` : "hover:text-sm"
        }`}
      >
        <PrevPage />
      </button>
      {stepView.map((step, key) => {
        return (
          (totalPages > 0 ? step < totalPages + 1 : true) &&
          (totalPages === 0 ? true : step < totalPages + 1) && (
            <button
              key={key}
              onClick={() => handlePage(step - 1)}
              disabled={page === step - 1}
              className={`mx-1 my-auto text-xs ${
                page === step - 1 ? `text-sm font-bold` : `hover:text-sm`
              } p-1`}
            >
              {step}
            </button>
          )
        );
      })}
      <button
        disabled={page === totalPages - 1}
        onClick={() => handlePage(page + 1)}
        className={`ml-1 my-auto mr-2 font-bold text-xs ${
          page === totalPages - 1 ? `` : `hover:text-sm`
        }`}
      >
        <NextPage />
      </button>
      <button
        disabled={page === totalPages - 1}
        onClick={() => handlePage(totalPages - 1)}
        className={`my-auto mr-0 text-xs ${
          page === totalPages - 1 ? `` : `hover:text-sm`
        }`}
      >
        <PagePlus />
      </button>
    </div>
  );
};

export default PageStepper;
