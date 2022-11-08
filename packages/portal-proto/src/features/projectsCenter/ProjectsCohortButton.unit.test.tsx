import { showNotification } from "@mantine/notifications";
import { render } from "@testing-library/react";
import ProjectsCohortButton from "./ProjectsCohortButton";
import * as appApi from "./appApi";
import * as core from "@gff/core";
import userEvent from "@testing-library/user-event";

jest.mock("@mantine/notifications");
const mockedShowNotification = showNotification as jest.Mock<
  typeof showNotification
>;

beforeEach(() => mockedShowNotification.mockClear());

describe("<ProjectCohortButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(getByRole("button").textContent).toBe("2Create New Cohort");
  });

  it("dispatch an add cohort action", async () => {
    jest.spyOn(appApi, "useAppSelector").mockReturnValue(["TCGA", "FM"]);

    jest.spyOn(core, "useCoreSelector").mockReturnValue(undefined);

    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);

    const { getByRole } = render(<ProjectsCohortButton />);

    await userEvent.click(
      getByRole("button", {
        name: "2 Create New Cohort",
      }),
    );
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
