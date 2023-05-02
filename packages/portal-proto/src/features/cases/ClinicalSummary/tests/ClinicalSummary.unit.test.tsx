import { render } from "@testing-library/react";
import { ClinicalSummary } from "../ClinicalSummary";
import userEvent from "@testing-library/user-event";
import {
  mockSingleDiagnoses,
  mockSingleFollowUps,
} from "./DiagnosesOrFollowUps.unit.test";
import {
  mock_single_exposures,
  mock_single_family_histories,
} from "./FamilyHistoryOrExposure.unit.test";
import { Demographic } from "@gff/core";

const demographic = {
  race: "asian",
  gender: "male",
  ethnicity: "not hispanic or latino",
  vital_status: "Alive",
  demographic_id: "8479a889-1f10-4b8b-b97f-6fb63c046779",
  submitter_id: "demographic-test",
  days_to_death: null,
  days_to_birth: -23111,
};

describe("<ClinicalSummary /> ", () => {
  it("should render appropriate information when data is present", async () => {
    const { getByTestId, getByText } = render(
      <ClinicalSummary
        demographic={demographic}
        family_histories={mock_single_family_histories}
        follow_ups={mockSingleFollowUps}
        diagnoses={mockSingleDiagnoses}
        exposures={mock_single_exposures}
      />,
    );

    expect(getByText("demographic-test")).toBeInTheDocument();

    await userEvent.click(getByTestId("diagnosisTab"));
    expect(getByText("diagnosis-test")).toBeInTheDocument();

    await userEvent.click(getByTestId("familyTab"));
    expect(getByText("family-test-1")).toBeInTheDocument();

    await userEvent.click(getByTestId("exposuresTab"));
    expect(getByText("exposure-test-1")).toBeInTheDocument();

    await userEvent.click(getByTestId("followUpsTab"));
    expect(getByText("follow-up-test-1")).toBeInTheDocument();
  });

  it("should render appropriate error message when data is absent", async () => {
    const { getByTestId, getByText } = render(
      <ClinicalSummary
        demographic={{} as Demographic}
        family_histories={[]}
        follow_ups={[]}
        diagnoses={[]}
        exposures={[]}
      />,
    );

    expect(getByText("No Demographic Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("diagnosisTab"));
    expect(getByText("No Diagnoses Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("familyTab"));
    expect(getByText("No Family Histories Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("exposuresTab"));
    expect(getByText("No Exposures Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("followUpsTab"));
    expect(getByText("No Follow Ups Found.")).toBeInTheDocument();
  });
});
