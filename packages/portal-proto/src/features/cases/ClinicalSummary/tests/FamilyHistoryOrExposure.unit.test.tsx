import { render } from "test-utils";
import { FamilyHistoryOrExposure } from "../FamilyHistoryOrExposure";
import userEvent from "@testing-library/user-event";

// Family Histories
export const mock_single_family_histories = [
  {
    relative_with_cancer_history: "no",
    relationship_type: null,
    submitter_id: "family-test-1",
    relationship_gender: null,
    relationship_age_at_diagnosis: null,
    relationship_primary_diagnosis: null,
    family_history_id: "2394a8ba-face-48f3-b7f7-e8aaa8633412",
  },
];

const mock_multiple_family_histories = [
  {
    relative_with_cancer_history: "no",
    relationship_type: null,
    submitter_id: "family-test-1",
    relationship_gender: null,
    relationship_age_at_diagnosis: null,
    relationship_primary_diagnosis: null,
    family_history_id: "2394a8ba-face-48f3-b7f7-e8aaa8633412",
  },
  {
    relative_with_cancer_history: "no",
    relationship_type: null,
    submitter_id: "family-test-2",
    relationship_gender: null,
    relationship_age_at_diagnosis: null,
    relationship_primary_diagnosis: null,
    family_history_id: "2394a8ba-face-48f3-b7f7-e8aaa8633412",
  },
];

// Exposures
export const mock_single_exposures = [
  {
    tobacco_smoking_status: "3",
    alcohol_history: null,
    exposure_id: "2a6c1b76-9ec5-47a8-a0a7-158685d2d2be",
    submitter_id: "exposure-test-1",
    alcohol_intensity: null,
    pack_years_smoked: null,
  },
];

const mock_multiple_exposures = [
  {
    tobacco_smoking_status: "3",
    alcohol_history: null,
    exposure_id: "2a6c1b76-9ec5-47a8-a0a7-158685d2d2be",
    submitter_id: "exposure-test-1",
    alcohol_intensity: null,
    pack_years_smoked: null,
  },
  {
    tobacco_smoking_status: "3",
    alcohol_history: null,
    exposure_id: "2a6c1b76-9ec5-47a8-a0a7-158685d2d2be",
    submitter_id: "exposure-test-2",
    alcohol_intensity: null,
    pack_years_smoked: null,
  },
];

describe("<DiagnosesOrFollowUps /> for FamilyHistories", () => {
  it("should not render vertical tabs when only 1 node is present", () => {
    const { queryByTestId, getByText } = render(
      <FamilyHistoryOrExposure dataInfo={mock_single_family_histories} />,
    );
    expect(queryByTestId("verticalTabs")).toBe(null);
    expect(getByText("family-test-1")).toBeInTheDocument();
  });

  it("vertical tabs should be clickable and render appropriate data when more than 1 node is present", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <FamilyHistoryOrExposure dataInfo={mock_multiple_family_histories} />,
    );

    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("family-test-1")).toBeInTheDocument();
    const tab = getAllByTestId("tab");
    await userEvent.click(tab[1]);
    expect(getByText("family-test-2")).toBeInTheDocument();
  });
});

describe("<DiagnosesOrFollowUps /> for FollowUps", () => {
  it("should not render vertical tabs when only 1 node is present", () => {
    const { queryByTestId, getByText } = render(
      <FamilyHistoryOrExposure dataInfo={mock_single_exposures} />,
    );
    expect(queryByTestId("verticalTabs")).toBe(null);
    expect(getByText("exposure-test-1")).toBeInTheDocument();
  });

  it("vertical tabs should be clickable and render appropriate data when more than 1 node is present", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <FamilyHistoryOrExposure dataInfo={mock_multiple_exposures} />,
    );

    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("exposure-test-1")).toBeInTheDocument();
    const tab = getAllByTestId("tab");
    await userEvent.click(tab[1]);
    expect(getByText("exposure-test-2")).toBeInTheDocument();
  });
});
