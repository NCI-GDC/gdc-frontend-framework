import React from "react";
import { animated, useSpring } from "@react-spring/web";

interface TablePlaceholderProps {
  cellWidth: string;
  rowHeight: number;
  numOfRows: number;
  numOfColumns: number;
  content: React.ReactNode;
}

export const TablePlaceholder: React.FC<TablePlaceholderProps> = ({
  cellWidth,
  rowHeight,
  numOfRows,
  numOfColumns,
  content,
}: TablePlaceholderProps) => {
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
      className={`flex flex-row h-max w-max py-4`}
    >
      <div className={`mr-0 m-auto`}>
        <table>
          <thead className={`border-2 shadow-md w-[90%`}></thead>
          <tbody>
            {Array.from({ length: numOfRows }, (_, i) => i).map((n, nIdx) => {
              return (
                <animated.tr
                  key={`loader-row-${nIdx}`}
                  // linter wrong
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  style={useRowSpring(nIdx)}
                  className={`h-[${rowHeight}px] ${n === 0 ? "hidden" : ""} ${
                    n === 1 ? `border-2 shadow-md` : ``
                  } ${
                    n === 9 ? `border-2 border-b-2 shadow-md border-t-0` : ``
                  } ${n > 1 && n % 2 === 0 ? `bg-slate-100` : `bg-white`} ${
                    n > 1 ? `border-l-2 border-r-2 border-t-0 border-b-0` : ``
                  }`}
                >
                  {Array.from({ length: numOfColumns }, (_, i) => i).map(
                    (m, mIdx) => {
                      return (
                        <td
                          key={`loader-cell-${nIdx}${mIdx}`}
                          className={cellWidth}
                        >
                          {n === 4 && m === 7 && (
                            <div className={`absolute mx-auto mt-12`}>
                              {content}
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

export default TablePlaceholder;
