import { useEffect, useRef, useCallback } from "react";

export const useSynchronizedRowHeights = (tableIds: string[]) => {
  const tablesRef = useRef<(HTMLTableElement | null)[]>([]);

  const synchronizeRowHeights = useCallback(() => {
    const tables = tablesRef.current.filter(
      (table): table is HTMLTableElement => table !== null,
    );

    const rowsPerTable = tables.map((table) =>
      Array.from(table.querySelectorAll("tr")),
    );

    // i added this after our call to sort of reset it to auto before calcuating the height
    // this has made the situation better but still during a certain resize it still doesn't feel right
    rowsPerTable.forEach((rows) => {
      rows.forEach((row) => {
        row.style.height = "auto";
      });
    });

    if (tables.length === 0 || tables.length !== tableIds.length) return;
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
  }, [tableIds]);

  useEffect(() => {
    synchronizeRowHeights();
    window.addEventListener("resize", synchronizeRowHeights);
    return () => {
      window.removeEventListener("resize", synchronizeRowHeights);
    };
  }, [synchronizeRowHeights]);

  return (index: number) => (el: HTMLTableElement | null) => {
    tablesRef.current[index] = el;
    synchronizeRowHeights(); // why do we need to call here?
  };
};
