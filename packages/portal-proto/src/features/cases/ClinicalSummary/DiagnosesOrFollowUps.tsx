import { HorizontalTable } from "@/components/HorizontalTable";
import { TempTable } from "@/features/files/FileView";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import type { Diagnoses, FollowUps } from "@gff/core/dist/features/cases/types";
import { Tabs, Tooltip, Text } from "@mantine/core";
import { useState } from "react";
import { ageDisplay, humanify } from "src/utils";

const TableElement = ({
  data,
}: {
  data: Diagnoses | FollowUps;
}): JSX.Element => {
  const formatDataForDiagnosesorFollowUps = (data: Diagnoses | FollowUps) => {
    let tableData: Record<string, any>;

    if ("diagnosis_id" in data) {
      const {
        submitter_id: diagnosis_id,
        diagnosis_id: diagnosis_uuid,
        classification_of_tumor,
        age_at_diagnosis,
        days_to_last_follow_up,
        days_to_last_known_disease_status,
        days_to_recurrence,
        last_known_disease_status,
        morphology,
        primary_diagnosis,
        prior_malignancy,
        synchronous_malignancy,
        progression_or_recurrence,
        site_of_resection_or_biopsy,
        tissue_or_organ_of_origin,
        tumor_grade,
      } = data;

      tableData = {
        diagnosis_id,
        diagnosis_uuid,
        classification_of_tumor,
        age_at_diagnosis: ageDisplay(age_at_diagnosis),
        days_to_last_follow_up,
        days_to_last_known_disease_status,
        days_to_recurrence,
        last_known_disease_status,
        morphology,
        primary_diagnosis,
        prior_malignancy,
        synchronous_malignancy,
        progression_or_recurrence,
        site_of_resection_or_biopsy,
        tissue_or_organ_of_origin,
        tumor_grade,
      };
    } else {
      const {
        submitter_id: follow_up_id,
        follow_up_id: follow_up_uuid,
        days_to_follow_up,
        comorbidity,
        risk_factor,
        progression_or_recurrence_type,
        progression_or_recurrence,
        disease_response,
        bmi,
        height,
        weight,
        ecog_performance_status,
        karnofsky_performance_status,
        progression_or_recurrence_anatomic_site,
        reflux_treatment_type,
      } = data;

      tableData = {
        follow_up_id,
        follow_up_uuid,
        days_to_follow_up,
        comorbidity,
        risk_factor,
        progression_or_recurrence_type,
        progression_or_recurrence,
        disease_response,
        bmi,
        height,
        weight,
        ecog_performance_status,
        karnofsky_performance_status,
        progression_or_recurrence_anatomic_site,
        reflux_treatment_type,
      };
    }
    const headersConfig = Object.keys(tableData).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));
    return formatDataForHorizontalTable(tableData, headersConfig);
  };

  const formatTreatmentData = (diagnoses: Diagnoses) => {
    const rows = diagnoses.treatments
      .slice()
      .sort((a, b) => a.days_to_treatment_start - b.days_to_treatment_start)
      .map((diagnosis) => ({
        id: diagnosis.submitter_id || "--",
        uuid: diagnosis.treatment_id || "--",
        therapeutic_agents: diagnosis.therapeutic_agents || "--",
        treatment_intent_type: diagnosis.treatment_intent_type || "--",
        treatment_or_therapy: diagnosis.treatment_or_therapy || "--",
        days_to_treatment_start: diagnosis.days_to_treatment_start || "--",
      }));

    return {
      headers: [
        "ID",
        "UUID",
        "Therapeutic Agents",
        "Treatment Intent Type",
        "Treatment or Therapy",
        "Days to Treatment Start",
      ],
      tableRows: rows,
    };
  };

  const formatMolecularTestsData = (followups: FollowUps) => {
    const rows = followups.molecular_tests.map((followup) => ({
      id: followup.submitter_id || "--",
      uuid: followup.molecular_test_id || "--",
      gene_symbol: followup.gene_symbol || "--",
      second_gene_symbol: followup.second_gene_symbol || "--",
      molecular_analysis_method: followup.molecular_analysis_method || "--",
      laboratory_test: followup.laboratory_test || "--",
      test_value: followup.test_value || "--",
      test_result: followup.test_result || "--",
      test_units: followup.test_units || "--",
      biospecimen_type: followup.biospecimen_type || "--",
      variant_type: followup.variant_type || "--",
      chromosome: followup.chromosome || "--",
      aa_change: followup.aa_change || "--",
      antigen: followup.antigen || "--",
      mismatch_repair_mutation: followup.mismatch_repair_mutation || "--",
    }));

    return {
      headers: [
        "ID",
        "UUID",
        "Gene Symbol",
        "Second Gene Symbol",
        "Molecular Analysis Method",
        "Laboratory Test",
        "Test Value",
        "Test Result",
        "Test Units",
        "Biospecimen Type",
        "Variant Type",
        "Chromosome",
        "AA Change",
        "Antigen",
        "Mismatch Repair Mutation",
      ],
      tableRows: rows,
    };
  };

  const InnerComponent = (): JSX.Element => {
    if ("diagnosis_id" in data) {
      if (!data.treatments) {
        return <Text>No Treatments Found.</Text>;
      } else {
        return <TempTable tableData={formatTreatmentData(data)} />;
      }
    } else {
      if (!data.molecular_tests) {
        return <Text>No Molecular Tests Found.</Text>;
      } else {
        return <TempTable tableData={formatMolecularTestsData(data)} />;
      }
    }
  };

  return (
    <>
      <HorizontalTable tableData={formatDataForDiagnosesorFollowUps(data)} />
      <Text className="my-2" size="lg" weight={700}>
        {"diagnosis_id" in data
          ? `Total of (${data.treatments?.length || 0}) Treatments`
          : `Total of (${data.molecular_tests?.length || 0}) Molecular Tests`}
      </Text>

      <InnerComponent />
    </>
  );
};

export const DiagnosesOrFollowUps = ({
  dataInfo,
}: {
  readonly dataInfo: ReadonlyArray<Diagnoses> | ReadonlyArray<FollowUps>;
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
          defaultValue="gallery"
          value={activeTab.toString()}
          onTabChange={onTabChange}
          classNames={{
            tabsList: "mr-5",
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
            {dataInfo.map((data: Diagnoses | FollowUps, index: number) => (
              <Tabs.Tab
                value={index.toString()}
                key={
                  "diagnosis_id" in data ? data.diagnosis_id : data.follow_up_id
                }
              >
                <Tooltip
                  label={
                    "diagnosis_id" in data
                      ? data.diagnosis_id
                      : data.follow_up_id
                  }
                  withinPortal={true}
                >
                  <div>{`${("diagnosis_id" in data
                    ? data.diagnosis_id
                    : data.follow_up_id
                  ).substring(0, 13)}...`}</div>
                </Tooltip>
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {dataInfo.map((data: Diagnoses | FollowUps, index: number) => {
            return (
              <Tabs.Panel
                value={index.toString()}
                key={
                  "diagnosis_id" in data ? data.diagnosis_id : data.follow_up_id
                }
              >
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
