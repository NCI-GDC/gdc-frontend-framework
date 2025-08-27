import { useEffect, useCallback, MutableRefObject } from "react";

/**
 * Hook to synchronize the heights of corresponding rows across multiple tables.
 * This ensures that rows in different tables align vertically based on the tallest row in each set.
 *
 * Note: This hook is currently only supported for the HorizontalTable component in our codebase.
 * @param tableRefs - An array of refs to the table elements whose rows need to be synchronized.
 *
 * Usage:
 * 1. Create refs for each table using `useRef<HTMLTableElement>(null)`.
 * 2. Pass an array of these refs to this hook.
 * 3. Pass refs as props to Horizontal table
 *
 * Example:
 * const table1Ref = useRef<HTMLTableElement>(null);
 * const table2Ref = useRef<HTMLTableElement>(null);
 * useSynchronizedRowHeights([table1Ref, table2Ref]);
 */
export const useSynchronizedRowHeights = (
  tableRefs: MutableRefObject<HTMLTableElement>[],
) => {
  const synchronizeRowHeights = useCallback(() => {
    const validTableRefs = tableRefs.filter((ref) => ref.current !== null);

    if (validTableRefs.length === 0) {
      return;
    }

    const rowsPerTable = tableRefs?.map((table) =>
      Array.from(table?.current?.querySelectorAll("tr") ?? []),
    );

    if (rowsPerTable.length === 0) return;

    rowsPerTable.forEach((rows) => {
      rows.forEach((row) => {
        row.style.height = "auto";
      });
    });

    // max rows between two tables
    const maxRows = Math.max(...rowsPerTable.map((rows) => rows.length));
    for (let i = 0; i < maxRows; i++) {
      const rowHeights = rowsPerTable.map((rows) => rows[i]?.offsetHeight || 0);
      const maxHeight = Math.max(...rowHeights);
      rowsPerTable.forEach((rows) => {
        if (rows[i]) {
          rows[i].style.height = `${maxHeight}px`;
        }
      });
    }
  }, [tableRefs]);

  useEffect(() => {
    synchronizeRowHeights();
    window.addEventListener("resize", synchronizeRowHeights);
    return () => {
      window.removeEventListener("resize", synchronizeRowHeights);
    };
  }, [synchronizeRowHeights]);
};
