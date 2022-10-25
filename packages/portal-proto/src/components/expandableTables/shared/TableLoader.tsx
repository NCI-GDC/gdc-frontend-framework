import React from "react";
import { Loader } from "@mantine/core";
import { animated, useSpring } from "react-spring";

interface TableLoaderProps {
  cellWidth: string;
  rowHeight: number;
}

export const TableLoader: React.FC<TableLoaderProps> = ({
  cellWidth,
  rowHeight,
}: TableLoaderProps) => {
  const tableSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });
  const useRowSpring = (index: number) => {
    const rowSpring = useSpring({
      from: { opacity: 0, height: rowHeight / 2 },
      to: { opacity: 1, height: rowHeight },
      delay: index * 10,
    });
    return rowSpring;
  };
  return (
    <animated.div
      style={tableSpring}
      className={`flex flex-row h-screen w-max`}
    >
      <div className={`mr-0 m-auto`}>
        <table>
          <thead className={`border border-2 shadow-md w-10/12`}></thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, nIdx) => {
              return (
                <animated.tr
                  key={`loader-row-${nIdx}`}
                  // this isn't conventional react hook
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  style={useRowSpring(nIdx)}
                  className={`h-[${rowHeight}px] ${n === 0 ? "hidden" : ""} ${
                    n === 1 ? `border border-2 shadow-md` : ``
                  } ${
                    n === 9
                      ? `border border-2 border-b-2 shadow-md border-t-0`
                      : ``
                  } ${n > 1 && n % 2 === 0 ? `bg-slate-100` : `bg-white`} ${
                    n > 1 ? `border-l-2 border-r-2 border-t-0 border-b-0` : ``
                  }`}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                    (m, mIdx) => {
                      return (
                        <td
                          key={`loader-cell-${nIdx}${mIdx}`}
                          className={cellWidth}
                        >
                          {n === 4 && m === 7 && (
                            <div className={`absolute mx-auto mt-12`}>
                              <Loader />
                            </div>
                          )}
                        </td>
                      );
                    },
                  )}
                </animated.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </animated.div>
  );
};

export default TableLoader;
