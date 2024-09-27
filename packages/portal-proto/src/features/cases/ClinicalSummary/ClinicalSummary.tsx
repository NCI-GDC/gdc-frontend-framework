import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import { HeaderTitle } from "@/components/tailwindComponents";
import {
  Demographic,
  Diagnoses,
  Exposures,
  FamilyHistories,
  FollowUps,
  useCoreDispatch,
} from "@gff/core";
import { Divider, Loader, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { humanify, ageDisplay } from "src/utils";
import { FamilyHistoryOrExposure } from "./FamilyHistoryOrExposure";
import download from "@/utils/download";
import { TabbedTables } from "./TabbedTables";
import DiagnosesTables from "./DiagnosesTables";
import FollowUpTables from "./FollowUpTables";

export const ClinicalSummary = ({
  demographic,
  diagnoses,
  family_histories,
  exposures,
  follow_ups,
  case_id,
  project_id,
  submitter_id,
}: {
  readonly demographic: Demographic;
  readonly diagnoses: ReadonlyArray<Diagnoses>;
  readonly family_histories: ReadonlyArray<FamilyHistories>;
  readonly exposures: ReadonlyArray<Exposures>;
  readonly follow_ups: ReadonlyArray<FollowUps>;
  readonly case_id: string;
  readonly project_id: string;
  readonly submitter_id: string;
}): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string | null>("demographic");
  const [clinicalDownloadActive, setClinicalDownloadActive] = useState(false);
  const dispatch = useCoreDispatch();

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
      days_to_birth: ageDisplay(days_to_birth),
      days_to_death: ageDisplay(days_to_death),
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

  const totalOtherClinicalAttributesNodes = follow_ups.reduce(
    (prev, curr) => prev + (curr.other_clinical_attributes || []).length,
    0,
  );

  const CountComponent = ({ count }: { count: number }) => (
    <span className="h-[11px] w-4 bg-accent-vivid text-base-lightest text-xs font-medium px-1.5 py-0.5 ml-1 rounded-sm">
      {count}
    </span>
  );

  const handleClinicalTSVDownload = () => {
    setClinicalDownloadActive(true);
    download({
      endpoint: "clinical_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `clinical.case-${submitter_id}-${project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.tar.gz`,
        filters: {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [case_id],
          },
        },
      },
      done: () => setClinicalDownloadActive(false),
    });
  };

  const handleClinicalJSONDownload = () => {
    setClinicalDownloadActive(true);
    download({
      endpoint: "clinical_tar",
      method: "POST",
      dispatch,
      params: {
        format: "JSON",
        pretty: true,
        filename: `clinical.case-${submitter_id}-${project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        filters: {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [case_id],
          },
        },
      },
      done: () => setClinicalDownloadActive(false),
    });
  };

  return (
    <div className="max-w-full">
      <div className="mb-2">
        <HeaderTitle>Clinical</HeaderTitle>
      </div>
      <DropdownWithIcon
        dropdownElements={[
          {
            title: "TSV",
            icon: <DownloadIcon size={16} aria-label="download" />,
            onClick: handleClinicalTSVDownload,
          },
          {
            title: "JSON",
            icon: <DownloadIcon size={16} aria-label="download" />,
            onClick: handleClinicalJSONDownload,
          },
        ]}
        TargetButtonChildren={
          clinicalDownloadActive ? "Processing" : "Download"
        }
        LeftSection={
          clinicalDownloadActive ? (
            <Loader size={20} />
          ) : (
            <DownloadIcon size="1rem" aria-label="download" />
          )
        }
      />

      <Tabs
        variant="pills"
        defaultValue="gallery"
        value={activeTab}
        onChange={setActiveTab}
        keepMounted={false}
        classNames={{
          root: "w-full",
          list: "mt-2 border-1 border-base-lighter border-b-3 p-2",
          panel: "max-w-full overflow-x-auto pt-0 pb-2",
          tab: "text-secondary-contrast-lighter font-bold font-heading text-sm px-4 py-1 mr-2 data-active:bg-nci-cyan-lightest data-active:border-2 data-active:border-primary data-active:text-primary",
        }}
        styles={(theme) => ({
          tab: {
            border: `2px solid ${theme.colors.gray[2]}`,
          },
        })}
      >
        <Tabs.List>
          <Tabs.Tab value="demographic" data-testid="button-demographic-tab">
            Demographic
          </Tabs.Tab>
          <Tabs.Tab
            value="diagnoses"
            data-testid="button-diagnoses-treatments-tab"
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
          <Tabs.Tab value="family" data-testid="button-family-histories-tab">
            <span>
              Family Histories
              <CountComponent count={family_histories.length} />
            </span>
          </Tabs.Tab>
          <Tabs.Tab value="exposures" data-testid="button-exposures-tab">
            <span>
              Exposures
              <CountComponent count={exposures.length} />
            </span>
          </Tabs.Tab>
          <Tabs.Tab
            value="followups"
            data-testid="button-followups-molecular-tests-tab"
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
              <Divider orientation="vertical" />
              <span>
                Other Clinical Attributes
                <CountComponent count={totalOtherClinicalAttributesNodes} />
              </span>
            </span>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="demographic" pt="xs">
          {Object.keys(demographic).length > 0 ? (
            <HorizontalTable tableData={formatDataForDemographics()} />
          ) : (
            <Text className="p-5 font-content text-secondary-contrast-lighter">
              No Demographic Found.
            </Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="diagnoses" pt="xs">
          {diagnoses.length === 0 ? (
            <Text className="p-5 font-content text-secondary-contrast-lighter">
              No Diagnoses Found.
            </Text>
          ) : (
            <TabbedTables dataInfo={diagnoses} TableElement={DiagnosesTables} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="family" pt="xs">
          {family_histories.length === 0 ? (
            <Text className="p-5 font-content text-secondary-contrast-lighter">
              No Family Histories Found.
            </Text>
          ) : (
            <FamilyHistoryOrExposure dataInfo={family_histories} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="exposures" pt="xs">
          {exposures.length === 0 ? (
            <Text className="p-5 font-content">No Exposures Found.</Text>
          ) : (
            <FamilyHistoryOrExposure dataInfo={exposures} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="followups" pt="xs">
          {follow_ups.length === 0 ? (
            <Text className="p-5 font-content text-secondary-contrast-lighter">
              No Follow Ups Found.
            </Text>
          ) : (
            <TabbedTables
              dataInfo={
                follow_ups.length > 1
                  ? follow_ups
                      .slice()
                      .sort((a, b) => a.days_to_follow_up - b.days_to_follow_up)
                  : follow_ups
              }
              TableElement={FollowUpTables}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
