import { createColumnHelper } from "@tanstack/react-table";
import { Badge, Text } from "@mantine/core";
import type { Diagnoses } from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import VerticalTable from "@/components/Table/VerticalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import { ageDisplay, humanify } from "src/utils";

const DiagnosesTables = ({ data }: { data: Diagnoses }): JSX.Element => {
  const formatDataForDiagnoses = (data: Diagnoses) => {
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

    const tableData = {
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
        days_to_treatment_start: ageDisplay(diagnosis.days_to_treatment_start),
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

  return (
    <>
      <HorizontalTable tableData={formatDataForDiagnoses(data)} />
      <div
        className="w-full flex flex-row items-center gap-1 bg-nci-violet-lightest p-2 border-base-lighter border-1 border-t-0"
        data-testid="treatment-table-header"
      >
        <h3 className="mx-2 font-montserrat text-xl text-primary-content-darkest">
          Treatments
        </h3>
        <Badge className="bg-accent-vivid px-1" radius="xs">
          {(data.treatments || []).length}
        </Badge>
      </div>

      {!data.treatments ? (
        <div className="border-base-lighter border-1 border-t-0 p-4">
          <Text>No Treatments Found.</Text>
        </div>
      ) : (
        <VerticalTable {...formatTreatmentData(data)} />
      )}
    </>
  );
};

export default DiagnosesTables;
