import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { PageSizeProps } from "@/components/expandableTables/shared/types";

const PageSize: React.FC<PageSizeProps> = ({
  pageSize,
  handlePageSize,
}: PageSizeProps) => {
  const [offsetMenu, setOffsetMenu] = useState(false);
  const [hovered, setHovered] = useState(pageSize);
  const tablePageSizeOptions = [10, 20, 40, 100] as number[];
  const toggleDegreeOfRotation = offsetMenu ? 0 : 180;
  const { y } = useSpring({
    y: toggleDegreeOfRotation,
  });
  const flipSpring = { transform: y.to((y) => `rotateX(${y}deg)`) };
  const menuSpring = useSpring({
    transform: offsetMenu ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
    opacity: offsetMenu ? 1 : 0,
  });
  const pageSpring = useSpring({
    from: { number: 0 },
    to: { number: hovered },
    immediate: true,
  });

  useEffect(() => {
    setOffsetMenu(hovered === pageSize ? false : true);
  }, [hovered, pageSize]);

  return (
    <button
      className={`h-8 rounded border border-activeColor`}
      onClick={() => setOffsetMenu((m) => !m)}
    >
      <div className={`flex flex-row w-12 justify-between`}>
        <animated.div className={`m-auto text-xs mr-0.5 text-activeColor`}>
          {offsetMenu ? pageSpring.number.to((x) => x.toFixed(0)) : pageSize}
        </animated.div>
        <animated.div className={`m-auto ml-0.5`} style={flipSpring}>
          <MdOutlineArrowDropDown />
        </animated.div>
      </div>
      <animated.div className={`absolute z-10 bg-white`} style={menuSpring}>
        {offsetMenu && (
          <div className={`text-center`}>
            <ul
              className={`list-none w-12 text-activeColor border border-1 border-activeColor`}
            >
              {tablePageSizeOptions
                .filter((page) => page !== pageSize)
                .map((page) => {
                  return (
                    <button
                      key={`page-size-option-${page}`}
                      onClick={() => handlePageSize(page)}
                      onMouseEnter={() => setHovered(page)}
                      onMouseLeave={() => setHovered(pageSize)}
                      className={`py-1 px-2 text-sm border-t-0 hover:bg-hoverColor w-10`}
                    >
                      {page}
                    </button>
                  );
                })}
            </ul>
          </div>
        )}
      </animated.div>
    </button>
  );
};

export default PageSize;
