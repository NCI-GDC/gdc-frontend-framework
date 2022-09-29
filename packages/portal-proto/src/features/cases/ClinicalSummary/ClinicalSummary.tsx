import { HorizontalTable } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import {
  Demographic,
  Diagnoses,
  Exposures,
  FamilyHistories,
  FollowUps,
} from "@gff/core/dist/features/cases/types";
import { Button, Menu, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { MdFileDownload as DownloadIcon } from "react-icons/md";
import { humanify } from "src/utils";
import { DiagnosesOrFollowUps } from "./DiagnosesOrFollowUps";
import { FamilyHistoryOrExposure } from "./FamilyHistoryOrExposure";

export const ClinicalSummary = ({
  demographic,
  diagnoses,
  family_histories,
  exposures,
  follow_ups,
}: {
  readonly demographic: Demographic;
  readonly diagnoses: ReadonlyArray<Diagnoses>;
  readonly family_histories: ReadonlyArray<FamilyHistories>;
  readonly exposures: ReadonlyArray<Exposures>;
  readonly follow_ups: ReadonlyArray<FollowUps>;
}): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string | null>("demographic");

  const formatDataForDemographics = () => {
    const {
      submitter_id: demographic_id,
      demographic_id: demographic_uuid,
      ethnicity,
      gender,
      race,
      days_to_birth,
      days_to_death,
      vital_status,
    } = demographic;

    const demographicData: Record<string, any> = {
      demographic_id,
      demographic_uuid,
      ethnicity,
      gender,
      race,
      days_to_birth: days_to_birth.toLocaleString(),
      days_to_death: days_to_death.toLocaleString(),
      vital_status,
    };

    const headersConfig = Object.keys(demographicData).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(demographicData, headersConfig);
  };

  const totalTreatmentNodes = diagnoses.reduce(
    (prev, curr) => prev + (curr.treatments || []).length,
    0,
  );

  const totalMolecularTestNodes = follow_ups.reduce(
    (prev, curr) => prev + (curr.molecular_tests || []).length,
    0,
  );

  return (
    <div className="flex flex-col gap-2 mt-5 max-w-full">
      <div className="flex justify-between">
        <Text size="xl" weight={500}>
          Clinical
        </Text>
        <Menu width="target">
          <Menu.Target>
            <Button className="px-1.5 min-h-7 w-28 border-base-lightest border rounded text-primary-content-lightest bg-primary hover:bg-primary-darker">
              <DownloadIcon size="1.25em" />
              Download
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<DownloadIcon size="1.25em" />}>TSV</Menu.Item>
            <Menu.Item icon={<DownloadIcon size="1.25em" />}>JSON</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div>
        <Tabs
          variant="pills"
          defaultValue="gallery"
          value={activeTab}
          onTabChange={setActiveTab}
          keepMounted={false}
          classNames={{
            root: "w-full",
            panel: "max-w-full overflow-x-auto",
          }}
          styles={(theme) => ({
            tab: {
              border: `2px solid ${theme.colors.gray[4]}`,
            },
          })}
        >
          <Tabs.List>
            <Tabs.Tab value="demographic" aria-label="Demographic">
              Demographic
            </Tabs.Tab>
            <Tabs.Tab value="diagnoses" aria-label="Diagnoses and Treatments`">
              {` Diagnoses (${diagnoses.length}) > Treatments (${totalTreatmentNodes})`}
            </Tabs.Tab>
            <Tabs.Tab value="family" aria-label="Family Histories">
              {`Family Histories (${family_histories.length})`}
            </Tabs.Tab>
            <Tabs.Tab value="exposures" aria-label="Exposures">
              {`Exposures (${exposures.length})`}
            </Tabs.Tab>
            <Tabs.Tab value="followups" aria-label="Follow Ups">
              {`Follow-Ups (${follow_ups.length}) > Molecular Tests (${totalMolecularTestNodes})`}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="demographic" pt="xs">
            {demographic ? (
              <HorizontalTable tableData={formatDataForDemographics()} />
            ) : (
              <Text className="p-5 bg-base-contrast" weight="bold">
                No Demographic Found.
              </Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="diagnoses" pt="xs">
            {diagnoses.length === 0 ? (
              <Text className="p-5 bg-base-contrast" weight="bold">
                No Diagnoses Found.
              </Text>
            ) : (
              <DiagnosesOrFollowUps dataInfo={diagnoses} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="family" pt="xs">
            {family_histories.length === 0 ? (
              <Text className="p-5 bg-base-contrast" weight="bold">
                No Family Histories Found.
              </Text>
            ) : (
              <FamilyHistoryOrExposure dataInfo={family_histories} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="exposures" pt="xs">
            {exposures.length === 0 ? (
              <Text className="p-5 bg-base-contrast" weight="bold">
                No Exposures Found.
              </Text>
            ) : (
              <FamilyHistoryOrExposure dataInfo={exposures} />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="followups" pt="xs">
            {follow_ups.length === 0 ? (
              <Text className="p-5 bg-base-contrast" weight="bold">
                No Follow Ups Found.
              </Text>
            ) : (
              <DiagnosesOrFollowUps
                dataInfo={
                  follow_ups.length > 1
                    ? follow_ups
                        .slice()
                        .sort(
                          (a, b) => a.days_to_follow_up - b.days_to_follow_up,
                        )
                    : follow_ups
                }
              />
            )}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};
