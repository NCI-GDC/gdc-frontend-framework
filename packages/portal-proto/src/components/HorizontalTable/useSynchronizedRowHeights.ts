import { useEffect, useRef, useState } from "react";

export const useSynchronizedRowHeights = (tableIds: string[]) => {
  const tablesRef = useRef<(HTMLTableElement | null)[]>([]);
  const [, forceUpdate] = useState({});

  const synchronizeRowHeights = () => {
    const tables = tablesRef.current.filter(
      (table): table is HTMLTableElement => table !== null,
    );

    if (tables.length !== tableIds.length) return;

    const rowsPerTable = tables.map((table) =>
      Array.from(table.querySelectorAll("tr")),
    );
    const maxRows = Math.max(...rowsPerTable.map((rows) => rows.length));

    // Reset all row heights to auto first
    rowsPerTable.forEach((rows) => {
      rows.forEach((row) => {
        row.style.height = "auto";
      });
    });

    // Delay the height calculation slightly to ensure the browser has updated the layout

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
    const handleResize = () => {
      synchronizeRowHeights();
    };

    // Initial synchronization
    synchronizeRowHeights();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Force a re-render after a short delay to ensure proper initial synchronization
  useEffect(() => {
    const timer = setTimeout(() => forceUpdate({}), 100);
    return () => clearTimeout(timer);
  }, []);

  return (index: number) => (el: HTMLTableElement | null) => {
    tablesRef.current[index] = el;
    synchronizeRowHeights();
  };
};
