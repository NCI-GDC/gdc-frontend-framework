import React, { useState, useMemo } from "react";
import { flatten, uniq, upperFirst } from "lodash";
import { Tabs, Badge, Collapse } from "@mantine/core";
import {
  IoIosArrowDropdownCircle as ExpandIcon,
  IoIosArrowDropupCircle as CollapseIcon,
} from "react-icons/io";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { tabStyles } from "./constants";
import { createKeyboardAccessibleFunction } from "src/utils";
import useStandardPagination from "@/hooks/useStandardPagination";

interface MatchTablesProps {
  readonly matched: {
    mappedTo: { field: string; value: string }[];
    givenIdentifiers: { field: string; value: string }[];
  }[];
  readonly unmatched: string[];
  readonly identifier: string;
  readonly fieldDisplay: Record<string, string>;
}

const MatchTables: React.FC<MatchTablesProps> = ({
  matched,
  unmatched,
  identifier,
  fieldDisplay,
}: MatchTablesProps) => {
  const [activeTab, setActiveTab] = useState("matched");
  const [showTable, setShowTable] = useState(true);

  const matchedColumns = useMemo(() => {
    const uniqueMappedToFields = uniq(
      flatten(matched.map((m) => m.mappedTo.map((v) => v.field))),
    );
    const uniqueGivenIdentifierFields = uniq(
      flatten(matched.map((m) => m.givenIdentifiers.map((v) => v.field))),
    );

    return [
      {
        columnName: "Mapped To",
        id: "mapped_to",
        visible: true,
        columns: uniqueMappedToFields.map((f) => ({
          columnName: fieldDisplay[f],
          id: `mapped_${f.replaceAll(".", "_")}`,
          visible: true,
        })),
      },
      {
        columnName: `Submitted ${upperFirst(identifier)} Identifier`,
        id: "submitted_id",
        visible: true,
        columns: uniqueGivenIdentifierFields.map((f) => ({
          columnName: fieldDisplay[f],
          id: `given_${f.replaceAll(".", "_")}`,
          visible: true,
        })),
      },
    ];
  }, [matched, fieldDisplay, identifier]);

  const matchedTableData = useMemo(() => {
    return matched.map((d) => ({
      ...Object.fromEntries(
        d.mappedTo.map((v) => [
          `mapped_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
      ...Object.fromEntries(
        d.givenIdentifiers.map((v) => [
          `given_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
    }));
  }, [matched]);

  const { displayedData: displayedMatchData, ...matchPaginationProps } =
    useStandardPagination(matchedTableData);
  const { displayedData: displayedUnmatchedData, ...unmatchedPaginationProps } =
    useStandardPagination(unmatched.map((id) => ({ id })));

  const numMatched = flatten(matched.map((d) => d.givenIdentifiers)).length;

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
              <p className="text-sm">
                {numMatched} submitted {identifier} identifier
                {numMatched !== 1 && "s"} mapped to {matched.length} unique GDC{" "}
                {identifier}
                {matched.length !== 1 && "s"}{" "}
              </p>
              {matched.length > 0 && (
                <VerticalTable
                  tableData={displayedMatchData}
                  columns={matchedColumns}
                  selectableRow={false}
                  showControls={false}
                  pagination={matchPaginationProps}
                />
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="unmatched">
            <div className="m-4">
              <p className="text-sm">
                {unmatched.length} submitted {identifier} identifier
                {unmatched.length !== 1 && "s"} not recognized
              </p>
              {unmatched.length > 0 && (
                <VerticalTable
                  tableData={displayedUnmatchedData}
                  columns={[
                    {
                      columnName: "Submitted Identifier",
                      id: "id",
                      visible: true,
                    },
                  ]}
                  selectableRow={false}
                  showControls={false}
                  pagination={unmatchedPaginationProps}
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
