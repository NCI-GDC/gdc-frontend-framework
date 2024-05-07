import { render } from "test-utils";
import { DiagnosesOrFollowUps } from "../DiagnosesOrFollowUps";
import userEvent from "@testing-library/user-event";

/* diagnoses */
export const mockSingleDiagnoses = [
  {
    days_to_recurrence: null,
    synchronous_malignancy: "No",
    morphology: "8140/3",
    submitter_id: "diagnosis-test",
    treatments: [
      {
        treatment_intent_type: "Neoadjuvant",
        days_to_treatment_start: null,
        treatment_id: "test",
        submitter_id: "test",
        therapeutic_agents: null,
        treatment_or_therapy: "no",
      },
      {
        treatment_intent_type: "Adjuvant",
        treatment_id: "test",
        submitter_id: "HCM-CSHL-0065-C20_treatment5",
        treatment_or_therapy: "no",
      },
      {
        treatment_intent_type: null,
        days_to_treatment_start: 48,
        treatment_id: "test",
        submitter_id: "HCM-CSHL-0065-C20_treatment4",
        therapeutic_agents: null,
        treatment_or_therapy: "yes",
      },
      {
        treatment_intent_type: "Adjuvant",
        days_to_treatment_start: null,
        treatment_id: "81c3c43d-8e0f-4095-a299-4c4bc185a63e",
        submitter_id: "HCM-CSHL-0065-C20_treatment2",
        therapeutic_agents: null,
        treatment_or_therapy: "no",
      },
    ],
    last_known_disease_status: null,
    tissue_or_organ_of_origin: "Colon, NOS",
    days_to_last_follow_up: null,
    age_at_diagnosis: 23111,
    primary_diagnosis: "Adenocarcinoma, NOS",
    classification_of_tumor: "metastasis",
    prior_malignancy: "no",
    diagnosis_id: "027c64ba-cd09-40e9-9495-12142f99aeb6",
    site_of_resection_or_biopsy: "Liver",
    days_to_last_known_disease_status: null,
    tumor_grade: "G2",
    progression_or_recurrence: null,
  },
];

const mockMultipleDiagnoses = [
  {
    days_to_recurrence: null,
    synchronous_malignancy: "No",
    morphology: "8140/3",
    submitter_id: "diag-test",
    treatments: [
      {
        treatment_intent_type: "Neoadjuvant",
        days_to_treatment_start: null,
        treatment_id: "test",
        submitter_id: "test",
        therapeutic_agents: null,
        treatment_or_therapy: "no",
      },
      {
        treatment_intent_type: "Adjuvant",
        treatment_id: "test",
        submitter_id: "HCM-CSHL-0065-C20_treatment5",
        treatment_or_therapy: "no",
      },
      {
        treatment_intent_type: null,
        days_to_treatment_start: 48,
        treatment_id: "test",
        submitter_id: "HCM-CSHL-0065-C20_treatment4",
        therapeutic_agents: null,
        treatment_or_therapy: "yes",
      },
    ],
    last_known_disease_status: null,
    tissue_or_organ_of_origin: "Colon, NOS",
    days_to_last_follow_up: null,
    age_at_diagnosis: 23111,
    primary_diagnosis: "Adenocarcinoma, NOS",
    classification_of_tumor: "metastasis",
    prior_malignancy: "no",
    diagnosis_id: "027c64ba-cd09-40e9-9495-12142f99aeb6",
    site_of_resection_or_biopsy: "Liver",
    days_to_last_known_disease_status: null,
    tumor_grade: "G2",
    progression_or_recurrence: null,
  },
  {
    days_to_recurrence: null,
    synchronous_malignancy: "No",
    morphology: "8140/3",
    submitter_id: "diag-test-1",
    treatments: [
      {
        treatment_intent_type: "Neoadjuvant",
        days_to_treatment_start: null,
        treatment_id: "test",
        submitter_id: "test",
        therapeutic_agents: null,
        treatment_or_therapy: "no",
      },
      {
        treatment_intent_type: "Adjuvant",
        treatment_id: "test",
        submitter_id: "HCM-CSHL-0065-C20_treatment5",
        treatment_or_therapy: "no",
      },
      {
        treatment_intent_type: null,
        days_to_treatment_start: 48,
        treatment_id: "test",
        submitter_id: "HCM-CSHL-0065-C20_treatment4",
        therapeutic_agents: null,
        treatment_or_therapy: "yes",
      },
      {
        treatment_intent_type: "Adjuvant",
        days_to_treatment_start: null,
        treatment_id: "81c3c43d-8e0f-4095-a299-4c4bc185a63e",
        submitter_id: "HCM-CSHL-0065-C20_treatment2",
        therapeutic_agents: null,
        treatment_or_therapy: "no",
      },
    ],
    last_known_disease_status: null,
    tissue_or_organ_of_origin: "Colon, NOS",
    days_to_last_follow_up: null,
    age_at_diagnosis: 23111,
    primary_diagnosis: "Adenocarcinoma, NOS",
    classification_of_tumor: "metastasis",
    prior_malignancy: "no",
    diagnosis_id: "027c64ba-cd09-40e9-9495-12142f99aeb6",
    site_of_resection_or_biopsy: "Liver",
    days_to_last_known_disease_status: null,
    tumor_grade: "G2",
    progression_or_recurrence: null,
  },
];

