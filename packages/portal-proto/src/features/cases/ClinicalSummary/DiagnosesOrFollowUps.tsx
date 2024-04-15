import { HorizontalTable } from "@/components/HorizontalTable";
import VerticalTable from "@/components/Table/VerticalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import type { Diagnoses, FollowUps } from "@gff/core";
import { Tabs, Tooltip, Text } from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";
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
        days_to_last_follow_up: ageDisplay(days_to_last_follow_up),
        days_to_last_known_disease_status: ageDisplay(
          days_to_last_known_disease_status,
        ),
        days_to_recurrence: ageDisplay(days_to_recurrence),
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
        days_to_follow_up: ageDisplay(days_to_follow_up),
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
    const treatmentTableData = diagnoses.treatments
      .slice()
      .sort((a, b) => a.days_to_treatment_start - b.days_to_treatment_start)
      .map((diagnosis) => ({
        id: diagnosis.submitter_id ?? "--",
        uuid: diagnosis.treatment_id ?? "--",
        therapeutic_agents: diagnosis.therapeutic_agents ?? "--",
        treatment_intent_type: diagnosis.treatment_intent_type ?? "--",
        treatment_or_therapy: diagnosis.treatment_or_therapy ?? "--",
        days_to_treatment_start:
          ageDisplay(diagnosis.days_to_treatment_start) ?? "--",
      }));

    const treatmentTableColumnHelper =
      createColumnHelper<typeof treatmentTableData[0]>();

    const treatmentTableColumns = [
      treatmentTableColumnHelper.accessor("id", {
        id: "id",
        header: "ID",
      }),
      treatmentTableColumnHelper.accessor("uuid", {
        id: "uuid",
        header: "UUID",
      }),
      treatmentTableColumnHelper.accessor("therapeutic_agents", {
        id: "therapeutic_agents",
        header: "Therapeutic Agents",
      }),
      treatmentTableColumnHelper.accessor("treatment_intent_type", {
        id: "treatment_intent_type",
        header: "Treatment Intent Type",
      }),
      treatmentTableColumnHelper.accessor("treatment_or_therapy", {
        id: "treatment_or_therapy",
        header: "Treatment or Therapy",
      }),
      treatmentTableColumnHelper.accessor("days_to_treatment_start", {
        id: "days_to_treatment_start",
        header: "Days to Treatment Start",
      }),
    ];
    return {
      data: treatmentTableData,
      columns: treatmentTableColumns,
    };
  };

  const formatMolecularTestsData = (followups: FollowUps) => {
    const molecularTableData = followups.molecular_tests.map((followup) => ({
      id: followup.submitter_id ?? "--",
      uuid: followup.molecular_test_id ?? "--",
      gene_symbol: followup.gene_symbol ?? "--",
      second_gene_symbol: followup.second_gene_symbol ?? "--",
      molecular_analysis_method: followup.molecular_analysis_method ?? "--",
      laboratory_test: followup.laboratory_test ?? "--",
      test_value: followup.test_value ?? "--",
      test_result: followup.test_result ?? "--",
      test_units: followup.test_units ?? "--",
      biospecimen_type: followup.biospecimen_type ?? "--",
      variant_type: followup.variant_type ?? "--",
      chromosome: followup.chromosome ?? "--",
      aa_change: followup.aa_change ?? "--",
      antigen: followup.antigen ?? "--",
      mismatch_repair_mutation: followup.mismatch_repair_mutation ?? "--",
    }));

    const molecularTableColumnHelper =
      createColumnHelper<typeof molecularTableData[0]>();

    const molecularTableColumns = [
      molecularTableColumnHelper.accessor("id", {
        id: "id",
        header: "ID",
      }),
      molecularTableColumnHelper.accessor("uuid", {
        id: "uuid",
        header: "UUID",
      }),
      molecularTableColumnHelper.accessor("gene_symbol", {
        id: "gene_symbol",
        header: "Gene Symbol",
      }),
      molecularTableColumnHelper.accessor("second_gene_symbol", {
        id: "second_gene_symbol",
        header: "Second Gene Symbol",
      }),
      molecularTableColumnHelper.accessor("molecular_analysis_method", {
        id: "molecular_analysis_method",
        header: "Molecular Analysis Method",
      }),
      molecularTableColumnHelper.accessor("laboratory_test", {
        id: "laboratory_test",
        header: "Laboratory Test",
      }),
      molecularTableColumnHelper.accessor("test_value", {
        id: "test_value",
        header: "Test Value",
      }),
      molecularTableColumnHelper.accessor("test_result", {
        id: "test_result",
        header: "Test Result",
      }),
      molecularTableColumnHelper.accessor("test_units", {
        id: "test_units",
        header: "Test Units",
      }),
      molecularTableColumnHelper.accessor("biospecimen_type", {
        id: "biospecimen_type",
        header: "Biospecimen Type",
      }),
      molecularTableColumnHelper.accessor("variant_type", {
        id: "variant_type",
        header: "Variant Type",
      }),
      molecularTableColumnHelper.accessor("chromosome", {
        id: "chromosome",
        header: "Chromosome",
      }),
      molecularTableColumnHelper.accessor("aa_change", {
        id: "aa_change",
        header: "AA Change",
      }),
      molecularTableColumnHelper.accessor("antigen", {
        id: "antigen",
        header: "Antigen",
      }),
      molecularTableColumnHelper.accessor("mismatch_repair_mutation", {
        id: "mismatch_repair_mutation",
        header: "Mismatch Repair Mutation",
      }),
    ];

    return {
      data: molecularTableData,
      columns: molecularTableColumns,
    };
  };

  const InnerComponent = (): JSX.Element => {
    if ("diagnosis_id" in data) {
      if (!data.treatments) {
        return <Text>No Treatments Found.</Text>;
      } else {
        return <VerticalTable {...formatTreatmentData(data)} />;
      }
    } else {
      if (!data.molecular_tests) {
        return <Text>No Molecular Tests Found.</Text>;
      } else {
        return <VerticalTable {...formatMolecularTestsData(data)} />;
      }
    }
  };

  return (
    <>
      <HorizontalTable tableData={formatDataForDiagnosesorFollowUps(data)} />
      <Text className="my-2" size="lg" weight={700}>
        {"diagnosis_id" in data
          ? `Total of ${(data.treatments || []).length} Treatments`
          : `Total of ${(data.molecular_tests || []).length} Molecular Tests`}
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
          variant="default"
          orientation="vertical"
          value={activeTab.toString()}
          onTabChange={onTabChange}
          classNames={{
            tabLabel: "text-sm pr-2 font-medium",
            tabsList: "border-r-0 max-w-[160px]",
          }}
          data-testid="verticalTabs"
        >
          <div className="max-h-[500px] overflow-y-auto overflow-x-hidden min-w-[160px] mr-2">
            <Tabs.List>
              {dataInfo.map((data: Diagnoses | FollowUps, index: number) => (
                <Tabs.Tab
                  value={index.toString()}
                  key={data.submitter_id}
                  className={`my-1 ${
                    activeTab === index
                      ? "bg-primary text-primary-contrast"
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
