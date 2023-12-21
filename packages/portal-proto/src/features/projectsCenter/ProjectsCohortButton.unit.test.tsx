import { showNotification } from "@mantine/notifications";
import { render } from "test-utils";
import ProjectsCohortButton from "./ProjectsCohortButton";
import * as core from "@gff/core";
import userEvent from "@testing-library/user-event";

jest.mock("@mantine/notifications");
const mockedShowNotification = showNotification as jest.Mock<
  typeof showNotification
>;

beforeEach(() => mockedShowNotification.mockClear());

describe("<ProjectCohortButton />", () => {
  it("should render a empty New Cohort button", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue(undefined);
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());

    const { getByText } = render(<ProjectsCohortButton pickedProjects={[]} />);

    expect(getByText("Save New Cohort")).toBeInTheDocument();
  });

  it("should render 2 project  Save New Cohort button", () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue(undefined);

    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());

    const { getByRole } = render(
      <ProjectsCohortButton pickedProjects={["TCGA", "FM"]} />,
    );
    expect(getByRole("button").textContent).toBe("2 Save New Cohort");
  });

  it("dispatch an add cohort action", async () => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue(["cohort1", "cohort2"]);
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => jest.fn());

    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "1",
        name: "My New Cohort",
        filters: {},
        modified_datetime: "",
      }),
    });
    jest
      .spyOn(core, "useAddCohortMutation")
      .mockReturnValue([mockMutation, { isLoading: false } as any]);

    const { getByRole, getByTestId } = render(
      <ProjectsCohortButton pickedProjects={["TCGA", "FM"]} />,
    );

    await userEvent.click(
      getByRole("button", {
        name: "2 Save New Cohort",
      }),
    );

    // this button is in SaveOrCreateCohortModal
    await userEvent.type(getByTestId("input-field"), "New Cohort");
    await userEvent.click(getByTestId("action-button"));
    expect(mockMutation).toBeCalledWith({
      cohort: {
        filters: {
          op: "and",
          content: [
            {
              content: {
                field: "cases.project.project_id",
                value: ["TCGA", "FM"],
              },
              op: "in",
            },
          ],
        },
        type: "dynamic",
        name: "New Cohort",
      },
      delete_existing: false,
    });
  });
});
