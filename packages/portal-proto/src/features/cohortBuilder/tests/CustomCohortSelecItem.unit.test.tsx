import { render } from "test-utils";
import { CustomCohortSelectItem } from "../CustomCohortSelectItem";

describe("<CustomCohortSelectItem />", () => {
  it("Unsaved Icon should be visible when the cohort has been modified", () => {
    const { getByAltText, getByText } = render(
      <CustomCohortSelectItem value="testId" label="test" modified={true} />,
    );
    expect(getByText("test")).toBeDefined();
    expect(getByAltText("this cohort is not saved")).toBeDefined();
  });

  it("Unsaved Icon should be visible when the cohort has been modified", () => {
    const { queryByAltText, getByText } = render(
      <CustomCohortSelectItem value="testId" label="test" modified={false} />,
    );
    expect(getByText("test")).toBeDefined();
    expect(queryByAltText("this cohort is not saved")).toBeNull();
  });
});