// FollowUps
const mockMultipleFollowUps = [
  {
    karnofsky_performance_status: null,
    follow_up_id: "21fa2463-9e93-4f42-9624-18a7e82953f0",
    progression_or_recurrence_anatomic_site: null,
    progression_or_recurrence_type: null,
    weight: null,
    risk_factor: null,
    submitter_id: "follow-up-test",
    disease_response: null,
    days_to_follow_up: 186,
    comorbidity: null,
    reflux_treatment_type: null,
    ecog_performance_status: null,
    progression_or_recurrence: null,
    height: null,
    bmi: null,
  },
  {
    karnofsky_performance_status: null,
    follow_up_id: "2650764a-22df-4e21-a792-c60bb61cda92",
    progression_or_recurrence_anatomic_site: null,
    progression_or_recurrence_type: null,
    molecular_tests: [
      {
        test_units: null,
        variant_type: null,
        gene_symbol: "Not Reported",
        chromosome: null,
        aa_change: null,
        submitter_id: "HCM-CSHL-0065-C20_molecular_test",
        mismatch_repair_mutation: null,
        antigen: "CEA",
        biospecimen_type: null,
        test_value: 77,
        molecular_analysis_method: "Not Reported",
        second_gene_symbol: null,
        test_result: "Test Value Reported",
        laboratory_test: null,
        molecular_test_id: "17023afb-a7d2-430a-847b-f93468faf6be",
      },
      {
        test_units: null,
        variant_type: null,
        gene_symbol: "MSH2",
        chromosome: null,
        aa_change: null,
        submitter_id: "HCM-CSHL-0065-C20_molecular_test5",
        mismatch_repair_mutation: null,
        antigen: null,
        biospecimen_type: null,
        test_value: null,
        molecular_analysis_method: "IHC",
        second_gene_symbol: null,
        test_result: "Negative",
        laboratory_test: null,
        molecular_test_id: "1e1149f3-208f-4128-939e-1cd5816d2af1",
      },
    ],
    weight: 61.2,
    risk_factor: null,
    submitter_id: "follow-up-test-1",
    disease_response: null,
    days_to_follow_up: 0,
    comorbidity: null,
    reflux_treatment_type: null,
    ecog_performance_status: null,
    progression_or_recurrence: null,
    height: 162.5,
    bmi: 23,
  },
];

export const mockSingleFollowUps = [
  {
    karnofsky_performance_status: null,
    follow_up_id: "2650764a-22df-4e21-a792-c60bb61cda92",
    progression_or_recurrence_anatomic_site: null,
    progression_or_recurrence_type: null,
    molecular_tests: [
      {
        test_units: null,
        variant_type: null,
        gene_symbol: "Not Reported",
        chromosome: null,
        aa_change: null,
        submitter_id: "HCM-CSHL-0065-C20_molecular_test",
        mismatch_repair_mutation: null,
        antigen: "CEA",
        biospecimen_type: null,
        test_value: 77,
        molecular_analysis_method: "Not Reported",
        second_gene_symbol: null,
        test_result: "Test Value Reported",
        laboratory_test: null,
        molecular_test_id: "17023afb-a7d2-430a-847b-f93468faf6be",
      },
      {
        test_units: null,
        variant_type: null,
        gene_symbol: "MSH2",
        chromosome: null,
        aa_change: null,
        submitter_id: "HCM-CSHL-0065-C20_molecular_test5",
        mismatch_repair_mutation: null,
        antigen: null,
        biospecimen_type: null,
        test_value: null,
        molecular_analysis_method: "IHC",
        second_gene_symbol: null,
        test_result: "Negative",
        laboratory_test: null,
        molecular_test_id: "1e1149f3-208f-4128-939e-1cd5816d2af1",
      },
    ],
    weight: 61.2,
    risk_factor: null,
    submitter_id: "follow-up-test-1",
    disease_response: null,
    days_to_follow_up: 0,
    comorbidity: null,
    reflux_treatment_type: null,
    ecog_performance_status: null,
    progression_or_recurrence: null,
    height: 162.5,
    bmi: 23,
  },
];

