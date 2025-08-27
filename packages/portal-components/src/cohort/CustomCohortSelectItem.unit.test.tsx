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
    const { getByTitle, getByText } = render(
      <MantineProvider>
        <Select
          data={[menu_items]}
          renderOption={CustomCohortSelectItem as any}
        />
      </MantineProvider>,
    );
    expect(getByText("test")).toBeDefined();
    expect(getByTitle("Cohort not saved")).toBeDefined();
  });

  it("Unsaved Icon should NOT be visible when the cohort has NOT been modified", () => {
    const menu_items = {
      value: "testId",
      label: "test",
      isSavedUnchanged: true,
      cohortStatusMessage: "Changes not saved",
    };
    const { queryByTitle, getByText } = render(
      <MantineProvider>
        <Select
          data={[menu_items]}
          renderOption={CustomCohortSelectItem as any}
        />
      </MantineProvider>,
    );
    expect(getByText("test")).toBeDefined();
    expect(queryByTitle("Cohort not saved")).toBeNull();
  });
});
