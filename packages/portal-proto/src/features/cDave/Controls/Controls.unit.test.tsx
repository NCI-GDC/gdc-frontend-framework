import { fireEvent, render } from "test-utils";
import userEvent from "@testing-library/user-event";
import Controls from "./Controls";
import { Stats } from "@gff/core";

describe("<Controls />", () => {
  it("renders all tab buttons", () => {
    const { queryByRole } = render(
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
        fieldsWithData={{
          "demographic.gender": {} as Stats,
          "exposures.alcohol_history": {} as Stats,
          "treatments.treatment_type": {} as Stats,
        }}
        activeFields={[]}
      />,
    );

    expect(queryByRole("button", { name: "Demographic" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "Exposures" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "Treatment" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "Diagnosis" })).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "Other Clinical Attribute" }),
    ).toBeInTheDocument();
  });

  it("displays fields in their correct tabs", async () => {
    const { findByText } = render(
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
        fieldsWithData={{
          "demographic.gender": {} as Stats,
          "exposures.alcohol_history": {} as Stats,
          "treatments.treatment_type": {} as Stats,
        }}
        activeFields={[]}
      />,
    );

    expect(await findByText("Gender")).toBeInTheDocument();
    expect(await findByText("Alcohol History")).toBeInTheDocument();
    expect(await findByText("Treatment Type")).toBeInTheDocument();
  });

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
    const { getByTestId } = render(
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

    const fieldsWithValuesText = getByTestId("text-fields-with-values");
    expect(fieldsWithValuesText).toHaveTextContent(
      "2 of 3 properties with data",
    );
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

  it("shows 'No properties with data' for empty tabs", () => {
    const { getByTestId } = render(
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
          ] as any[]
        }
        fieldsWithData={{
          "demographic.gender": {} as Stats,
        }}
        activeFields={[]}
      />,
    );

    expect(
      getByTestId("text-no-properties-with-data-diagnosis"),
    ).toBeInTheDocument();
    expect(
      getByTestId("text-no-properties-with-data-other-clinical-attribute"),
    ).toBeInTheDocument();
  });

  it("filters fields when 'Only show properties with data' is checked", async () => {
    const { getByRole, queryByText, findByText } = render(
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
              field_name: "alcohol_history",
              full: "exposures.alcohol_history",
              field_type: "exposures",
            },
            {
              field_name: "smoking_history",
              full: "exposures.smoking_history",
              field_type: "exposures",
            },
          ] as any[]
        }
        fieldsWithData={{
          "demographic.gender": {} as Stats,
          "exposures.alcohol_history": {} as Stats,
        }}
        activeFields={[]}
      />,
    );

    expect(await findByText("Gender")).toBeInTheDocument();
    expect(await findByText("Race")).toBeInTheDocument();
    expect(await findByText("Alcohol History")).toBeInTheDocument();
    expect(await findByText("Smoking History")).toBeInTheDocument();

    const checkbox = getByRole("checkbox", {
      name: "Only show properties with data",
    });
    fireEvent.click(checkbox);

    expect(await findByText("Gender")).toBeInTheDocument();
    expect(await findByText("Alcohol History")).toBeInTheDocument();

    expect(queryByText("Race")).not.toBeInTheDocument();
    expect(queryByText("Smoking History")).not.toBeInTheDocument();
  });

  it("shows correct count of properties with data", async () => {
    const { findByTestId } = render(
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
              field_name: "alcohol_history",
              full: "exposures.alcohol_history",
              field_type: "exposures",
            },
          ] as any[]
        }
        fieldsWithData={{
          "demographic.gender": {} as Stats,
          "exposures.alcohol_history": {} as Stats,
        }}
        activeFields={[]}
      />,
    );

    const fieldsWithDataText = await findByTestId("text-fields-with-values");
    expect(fieldsWithDataText).toHaveTextContent("2 of 3 properties with data");
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
    const { getByPlaceholderText, queryByText, queryByRole } = render(
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

    expect(
      queryByRole("button", { name: "Demographic" }),
    ).not.toBeInTheDocument();
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
