import { useEffect, useRef } from "react";

export const useSynchronizedRowHeights = (tableIds: string[]) => {
  const tablesRef = useRef<(HTMLTableElement | null)[]>([]);

  const synchronizeRowHeights = () => {
    const tables = tablesRef.current.filter(
      (table): table is HTMLTableElement => table !== null,
    );

    if (tables.length === 0 || tables.length !== tableIds.length) return;

    const rowsPerTable = tables.map((table) =>
      Array.from(table.querySelectorAll("tr")),
    );
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
  };

  useEffect(() => {
    synchronizeRowHeights();
    window.addEventListener("resize", synchronizeRowHeights);
    return () => {
      window.removeEventListener("resize", synchronizeRowHeights);
    };
  }, []);

  return (index: number) => (el: HTMLTableElement | null) => {
    tablesRef.current[index] = el;
    synchronizeRowHeights();
  };
};
