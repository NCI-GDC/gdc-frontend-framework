import { useEffect, useCallback, MutableRefObject } from "react";

export const useSynchronizedRowHeights = (
  tableRefs: MutableRefObject<HTMLTableElement>[],
) => {
  const synchronizeRowHeights = useCallback(() => {
    if (
      tableRefs === undefined ||
      tableRefs.length === 0 ||
      tableRefs.some((t) => t.current === null)
    ) {
      return;
    }

    const rowsPerTable = tableRefs.map((table) =>
      Array.from(table.current?.querySelectorAll("tr")),
    );

    // i added this after our call to sort of reset it to auto before calcuating the height
    // this has made the situation better but still during a certain resize it still doesn't feel right
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
