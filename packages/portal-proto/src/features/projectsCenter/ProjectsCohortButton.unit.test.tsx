import { showNotification } from "@mantine/notifications";
import { render } from "@testing-library/react";
import ProjectsCohortButton from "./ProjectsCohortButton";
import * as appApi from "./appApi";
import * as core from "@gff/core";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import * as mantine_form from "@mantine/form";
import { mantineFormNoErrorObj } from "__mocks__/sharedMockData";

jest.mock("@mantine/notifications");
const mockedShowNotification = showNotification as jest.Mock<
  typeof showNotification
>;

beforeEach(() => mockedShowNotification.mockClear());

describe("<ProjectCohortButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(appApi, "useAppDispatch").mockReturnValue(jest.fn());
  });

  it("should render a empty New Cohort button", () => {
    jest.spyOn(appApi, "useAppSelector").mockReturnValue([]);

    jest.spyOn(core, "useCoreSelector").mockReturnValue(undefined);

    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());

    const { getByText } = render(<ProjectsCohortButton />);

    expect(getByText("Create New Cohort")).toBeInTheDocument();
  });

  it("should render 2 project  Create New Cohort button", () => {
    jest.spyOn(appApi, "useAppSelector").mockReturnValue(["TCGA", "FM"]);

    jest.spyOn(core, "useCoreSelector").mockReturnValue(undefined);

    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());

    const { getByRole } = render(<ProjectsCohortButton />);
    expect(getByRole("button").textContent).toBe("2 Create New Cohort");
  });

  it("dispatch an add cohort action", async () => {
    jest.spyOn(appApi, "useAppSelector").mockReturnValue(["TCGA", "FM"]);

    jest.spyOn(core, "useCoreSelector").mockReturnValue(["cohort1", "cohort2"]);

    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(mantine_form, "useForm").mockReturnValue(mantineFormNoErrorObj);

    const { getByRole, getByTestId } = render(
      <MantineProvider
        theme={{
          colors: {
            primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            base: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
          },
        }}
      >
        <ProjectsCohortButton />
      </MantineProvider>,
    );

    await userEvent.click(
      getByRole("button", {
        name: "2 Create New Cohort",
      }),
    );

    // this button is in SaveOrCreateCohortModal
    await userEvent.click(getByTestId("action-button"));
    expect(mockDispatch).toBeCalledWith({
      payload: {
        filters: {
          mode: "and",
          root: {
            "cases.project.project_id": {
              field: "cases.project.project_id",
              operands: ["TCGA", "FM"],
              operator: "includes",
            },
          },
        },
        message: "newProjectsCohort",
      },
      type: "cohort/availableCohorts/addNewCohortWithFilterAndMessage",
    });
  });
});
