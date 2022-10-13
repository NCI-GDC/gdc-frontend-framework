import React from "react";
import { Loader } from "@mantine/core";

interface TableLoaderProps {
  cellWidth: string;
  rowHeight: string;
}

export const TableLoader: React.FC<TableLoaderProps> = ({
  cellWidth,
  rowHeight,
}: TableLoaderProps) => {
  return (
    <div className={`flex flex-row h-screen w-max`}>
      <div className={`mr-0 m-auto`}>
        <table>
          <thead className={`border border-2 shadow-md w-10/12`}></thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
              return (
                <tr
                  className={`${rowHeight} ${
                    n === 1 || n === 9 ? `border border-2 shadow-md` : ``
                  } ${n > 0 && n % 2 === 0 ? `bg-slate-200` : `bg-white`}`}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                    (m) => {
                      return (
                        <td className={`${cellWidth}`}>
                          {n === 4 && m === 7 && (
                            <div className={`absolute mx-auto mt-12`}>
                              <Loader />
                            </div>
                          )}
                        </td>
                      );
                    },
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLoader;