describe("<DiagnosesOrFollowUps /> for dianoses", () => {
  it("should not render vertical tabs when only 1 node is present", () => {
    const { queryByTestId } = render(
      <DiagnosesOrFollowUps dataInfo={mockSingleDiagnoses} />,
    );
    expect(queryByTestId("verticalTabs")).toBe(null);
  });

  it("should render treatments table when data is present", () => {
    const { queryByText, getByText } = render(
      <DiagnosesOrFollowUps dataInfo={mockSingleDiagnoses} />,
    );
    expect(getByText("Total of 4 Treatments")).toBeInTheDocument();
    expect(queryByText("No Treatments Found.")).toBe(null);
  });

  it("should not render treatment table when treatment array is emtpy", () => {
    const { getByText } = render(
      <DiagnosesOrFollowUps
        dataInfo={[
          Object.assign({}, mockSingleDiagnoses[0], { treatments: undefined }),
        ]}
      />,
    );
    expect(getByText("Total of 0 Treatments")).toBeInTheDocument();
    expect(getByText("No Treatments Found.")).toBeInTheDocument();
  });

  it("should render vertical tabs when more than 1 node is present", () => {
    const { getByTestId, getByText, queryByText } = render(
      <DiagnosesOrFollowUps dataInfo={mockMultipleDiagnoses} />,
    );
    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("Total of 3 Treatments")).toBeInTheDocument();
    expect(queryByText("No Treatments Found.")).toBe(null);
  });

  it("vertical tabs should be clickable and render appropriate data", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <DiagnosesOrFollowUps dataInfo={mockMultipleDiagnoses} />,
    );

    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("diag-test")).toBeInTheDocument();
    expect(getByText("Total of 3 Treatments")).toBeInTheDocument();
    const tab = getAllByTestId("tab");
    await userEvent.click(tab[1]);
    expect(getByText("diag-test-1")).toBeInTheDocument();
    expect(getByText("Total of 4 Treatments")).toBeInTheDocument();
  });
});

/*Follw Ups */
describe("<DiagnosesOrFollowUps /> for Followups", () => {
  it("should not render vertical tabs when only 1 node is present", () => {
    const { queryByTestId } = render(
      <DiagnosesOrFollowUps dataInfo={mockSingleDiagnoses} />,
    );
    expect(queryByTestId("verticalTabs")).toBe(null);
  });

  it("should render molecular_tests table when data is present", () => {
    const { queryByText, getByText } = render(
      <DiagnosesOrFollowUps dataInfo={mockSingleFollowUps} />,
    );
    expect(getByText("Total of 2 Molecular Tests")).toBeInTheDocument();
    expect(queryByText("No Molecular Tests Found.")).toBe(null);
  });

  it("should not render treatment table when molecular_tests array is emtpy", () => {
    const { getByText } = render(
      <DiagnosesOrFollowUps
        dataInfo={[
          Object.assign({}, mockSingleFollowUps[0], {
            molecular_tests: undefined,
          }),
        ]}
      />,
    );
    expect(getByText("Total of 0 Molecular Tests")).toBeInTheDocument();
    expect(getByText("No Molecular Tests Found.")).toBeInTheDocument();
  });

  it("should render vertical tabs when more than 1 node is present", () => {
    const { getByTestId, getByText, queryByText } = render(
      <DiagnosesOrFollowUps dataInfo={mockMultipleFollowUps} />,
    );
    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("Total of 0 Molecular Tests")).toBeInTheDocument();
    expect(queryByText("No Molecular Tests Found.")).not.toBe(null);
  });

  it("vertical tabs should be clickable and render appropriate data", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <DiagnosesOrFollowUps dataInfo={mockMultipleFollowUps} />,
    );

    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("follow-up-test")).toBeInTheDocument();
    expect(getByText("Total of 0 Molecular Tests")).toBeInTheDocument();
    const tab = getAllByTestId("tab");
    await userEvent.click(tab[1]);
    expect(getByText("follow-up-test-1")).toBeInTheDocument();
    expect(getByText("Total of 2 Molecular Tests")).toBeInTheDocument();
  });
});
