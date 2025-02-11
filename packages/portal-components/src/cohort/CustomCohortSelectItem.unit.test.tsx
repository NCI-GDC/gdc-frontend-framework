import React from "react";
import { render } from "@testing-library/react";
import { MantineProvider, Select } from "@mantine/core";
import { CustomCohortSelectItem } from "./CustomCohortSelectItem";

describe("<CustomCohortSelectItem />", () => {
  it("Unsaved Icon should be visible when the cohort has been modified", () => {
    const menu_items = {
      value: "testId",
      label: "test",
      isSavedUnchanged: false,
      cohortStatusMessage: "Cohort not saved",
    };
    const { getByAltText, getByText } = render(
      <MantineProvider>
        <Select
          data={[menu_items]}
          renderOption={CustomCohortSelectItem as any}
        />
      </MantineProvider>,
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
      <MantineProvider>
        <Select
          data={[menu_items]}
          renderOption={CustomCohortSelectItem as any}
        />
      </MantineProvider>,
    );
    expect(getByText("test")).toBeDefined();
    expect(queryByAltText("this cohort is not saved")).toBeNull();
  });
});
