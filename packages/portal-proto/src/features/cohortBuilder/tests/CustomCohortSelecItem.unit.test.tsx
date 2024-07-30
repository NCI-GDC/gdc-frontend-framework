import { render } from "test-utils";
import { Select } from "@mantine/core";
import { CustomCohortSelectItem } from "../CohortManager/CustomCohortSelectItem";

describe("<CustomCohortSelectItem />", () => {
  it("Unsaved Icon should be visible when the cohort has been modified", () => {
    const menu_items = {
      value: "testId",
      label: "test",
      isSavedUnchanged: false,
      cohortStatusMessage: "Cohort not saved",
    };
    const { getByAltText, getByText } = render(
      <Select data={[menu_items]} renderOption={CustomCohortSelectItem} />,
    );
    expect(getByText("test")).toBeDefined();
    expect(getByAltText("Cohort not saved")).toBeDefined();
  });

  it("Unsaved Icon should NOT be visible when the cohort has NOT been modified", () => {
    const menu_items = {
      value: "testId",
      label: "test",
      isSavedUnchanged: true,
      cohortStatusMessage: "Changes not saved",
    };
    const { queryByAltText, getByText } = render(
      <Select data={[menu_items]} renderOption={CustomCohortSelectItem} />,
    );
    expect(getByText("test")).toBeDefined();
    expect(queryByAltText("this cohort is not saved")).toBeNull();
  });
});
