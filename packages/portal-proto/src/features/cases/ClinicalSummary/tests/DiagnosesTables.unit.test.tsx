import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import { TabbedTables } from "../TabbedTables";
import DiagnosesTables from "../DiagnosesTables";
import { mockSingleDiagnoses, mockMultipleDiagnoses } from "./mockData";

describe("<DiagnosesTables />", () => {
  it("should not render vertical tabs when only 1 node is present", () => {
    const { queryByTestId } = render(
      <TabbedTables
        dataInfo={mockSingleDiagnoses}
        TableElement={DiagnosesTables}
      />,
    );
    expect(queryByTestId("verticalTabs")).toBe(null);
  });

  it("should render treatments table when data is present", () => {
    const { queryByText, getByTestId } = render(
      <TabbedTables
        dataInfo={mockSingleDiagnoses}
        TableElement={DiagnosesTables}
      />,
    );
    expect(getByTestId("treatment-table-header").textContent).toBe(
      "Treatments4",
    );
    expect(queryByText("No Treatments Found.")).toBe(null);
  });

  it("should not render treatment table when treatment array is emtpy", () => {
    const { getByText, getByTestId } = render(
      <TabbedTables
        dataInfo={[
          Object.assign({}, mockSingleDiagnoses[0], { treatments: undefined }),
        ]}
        TableElement={DiagnosesTables}
      />,
    );
    expect(getByTestId("treatment-table-header").textContent).toBe(
      "Treatments0",
    );
    expect(getByText("No Treatments Found.")).toBeInTheDocument();
  });

  it("should render vertical tabs when more than 1 node is present", () => {
    const { getByTestId, getAllByTestId, queryByText } = render(
      <TabbedTables
        dataInfo={mockMultipleDiagnoses}
        TableElement={DiagnosesTables}
      />,
    );
    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getAllByTestId("treatment-table-header")[0].textContent).toBe(
      "Treatments3",
    );
    expect(queryByText("No Treatments Found.")).toBe(null);
  });

  it("vertical tabs should be clickable and render appropriate data", async () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <TabbedTables
        dataInfo={mockMultipleDiagnoses}
        TableElement={DiagnosesTables}
      />,
    );

    expect(getByTestId("verticalTabs")).toBeInTheDocument();
    expect(getByText("diag-test")).toBeInTheDocument();
    expect(getAllByTestId("treatment-table-header")[0].textContent).toBe(
      "Treatments3",
    );

    const tab = getAllByTestId("tab");
    await userEvent.click(tab[1]);
    expect(getByText("diag-test-1")).toBeInTheDocument();
    expect(getAllByTestId("treatment-table-header")[1].textContent).toBe(
      "Treatments4",
    );
  });
});
