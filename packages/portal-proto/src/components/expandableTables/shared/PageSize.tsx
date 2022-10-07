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

  const buttonSpring = useSpring({
    background: "white",
    border: "solid 0.5px rgb(32, 68, 97)",
  });
  const colorSpring = useSpring({
    color: "rgb(32, 68, 97)",
  });

  const { y } = useSpring({
    y: offsetMenu ? 0 : 180,
  });

  const flipSpring = { transform: y.to((y) => `rotateX(${y}deg)`) };

  const borderSpring = useSpring({
    border: "solid 0.5px rgb(32, 68, 97)",
  });

  const menuSpring = useSpring({
    transform: offsetMenu ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
    opacity: offsetMenu ? 1 : 0,
  });
  const pg = useSpring({
    from: { number: pageSize },
    to: { number: hovered },
  });

  useEffect(() => {
    setOffsetMenu(hovered === pageSize ? false : true);
  }, [hovered]);

  return (
    <animated.button
      className={`h-8 rounded`}
      style={buttonSpring}
      onClick={() => setOffsetMenu((m) => !m)}
    >
      <div className={`flex flex-row w-12 justify-between`}>
        <animated.div style={colorSpring} className={`m-auto text-xs mr-0.5`}>
          {offsetMenu ? pg.number.to((x) => x.toFixed(0)) : pageSize}
        </animated.div>
        <animated.div className={`m-auto ml-0.5`} style={flipSpring}>
          <MdOutlineArrowDropDown />
        </animated.div>
      </div>
      <animated.div className={`z-10 bg-white`} style={menuSpring}>
        {offsetMenu && (
          <div className={`text-center`}>
            <animated.ul
              style={{ ...colorSpring, ...borderSpring }}
              className={`list-none w-12 rounded-b-md`}
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
            </animated.ul>
          </div>
        )}
      </animated.div>
    </animated.button>
  );
};

export default PageSize;
