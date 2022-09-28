import { HorizontalTable } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import {
  Exposures,
  FamilyHistories,
} from "@gff/core/dist/features/cases/types";
import { Tabs, Tooltip } from "@mantine/core";
import { useState } from "react";
import { humanify } from "src/utils";

export const FamilyHistoryOrExposure = ({
  dataInfo,
}: {
  readonly dataInfo: ReadonlyArray<FamilyHistories> | ReadonlyArray<Exposures>;
}): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);

  const onTabChange = (sValue: string) => {
    const active = parseInt(sValue);
    setActiveTab(active);
  };

  const formatDataForFamilyHistoriesorExposures = (
    data: FamilyHistories | Exposures,
  ) => {
    let tableData: Record<string, any>;

    if ("family_history_id" in data) {
      const {
        submitter_id: family_history_id,
        family_history_id: family_history_uuid,
        relationship_age_at_diagnosis,
        relationship_gender,
        relationship_primary_diagnosis,
        relationship_type,
        relative_with_cancer_history,
      } = data;

      tableData = {
        family_history_id,
        family_history_uuid,
        relationship_age_at_diagnosis,
        relationship_gender,
        relationship_primary_diagnosis,
        relationship_type,
        relative_with_cancer_history,
      };
    } else {
      const {
        submitter_id: exposure_id,
        exposure_id: exposure_uuid,
        alcohol_history,
        alcohol_intensity,
        tobacco_smoking_status,
        pack_years_smoked,
      } = data;

      tableData = {
        exposure_id,
        exposure_uuid,
        alcohol_history,
        alcohol_intensity,
        tobacco_smoking_status,
        pack_years_smoked,
      };
    }
    const headersConfig = Object.keys(tableData).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));
    return formatDataForHorizontalTable(tableData, headersConfig);
  };
  return (
    <>
      {dataInfo.length > 1 ? (
        <Tabs
          variant="pills"
          orientation="vertical"
          defaultValue="gallery"
          value={activeTab.toString()}
          onTabChange={onTabChange}
          classNames={{
            tabsList: "mr-5 overflow-y-auto",
            tabLabel: "text-sm px-2 font-medium",
          }}
          styles={(theme) => ({
            tab: {
              backgroundColor: theme.white,
              color: theme.colors.gray[9],
              border: `2px solid ${theme.colors.gray[4]}`,
              fontSize: theme.fontSizes.sm,
              padding: `1em 1em`,
              borderRadius: theme.radius.md,
            },
          })}
        >
          <Tabs.List>
            {dataInfo.map(
              (data: FamilyHistories | Exposures, index: number) => (
                <Tabs.Tab
                  value={index.toString()}
                  key={
                    "family_history_id" in data
                      ? data.family_history_id
                      : data.exposure_id
                  }
                >
                  <Tooltip
                    label={
                      "family_history_id" in data
                        ? data.family_history_id
                        : data.exposure_id
                    }
                    withinPortal={true}
                  >
                    <div>{`${("family_history_id" in data
                      ? data.family_history_id
                      : data.exposure_id
                    ).substring(0, 13)}...`}</div>
                  </Tooltip>
                </Tabs.Tab>
              ),
            )}
          </Tabs.List>
          {dataInfo.map((data: FamilyHistories | Exposures, index: number) => {
            return (
              <Tabs.Panel
                value={index.toString()}
                key={
                  "family_history_id" in data
                    ? data.family_history_id
                    : data.exposure_id
                }
              >
                <HorizontalTable
                  tableData={formatDataForFamilyHistoriesorExposures(data)}
                />
              </Tabs.Panel>
            );
          })}
        </Tabs>
      ) : (
        <HorizontalTable
          tableData={formatDataForFamilyHistoriesorExposures(dataInfo[0])}
        />
      )}
    </>
  );
};
