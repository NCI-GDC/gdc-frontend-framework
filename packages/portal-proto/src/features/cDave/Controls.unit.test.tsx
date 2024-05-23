import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import Controls from "./Controls";

describe("<Controls />", () => {
  it("controls collapse", () => {
    const { getByRole, getByTestId } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded={false}
        setControlsExpanded={jest.fn()}
        cDaveFields={[]}
        fieldsWithData={{}}
        activeFields={[]}
      />,
    );

    expect(
      getByRole("button", {
        name: "Collapse/Expand controls",
        expanded: false,
      }),
    ).toBeInTheDocument();
    expect(getByTestId("cdave-control-panel")).toHaveClass("hidden");
  });

  it("displays amount of fields with data", () => {
    const { getByText } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded
        setControlsExpanded={jest.fn()}
        cDaveFields={
          [
            { field_name: "gender" },
            { field_name: "race" },
            { field_name: "ethnicity" },
          ] as any[]
        }
        fieldsWithData={{ gender: [] as any, race: {} as any }}
        activeFields={[]}
      />,
    );

    expect(getByText("2 of 3 fields with values")).toBeInTheDocument();
  });

  it("active fields display as selected", () => {
    const { getByLabelText } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded
        setControlsExpanded={jest.fn()}
        cDaveFields={
          [
            {
              field_name: "gender",
              full: "demographic.gender",
              field_type: "demographic",
            },
            {
              field_name: "race",
              full: "demographic.race",
              field_type: "demographic",
            },
          ] as any[]
        }
        fieldsWithData={{}}
        activeFields={["demographic.gender"]}
      />,
    );

    expect(getByLabelText("Gender")).toBeChecked();
    expect(getByLabelText("Race")).not.toBeChecked();
  });

  it("groups into tabs", async () => {
    const { queryByRole, findByText } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded
        setControlsExpanded={jest.fn()}
        cDaveFields={
          [
            {
              field_name: "gender",
              full: "demographic.gender",
              field_type: "demographic",
            },
            {
              field_name: "alcohol_history",
              full: "exposures.alcohol_history",
              field_type: "exposures",
            },
            {
              field_name: "treatment_type",
              full: "treatments.treatment_type",
              field_type: "treatments",
            },
          ] as any[]
        }
        fieldsWithData={{}}
        activeFields={[]}
      />,
    );

    expect(queryByRole("button", { name: "Demographic" })).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "Exposures" }).nextSibling.contains(
        await findByText("Alcohol History"),
      ),
    ).toBeTruthy();
    expect(
      queryByRole("button", { name: "Exposures" }).nextSibling.contains(
        await findByText("Gender"),
      ),
    ).toBeFalsy();
    // Hides tab with no fields
    expect(
      queryByRole("button", { name: "Diagnosis" }),
    ).not.toBeInTheDocument();
  });

  it("tab hides more than 5 fields", async () => {
    const { queryByText, queryByTestId } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded
        setControlsExpanded={jest.fn()}
        cDaveFields={
          [
            {
              field_name: "gender",
              full: "demographic.gender",
              field_type: "demographic",
            },
            {
              field_name: "race",
              full: "demographic.race",
              field_type: "demographic",
            },
            {
              field_name: "ethninity",
              full: "demographic.ethnicity",
              field_type: "demographic",
            },
            {
              field_name: "vital_status",
              full: "demographic.vital_status",
              field_type: "demographic",
            },
            {
              field_name: "something",
              full: "demographic.something",
              field_type: "demographic",
            },
            {
              field_name: "something_else",
              full: "demographic.something_else",
              field_type: "demographic",
            },
          ] as any[]
        }
        fieldsWithData={{}}
        activeFields={[]}
      />,
    );

    const plusIcon = queryByTestId("plus-icon");
    expect(queryByText("1 more")).toBeInTheDocument();
    expect(queryByText("Something Else")).not.toBeInTheDocument();
    await userEvent.click(plusIcon);
    expect(queryByText("show less")).toBeInTheDocument();
    expect(queryByText("Something Else")).toBeInTheDocument();
  });

  it("search multiple terms", async () => {
    const { getByPlaceholderText, queryByText } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded={true}
        setControlsExpanded={jest.fn()}
        cDaveFields={
          [
            {
              field_name: "gender",
              full: "demographic.gender",
              field_type: "demographic",
              description: "a type of filter",
            },
            {
              field_name: "treatment_type",
              full: "treatments.treatment_type",
              field_type: "treatments",
              description: "another type of filter",
            },
          ] as any[]
        }
        fieldsWithData={{}}
        activeFields={[]}
      />,
    );

    const input = getByPlaceholderText("Search");
    await userEvent.type(input, "treatment t");

    expect(queryByText("Treatment T")).toBeInTheDocument();
    expect(queryByText("Gender")).not.toBeInTheDocument();
  });

  it("search description", async () => {
    const { getByPlaceholderText, queryByText } = render(
      <Controls
        updateFields={jest.fn()}
        controlsExpanded={true}
        setControlsExpanded={jest.fn()}
        cDaveFields={
          [
            {
              field_name: "gender",
              full: "demographic.gender",
              field_type: "demographic",
              description: "assemblage of properties",
            },
            {
              field_name: "race",
              full: "demographic.race",
              field_type: "demographic",
              description: "nothing that matches",
            },
            {
              field_name: "treatment_type",
              full: "treatments.treatment_type",
              field_type: "treatments",
              description: "property of treatments",
            },
          ] as any[]
        }
        fieldsWithData={{}}
        activeFields={[]}
      />,
    );

    const input = getByPlaceholderText("Search");
    await userEvent.type(input, "Prop");

    expect(queryByText("Treatment Type")).toBeInTheDocument();
    expect(queryByText("Gender")).toBeInTheDocument();
    expect(queryByText("Race")).not.toBeInTheDocument();
  });
});
