import React, { useEffect, useState } from "react";
import { animated, useSpring, config } from "react-spring";
import { MdOutlineArrowDropDown } from "react-icons/md";

interface PageSizeProps {
  pageSize: number;
  handlePageSize: (pageSize: number) => any;
}

const PageSize: React.FC<PageSizeProps> = ({
  pageSize,
  handlePageSize,
}: PageSizeProps) => {
  const [offsetMenu, setOffsetMenu] = useState(false);
  const [hovered, setHovered] = useState(pageSize);

  const { y } = useSpring({
    y: offsetMenu ? 0 : 180,
  });

  const flipSpring = { transform: y.to((y) => `rotateX(${y}deg)`) };

  const menuSpring = useSpring({
    transform: offsetMenu ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
    opacity: offsetMenu ? 1 : 0,
  });
  const pg = useSpring({
    from: { number: 0 },
    to: { number: hovered },
    immediate: true,
  });

  useEffect(() => {
    setOffsetMenu(hovered === pageSize ? false : true);
  }, [hovered]);

  return (
    <button
      className={`h-8 rounded border border-activeColor`}
      onClick={() => setOffsetMenu((m) => !m)}
    >
      <div className={`flex flex-row w-12 justify-between`}>
        <animated.div className={`m-auto text-xs mr-0.5 text-activeColor`}>
          {offsetMenu ? pg.number.to((x) => x.toFixed(0)) : pageSize}
        </animated.div>
        <animated.div className={`m-auto ml-0.5`} style={flipSpring}>
          <MdOutlineArrowDropDown />
        </animated.div>
      </div>
      <animated.div className={`absolute z-10 bg-white`} style={menuSpring}>
        {offsetMenu && (
          <div className={`text-center`}>
            <ul
              className={`list-none w-12 rounded-b-md text-activeColor border border-1 border-activeColor`}
            >
              {[10, 20, 40, 100]
                .filter((pg) => pg !== pageSize)
                .map((pg) => {
                  return (
                    <li
                      key={`page-size-option-${pg}`}
                      onClick={() => handlePageSize(pg)}
                      onMouseEnter={() => setHovered(pg)}
                      onMouseLeave={() => setHovered(pageSize)}
                      className={`py-1 px-2 text-sm hover:bg-hoverColor border-t-0`}
                    >
                      {pg}
                    </li>
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
