import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import { HeaderTitle } from "@/features/shared/tailwindComponents";
import {
  Demographic,
  Diagnoses,
  Exposures,
  FamilyHistories,
  FollowUps,
} from "@gff/core/dist/features/cases/types";
import { Divider, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { FiDownload as DownloadIcon } from "react-icons/fi";
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
      days_to_birth: days_to_birth?.toLocaleString(),
      days_to_death: days_to_death?.toLocaleString(),
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

  const CountComponent = ({ count }: { count: number }) => (
    <span className="h-[11px] w-4 bg-accent-vivid text-base-lightest text-xs font-medium px-1.5 py-0.5 ml-1 rounded-sm">
      {count}
    </span>
  );

  return (
    <div className="max-w-full">
      <div className="mb-2">
        <HeaderTitle>Clinical</HeaderTitle>
      </div>
      <DropdownWithIcon
        dropdownElements={[
          {
            title: "TSV (Coming soon)",
            icon: <DownloadIcon size={16} aria-label="download icon" />,
          },
          {
            title: "JSON (Coming soon)",
            icon: <DownloadIcon size={16} aria-label="download icon" />,
          },
        ]}
        TargetButtonChildren="Download"
        LeftIcon={<DownloadIcon size="1rem" aria-label="download icon" />}
      />

      <Tabs
        variant="pills"
        defaultValue="gallery"
        value={activeTab}
        onTabChange={setActiveTab}
        keepMounted={false}
        classNames={{
          root: "w-full",
          tabsList: "mt-2 border-1 border-base-lighter border-b-3 p-2",
          panel: "max-w-full overflow-x-auto pt-0",
          tab: "text-secondary-contrast-lighter font-bold font-content text-sm px-4 py-1 mr-2 data-active:bg-nci-cyan-lightest data-active:border-2 data-active:border-primary data-active:text-primary",
        }}
        styles={(theme) => ({
          tab: {
            border: `2px solid ${theme.colors.gray[2]}`,
          },
        })}
      >
        <Tabs.List>
          <Tabs.Tab
            value="demographic"
            aria-label="Demographic"
            data-testid="demographicTab"
          >
            Demographic
          </Tabs.Tab>
          <Tabs.Tab
            value="diagnoses"
            aria-label="Diagnoses and Treatments`"
            data-testid="diagnosisTab"
          >
            <span className="flex gap-2">
              <span>
                Diagnoses
                <CountComponent count={diagnoses.length} />
              </span>
              <Divider orientation="vertical" />
              <span>
                Treatments
                <CountComponent count={totalTreatmentNodes} />
              </span>
            </span>
          </Tabs.Tab>
          <Tabs.Tab
            value="family"
            aria-label="Family Histories"
            data-testid="familyTab"
          >
            <span>
              Family Histories
              <CountComponent count={family_histories.length} />
            </span>
          </Tabs.Tab>
          <Tabs.Tab
            value="exposures"
            aria-label="Exposures"
            data-testid="exposuresTab"
          >
            <span>
              Exposures
              <CountComponent count={exposures.length} />
            </span>
          </Tabs.Tab>
          <Tabs.Tab
            value="followups"
            aria-label="Follow Ups"
            data-testid="followUpsTab"
          >
            <span className="flex gap-2">
              <span>
                Follow-Ups
                <CountComponent count={follow_ups.length} />
              </span>
              <Divider orientation="vertical" />
              <span>
                Molecular Tests
                <CountComponent count={totalMolecularTestNodes} />
              </span>
            </span>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="demographic" pt="xs">
          {Object.keys(demographic).length > 0 ? (
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
                      .sort((a, b) => a.days_to_follow_up - b.days_to_follow_up)
                  : follow_ups
              }
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
