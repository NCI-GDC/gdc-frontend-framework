import React, { useState, useMemo } from "react";
import { flatten, uniq, upperFirst } from "lodash";
import { Tabs, Badge, Collapse } from "@mantine/core";
import {
  IoIosArrowDropdownCircle as ExpandIcon,
  IoIosArrowDropupCircle as CollapseIcon,
} from "react-icons/io";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import { createKeyboardAccessibleFunction } from "src/utils";
import useStandardPagination from "@/hooks/useStandardPagination";
import { tabStyles } from "./styles";

interface MatchTablesProps {
  readonly matched: {
    mappedTo: { field: string; value: string }[];
    givenIdentifiers: { field: string; value: string }[];
  }[];
  readonly unmatched: string[];
  readonly numberInput: number;
  readonly setTypeLabel: string;
  readonly fieldDisplay: Record<string, string>;
}

const MatchTables: React.FC<MatchTablesProps> = ({
  matched,
  unmatched,
  numberInput,
  setTypeLabel,
  fieldDisplay,
}: MatchTablesProps) => {
  const [activeTab, setActiveTab] = useState("matched");
  const [showTable, setShowTable] = useState(true);

  const uniqueMappedToFields = useMemo(
    () => uniq(flatten(matched.map((m) => m.mappedTo.map((v) => v.field)))),
    [matched],
  );
  const uniqueGivenIdentifierFields = useMemo(
    () =>
      uniq(flatten(matched.map((m) => m.givenIdentifiers.map((v) => v.field)))),
    [matched],
  );

  const matchedColumns = useMemo(() => {
    return [
      {
        columnName: "Mapped To",
        id: "mapped_to",
        visible: true,
        disableSortBy: true,
        columns: uniqueMappedToFields.map((id) => ({
          columnName: fieldDisplay[id],
          id: `mapped_${id.replaceAll(".", "_")}`,
          visible: true,
        })),
      },
      {
        columnName: `Submitted ${upperFirst(setTypeLabel)} Identifier`,
        id: "submitted_id",
        visible: true,
        disableSortBy: true,
        columns: uniqueGivenIdentifierFields.map((id) => ({
          columnName: fieldDisplay[id],
          id: `given_${id.replaceAll(".", "_")}`,
          visible: true,
        })),
      },
    ];
  }, [
    fieldDisplay,
    setTypeLabel,
    uniqueMappedToFields,
    uniqueGivenIdentifierFields,
  ]);

  const matchedTableData = useMemo(() => {
    return matched.map((d) => ({
      ...Object.fromEntries(
        uniqueMappedToFields.map((id) => [
          `mapped_${id.replaceAll(".", "_")}`,
          "--",
        ]),
      ),
      ...Object.fromEntries(
        d.mappedTo.map((v) => [
          `mapped_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
      ...Object.fromEntries(
        uniqueGivenIdentifierFields.map((id) => [
          `given_${id.replaceAll(".", "_")}`,
          "--",
        ]),
      ),
      ...Object.fromEntries(
        d.givenIdentifiers.map((v) => [
          `given_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
    }));
  }, [matched, uniqueMappedToFields, uniqueGivenIdentifierFields]);

  const unmatchedTableData = useMemo(
    () => unmatched.map((id) => ({ id })),
    [unmatched],
  );

  const {
    displayedData: displayedMatchData,
    handlePageChange: handleMatchedPageChange,
    handlePageSizeChange: handleMatchedPageSizeChange,
    ...matchPaginationProps
  } = useStandardPagination(matchedTableData);
  const {
    displayedData: displayedUnmatchedData,
    handlePageChange: handleUnmatchedPageChange,
    handlePageSizeChange: handleUnmatchedPageSizeChange,
    ...unmatchedPaginationProps
  } = useStandardPagination(unmatchedTableData);

  const handleMatchedTableChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handleMatchedPageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handleMatchedPageChange(obj.newPageNumber);
        break;
    }
  };
  const handleUnmatchedTableChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handleUnmatchedPageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handleUnmatchedPageChange(obj.newPageNumber);
        break;
    }
  };

  const numMatched = numberInput - unmatched.length;

  return (
    <>
      <span
        className="flex items-center font-header font-bold cursor-pointer w-full bg-primary-lightest py-2 px-3 gap-2 mt-4"
        role="button"
        tabIndex={0}
        onClick={() => setShowTable(!showTable)}
        onKeyDown={createKeyboardAccessibleFunction(() =>
          setShowTable(!showTable),
        )}
        aria-expanded={showTable}
      >
        {showTable ? (
          <CollapseIcon size={18} className="text-primary-darkest" />
        ) : (
          <ExpandIcon size={18} className="text-primary-darkest" />
        )}
        Summary Table
      </span>
      <Collapse in={showTable}>
        <Tabs
          value={activeTab}
          onTabChange={setActiveTab}
          classNames={tabStyles}
        >
          <Tabs.List>
            <Tabs.Tab value="matched">
              Matched
              <Badge
                variant="filled"
                color={activeTab === "matched" ? "primary.9" : "gray"}
                radius="xs"
                size="xs"
                className="ml-1"
              >
                {numMatched}
              </Badge>
            </Tabs.Tab>
            <Tabs.Tab value="unmatched">
              Unmatched
              <Badge
                variant="filled"
                color={activeTab === "unmatched" ? "primary.9" : "gray"}
                radius="xs"
                size="xs"
                className="ml-1"
              >
                {unmatched.length}
              </Badge>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="matched">
            <div className="m-4">
              <p className="text-sm mb-2">
                {numMatched} submitted {setTypeLabel} identifier
                {numMatched !== 1 && "s"} mapped to {matched.length} unique GDC{" "}
                {setTypeLabel}
                {matched.length !== 1 && "s"}{" "}
              </p>
              {matched.length > 0 && (
                <VerticalTable
                  tableData={displayedMatchData}
                  columns={matchedColumns}
                  selectableRow={false}
                  showControls={false}
                  pagination={{
                    ...matchPaginationProps,
                    label: `${setTypeLabel}s`,
                  }}
                  handleChange={handleMatchedTableChange}
                  columnSorting={"enable"}
                />
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="unmatched">
            <div className="m-4">
              <p className="text-sm mb-2">
                {unmatched.length} submitted {setTypeLabel} identifier
                {unmatched.length !== 1 && "s"} not recognized
              </p>
              {unmatched.length > 0 && (
                <VerticalTable
                  tableData={displayedUnmatchedData}
                  columns={[
                    {
                      columnName: `Submitted ${upperFirst(
                        setTypeLabel,
                      )} Identifier`,
                      id: "id",
                      visible: true,
                    },
                  ]}
                  selectableRow={false}
                  showControls={false}
                  pagination={{
                    ...unmatchedPaginationProps,
                    label: `${setTypeLabel}s`,
                  }}
                  handleChange={handleUnmatchedTableChange}
                  columnSorting={"enable"}
                />
              )}
            </div>
          </Tabs.Panel>
        </Tabs>
      </Collapse>
    </>
  );
};

export default MatchTables;
