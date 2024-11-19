import React, { useState } from "react";
import { Tabs, Badge, Collapse } from "@mantine/core";
import {
  IoIosArrowDropdownCircle as ExpandIcon,
  IoIosArrowDropupCircle as CollapseIcon,
} from "react-icons/io";
import { createKeyboardAccessibleFunction } from "src/utils";
import { StyledTab } from "@/components/StyledComponents/Tabs";
import { MatchResults } from "./utils";
import MatchedTable from "./MatchedTable";
import UnmatchedTable from "./UnmatchedTable";

interface MatchTablesProps {
  readonly matched: MatchResults[];
  readonly unmatched: string[];
  readonly numberInput: number;
  readonly entityLabel: string;
  readonly fieldDisplay: Record<string, string>;
}

const MatchTablesWrapper: React.FC<MatchTablesProps> = ({
  matched,
  unmatched,
  numberInput,
  entityLabel,
  fieldDisplay,
}: MatchTablesProps) => {
  const [activeTab, setActiveTab] = useState("matched");
  const [showTable, setShowTable] = useState(true);

  const numMatched = numberInput - unmatched.length;

  return (
    <>
      <span
        className="flex items-center font-header font-bold cursor-pointer w-full py-2 px-3 gap-2 mt-4"
        role="button"
        tabIndex={0}
        onClick={() => setShowTable(!showTable)}
        onKeyDown={createKeyboardAccessibleFunction(() =>
          setShowTable(!showTable),
        )}
        aria-expanded={showTable}
      >
        {showTable ? (
          <CollapseIcon size={18} className="text-secondary" />
        ) : (
          <ExpandIcon size={18} className="text-secondary" />
        )}
        Summary Table
      </span>
      <Collapse in={showTable}>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <StyledTab value="matched">
              Matched
              <Badge
                variant="filled"
                color={activeTab === "matched" ? "accent" : "gray"}
                radius="xs"
                size="xs"
                className="ml-1"
              >
                {numMatched?.toLocaleString()}
              </Badge>
            </StyledTab>
            <StyledTab value="unmatched">
              Unmatched
              <Badge
                variant="filled"
                color={activeTab === "unmatched" ? "accent" : "gray"}
                radius="xs"
                size="xs"
                className="ml-1"
              >
                {unmatched.length?.toLocaleString()}
              </Badge>
            </StyledTab>
          </Tabs.List>
          <Tabs.Panel value="matched">
            <MatchedTable
              matched={matched}
              entityLabel={entityLabel}
              numMatched={numMatched}
              fieldDisplay={fieldDisplay}
            />
          </Tabs.Panel>
          <Tabs.Panel value="unmatched">
            <UnmatchedTable unmatched={unmatched} entityLabel={entityLabel} />
          </Tabs.Panel>
        </Tabs>
      </Collapse>
    </>
  );
};

export default MatchTablesWrapper;
