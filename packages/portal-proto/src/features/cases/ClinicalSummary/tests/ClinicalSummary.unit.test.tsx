import { render } from "test-utils";
import { ClinicalSummary } from "../ClinicalSummary";
import userEvent from "@testing-library/user-event";
import { mockSingleDiagnoses, mockSingleFollowUps } from "./mockData";
import {
  mock_single_exposures,
  mock_single_family_histories,
} from "./FamilyHistoryOrExposure.unit.test";
import { Demographic } from "@gff/core";
import * as func from "@gff/core";

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
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("should render appropriate information when data is present", async () => {
    const { getByTestId, getByText } = render(
      <ClinicalSummary
        demographic={demographic}
        family_histories={mock_single_family_histories}
        follow_ups={mockSingleFollowUps}
        diagnoses={mockSingleDiagnoses}
        exposures={mock_single_exposures}
        case_id="test_case_id"
        project_id="test_project_id"
        submitter_id="test_submitter_id"
      />,
    );

    expect(getByText("demographic-test")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-diagnoses-treatments-tab"));
    expect(getByText("diagnosis-test")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-family-histories-tab"));
    expect(getByText("family-test-1")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-exposures-tab"));
    expect(getByText("exposure-test-1")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-followups-molecular-tests-tab"));
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
        case_id="test_case_id"
        project_id="test_project_id"
        submitter_id="test_submitter_id"
      />,
    );

    expect(getByText("No Demographic Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-diagnoses-treatments-tab"));
    expect(getByText("No Diagnoses Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-family-histories-tab"));
    expect(getByText("No Family Histories Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-exposures-tab"));
    expect(getByText("No Exposures Found.")).toBeInTheDocument();

    await userEvent.click(getByTestId("button-followups-molecular-tests-tab"));
    expect(getByText("No Follow Ups Found.")).toBeInTheDocument();
  });
});
