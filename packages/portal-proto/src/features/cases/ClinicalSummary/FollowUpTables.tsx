import { Badge, Text } from "@mantine/core";
import { createColumnHelper } from "@tanstack/react-table";
import type { FollowUps } from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import VerticalTable from "@/components/Table/VerticalTable";
import { formatDataForHorizontalTable } from "@/features/files/utils";
import { ageDisplay, humanify } from "src/utils";

const FollowUpTables = ({ data }: { data: FollowUps }): JSX.Element => {
  const formatDataForDiagnosesorFollowUps = (data: FollowUps) => {
    const {
      submitter_id: follow_up_id,
      follow_up_id: follow_up_uuid,
      days_to_follow_up,
      progression_or_recurrence_type,
      progression_or_recurrence,
      disease_response,
      ecog_performance_status,
      karnofsky_performance_status,
      progression_or_recurrence_anatomic_site,
    } = data;

    const tableData = {
      follow_up_id,
      follow_up_uuid,
      days_to_follow_up: ageDisplay(days_to_follow_up),
      progression_or_recurrence_type,
      progression_or_recurrence,
      disease_response,
      ecog_performance_status,
      karnofsky_performance_status,
      progression_or_recurrence_anatomic_site,
    };

    const headersConfig = Object.keys(tableData).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));
    return formatDataForHorizontalTable(tableData, headersConfig);
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

  const formatOtherClinicalAttributes = (followups: FollowUps) => {
    const data = followups.other_clinical_attributes.map((oca) => ({
      id: oca.submitter_id ?? "--",
      uuid: oca.other_clinical_attribute_id ?? "--",
      timepoint_category: oca.timepoint_category ?? "--",
      nononcologic_therapeutic_agents:
        oca.nononcologic_therapeutic_agents ?? "--",
      treatment_frequency: oca.treatment_frequency ?? "--",
      weight: oca.weight ?? "--",
      height: oca.height ?? "--",
      bmi: oca.bmi ?? "--",
    }));

    const columnHelper = createColumnHelper<typeof data[0]>();

    const columns = [
      columnHelper.accessor("id", {
        id: "id",
        header: "ID",
      }),
      columnHelper.accessor("uuid", {
        id: "uuid",
        header: "UUID",
      }),
      columnHelper.accessor("timepoint_category", {
        id: "timepoint_category",
        header: "Timepoint Category",
      }),
      columnHelper.accessor("nononcologic_therapeutic_agents", {
        id: "nononcologic_therapeutic_agents",
        header: "Nononcologic Therapeutic Agents",
      }),
      columnHelper.accessor("treatment_frequency", {
        id: "treatment_frequency",
        header: "Treatment Frequency",
      }),
      columnHelper.accessor("weight", {
        id: "weight",
        header: "Weight",
      }),
      columnHelper.accessor("height", {
        id: "height",
        header: "Height",
      }),
      columnHelper.accessor("bmi", {
        id: "bmi",
        header: "BMI",
      }),
    ];

    return {
      data,
      columns,
    };
  };

  return (
    <>
      <HorizontalTable tableData={formatDataForDiagnosesorFollowUps(data)} />
      <div
        className="w-full flex flex-row items-center gap-1 bg-nci-violet-lightest p-2 border-base-lighter border-1 border-t-0"
        data-testid="molecular-test-table-header"
      >
        <h3 className="mx-2 font-montserrat text-xl text-primary-content-darkest">
          Molecular Tests
        </h3>
        <Badge className="bg-accent-vivid px-1" radius="xs">
          {(data.molecular_tests || []).length}
        </Badge>
      </div>

      {!data.molecular_tests ? (
        <div className="border-base-lighter border-1 border-t-0 p-4">
          <Text>No Molecular Tests Found.</Text>
        </div>
      ) : (
        <VerticalTable {...formatMolecularTestsData(data)} />
      )}

      <div
        className="w-full flex flex-row items-center gap-1 bg-nci-violet-lightest p-2 border-base-lighter border-1 border-t-0"
        data-testid="oca-table-header"
      >
        <h3 className="mx-2 font-montserrat text-xl text-primary-content-darkest">
          Other Clinical Attributes
        </h3>
        <Badge className="bg-accent-vivid px-1" radius="xs">
          {(data.other_clinical_attributes || []).length}
        </Badge>
      </div>

      {!data.other_clinical_attributes ? (
        <div className="border-base-lighter border-1 border-t-0 p-4">
          <Text>No Other Clinical Attributes Found.</Text>
        </div>
      ) : (
        <VerticalTable {...formatOtherClinicalAttributes(data)} />
      )}
    </>
  );
};

export default FollowUpTables;
