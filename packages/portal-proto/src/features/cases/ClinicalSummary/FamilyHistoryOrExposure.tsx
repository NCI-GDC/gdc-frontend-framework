import { HorizontalTable } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import { Exposures, FamilyHistories } from "@gff/core";
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
          value={activeTab.toString()}
          onChange={onTabChange}
          data-testid="verticalTabs"
        >
          <div className="max-h-[500px] overflow-y-auto overflow-x-hidden min-w-[160px] mr-2">
            <Tabs.List>
              {dataInfo.map(
                (data: FamilyHistories | Exposures, index: number) => (
                  <Tabs.Tab
                    value={index.toString()}
                    key={data.submitter_id}
                    className={`my-1 ${
                      activeTab === index
                        ? "bg-primary text-primary-contrast"
                        : "bg-base-lightest text-base-contrast-lightest"
                    }`}
                    data-testid="tab"
                  >
                    <Tooltip label={data.submitter_id} withinPortal={true}>
                      <div>{`${data.submitter_id.substring(0, 13)}...`}</div>
                    </Tooltip>
                  </Tabs.Tab>
                ),
              )}
            </Tabs.List>
          </div>
          {dataInfo.map((data: FamilyHistories | Exposures, index: number) => {
            return (
              <Tabs.Panel value={index.toString()} key={data.submitter_id}>
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
