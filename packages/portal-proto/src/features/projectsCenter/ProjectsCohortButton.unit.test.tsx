import { showNotification } from "@mantine/notifications";
import { render } from "test-utils";
import ProjectsCohortButton from "./ProjectsCohortButton";
import {
  useAddCohortMutation,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

jest.mock("@mantine/notifications");
const mockedShowNotification = showNotification as jest.Mock;

beforeEach(() => mockedShowNotification.mockClear());

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useCoreSelector: jest.fn(),
  useAddCohortMutation: jest.fn(),
}));

describe("<ProjectsCohortButton />", () => {
  it("should render a empty New Cohort button", () => {
    jest.mocked(useCoreSelector).mockReturnValue(undefined);
    jest.mocked(useCoreDispatch).mockImplementation(jest.fn());
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "1",
        name: "My New Cohort",
        filters: {},
        modified_datetime: "",
      }),
    });
    jest
      .mocked(useAddCohortMutation)
      .mockReturnValue([mockMutation, { isLoading: false } as any]);

    const { getByText } = render(<ProjectsCohortButton pickedProjects={[]} />);

    expect(getByText("Save New Cohort")).toBeInTheDocument();
  });

  it("should render 2 project  Save New Cohort button", () => {
    jest.mocked(useCoreSelector).mockReturnValue(undefined);
    jest.mocked(useCoreDispatch).mockImplementation(jest.fn());
    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "1",
        name: "My New Cohort",
        filters: {},
        modified_datetime: "",
      }),
    });
    jest
      .mocked(useAddCohortMutation)
      .mockReturnValue([mockMutation, { isLoading: false } as any]);

    const { getByRole } = render(
      <ProjectsCohortButton pickedProjects={["TCGA", "FM"]} />,
    );
    expect(getByRole("button").textContent).toBe("2 Save New Cohort");
  });

  it("dispatch an add cohort action", async () => {
    jest.mocked(useCoreSelector).mockReturnValue(["cohort1", "cohort2"]);
    jest.mocked(useCoreDispatch).mockImplementation(() => jest.fn());

    const mockMutation = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: "1",
        name: "My New Cohort",
        filters: {},
        modified_datetime: "",
      }),
    });
    jest
      .mocked(useAddCohortMutation)
      .mockReturnValue([mockMutation, { isLoading: false } as any]);

    const { getByRole } = render(
      <ProjectsCohortButton pickedProjects={["TCGA", "FM"]} />,
    );

    expect(
      getByRole("button", {
        name: "2 Save New Cohort",
      }),
    ).toBeDefined();
  });
});
