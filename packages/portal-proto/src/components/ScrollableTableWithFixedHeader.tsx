/* Courtesy of https://github.com/mantinedev/ui.mantine.dev/blob/master/components/TableScrollArea/TableScrollArea.tsx */
import { useState } from "react";
import { createStyles, Table, ScrollArea } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colors.gray[8],
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colors.gray[2]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface ScrollableTableWithFixedHeaderProps {
  readonly tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
}

export function ScrollableTableWithFixedHeader({
  tableData,
}: ScrollableTableWithFixedHeaderProps): JSX.Element {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  return (
    <ScrollArea
      sx={{ height: 500 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      data-testid="scrolltable"
    >
      <Table striped sx={{ minWidth: 700 }}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            {tableData.headers.map((text, index) => (
              <th key={index} className="bg-nci-gray-lighter">
                {text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.tableRows.map((row, index) => (
            <tr
              key={index}
              className={index % 2 ? "bg-white" : "bg-gdc-blue-warm-lightest"}
            >
              {Object.values(row).map((item, index) => (
                <td key={index} className="text-sm p-1 pl-2.5">
                  {typeof item === "undefined" ? "--" : item}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
