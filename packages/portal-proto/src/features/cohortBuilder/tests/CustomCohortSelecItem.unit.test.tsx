import { render } from "test-utils";
import { Select } from "@mantine/core";
import { CustomCohortSelectItem } from "../CustomCohortSelectItem";

describe("<CustomCohortSelectItem />", () => {
  it("Unsaved Icon should be visible when the cohort has been modified", () => {
    const menu_items = { value: "testId", label: "test", modified: true };
    const { getByAltText, getByText } = render(
      <Select data={[menu_items]} renderOption={CustomCohortSelectItem} />,
    );
    expect(getByText("test")).toBeDefined();
    expect(getByAltText("this cohort is not saved")).toBeDefined();
  });

  it("Unsaved Icon should be visible when the cohort has been modified", () => {
    const menu_items = { value: "testId", label: "test", modified: false };
    const { queryByAltText, getByText } = render(
      <Select data={[menu_items]} renderOption={CustomCohortSelectItem} />,
    );
    expect(getByText("test")).toBeDefined();
    expect(queryByAltText("this cohort is not saved")).toBeNull();
  });
});
