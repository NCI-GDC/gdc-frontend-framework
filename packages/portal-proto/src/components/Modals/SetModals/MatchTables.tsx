import React, { useState, useMemo } from "react";
import { flatten, uniq, upperFirst } from "lodash";
import { Tabs, Badge } from "@mantine/core";
import { VerticalTable } from "@/features/shared/VerticalTable";
import { tabStyles } from "./constants";

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
  }, [matched]);

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

  const numMatched = flatten(matched.map((d) => d.givenIdentifiers)).length;

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab} classNames={tabStyles}>
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
        <div className="my-4">
          <p className="text-sm">
            {numMatched} submitted {identifier} identifier
            {numMatched !== 1 && "s"} mapped to {matched.length} unique GDC{" "}
            {identifier}
            {matched.length !== 1 && "s"}{" "}
          </p>
          <VerticalTable
            tableData={matchedTableData}
            columns={matchedColumns}
            selectableRow={false}
            showControls={false}
          />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="unmatched">
        <div className="my-4">
          <p className="text-sm">
            {unmatched.length} submitted {identifier} identifier
            {unmatched.length !== 1 && "s"} not recognized
          </p>
          <VerticalTable
            tableData={unmatched.map((id) => ({ id }))}
            columns={[
              { columnName: "Submitted Identifier", id: "id", visible: true },
            ]}
            selectableRow={false}
            showControls={false}
          />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default MatchTables;
