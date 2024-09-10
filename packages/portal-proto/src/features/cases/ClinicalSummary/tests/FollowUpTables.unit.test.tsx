import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import { TabbedTables } from "../TabbedTables";
import FollowUpTables from "../FollowUpTables";
import { mockSingleFollowUps, mockMultipleFollowUps } from "./mockData";

describe("<FollowUpTables />", () => {
  it("should not render vertical tabs when only 1 node is present", () => {
    const { queryByTestId } = render(
      <TabbedTables
        dataInfo={mockSingleFollowUps}
        TableElement={FollowUpTables}
      />,
    );
    expect(queryByTestId("verticalTabs")).toBe(null);
  });

  it("should render molecular_tests table when data is present", () => {
    const { queryByText, getByTestId } = render(
      <TabbedTables
        dataInfo={mockSingleFollowUps}
        TableElement={FollowUpTables}
      />,
    );
    expect(getByTestId("molecular-test-header").textContent).toBe(
      "Molecular Tests2",
    );
    expect(queryByText("No Molecular Tests Found.")).toBe(null);
  });

  it("should not render treatment table when molecular_tests array is emtpy", () => {
    const { getByText, getByTestId } = render(
      <TabbedTables
        dataInfo={[
          Object.assign({}, mockSingleFollowUps[0], {
            molecular_tests: undefined,
          }),
        ]}
        TableElement={FollowUpTables}
      />,
    );
    expect(getByTestId("molecular-test-header").textContent).toBe(
      "Molecular Tests0",
    );
    expect(getByText("No Molecular Tests Found.")).toBeInTheDocument();
  });

  it("should render vertical tabs when more than 1 node is present", () => {
    const { getByTestId, getAllByTestId, queryByText } = render(
      <TabbedTables
        dataInfo={mockMultipleFollowUps}
        TableElement={FollowUpTables}
      />,
    );
    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getAllByTestId("molecular-test-header")[0].textContent).toBe(
      "Molecular Tests0",
    );
    expect(queryByText("No Molecular Tests Found.")).not.toBe(null);
  });

  it("vertical tabs should be clickable and render appropriate data", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <TabbedTables
        dataInfo={mockMultipleFollowUps}
        TableElement={FollowUpTables}
      />,
    );

    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("follow-up-test")).toBeInTheDocument();
    expect(getAllByTestId("molecular-test-header")[0].textContent).toBe(
      "Molecular Tests0",
    );
    const tab = getAllByTestId("tab");
    await userEvent.click(tab[1]);
    expect(getByText("follow-up-test-1")).toBeInTheDocument();
    expect(getAllByTestId("molecular-test-header")[1].textContent).toBe(
      "Molecular Tests2",
    );
  });
});
