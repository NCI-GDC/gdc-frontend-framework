import React, { useState, ComponentType } from "react";
import type { Diagnoses, FollowUps } from "@gff/core";
import { Tabs, Tooltip } from "@mantine/core";

export const TabbedTables = ({
  dataInfo,
  TableElement,
}: {
  readonly dataInfo: ReadonlyArray<Diagnoses> | ReadonlyArray<FollowUps>;
  readonly TableElement: ComponentType<{ data: Diagnoses | FollowUps }>;
}): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);

  const onTabChange = (sValue: string) => {
    const active = parseInt(sValue);
    setActiveTab(active);
  };

  return (
    <>
      {dataInfo.length > 1 ? (
        <Tabs
          variant="pills"
          orientation="vertical"
          value={activeTab.toString()}
          onChange={onTabChange}
          data-testid="verticalTabs"
        >
          <div className="max-h-[500px] overflow-y-auto overflow-x-hidden min-w-[200px] pr-2">
            <Tabs.List>
              {dataInfo.map((data: Diagnoses | FollowUps, index: number) => (
                <Tabs.Tab
                  value={index.toString()}
                  key={data.submitter_id}
                  className={`my-1 ${
                    activeTab === index
                      ? "bg-accent-vivid text-primary-contrast"
                      : "bg-base-lightest text-base-contrast-lightest"
                  }`}
                  data-testid="tab"
                  {...(!data?.submitter_id && {
                    "aria-label": "No follow-up ID available",
                  })}
                >
                  <Tooltip
                    label={data?.submitter_id ?? "No follow-up ID available"}
                    withinPortal={true}
                  >
                    <div>
                      {data?.submitter_id
                        ? `${data?.submitter_id?.substring(0, 13)}...`
                        : "--"}
                    </div>
                  </Tooltip>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </div>

          {dataInfo.map((data: Diagnoses | FollowUps, index: number) => {
            return (
              <Tabs.Panel value={index.toString()} key={data.submitter_id}>
                <TableElement data={data} />
              </Tabs.Panel>
            );
          })}
        </Tabs>
      ) : (
        <TableElement data={dataInfo[0]} />
      )}
    </>
  );
};
