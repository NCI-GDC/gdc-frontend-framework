import { headerElements } from "../user-flow/workflow/navigation-utils";
import { Header } from "./Header";
import * as router from "next/router";
import * as core from "@gff/core";
import * as tour from "@reactour/tour";
import { render } from "test-utils";

describe("<Header />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
    jest.spyOn(tour, "useTour").mockReturnValue({
      setIsOpen: jest.fn(),
      steps: [{ selector: "div", content: "string" }],
      isOpen: false,
      setSteps: jest.fn(),
      setDisabledActions: jest.fn(),
      setCurrentStep: jest.fn(),
      currentStep: 1,
      disabledActions: false,
    });

    jest.spyOn(core, "useTotalCounts").mockReturnValue({
      isError: false,
      isFetching: true,
      isSuccess: true,
      isUninitialized: false,
    });

    jest.spyOn(core, "useFacetDictionary").mockReturnValue({
      isError: false,
      isFetching: true,
      isSuccess: true,
      isUninitialized: false,
    });

    jest.spyOn(core, "useQuickSearch").mockReturnValue({
      data: { searchList: [], query: "" },
    } as any);

    jest.spyOn(router, "useRouter").mockImplementation(
      () =>
        ({
          pathname: "",
        } as any),
    );
  });

  test("should show login button when the username is null initially", () => {
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
    jest.spyOn(core, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValue({
      data: {
        data: {
          username: null,
          projects: { gdc_ids: {} },
        },
      },
    } as any);

    const { getAllByText, queryByTestId } = render(
      <Header {...{ headerElements, indexPath: "/" }} />,
    );
    expect(getAllByText("Login")[0]).toBeInTheDocument();
    expect(queryByTestId("userdropdown")).toBeNull();
  });

  test("should not show login button when the username is present", () => {
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
    jest.spyOn(core, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValue({
      data: {
        data: {
          username: "testName",
          projects: { gdc_ids: {} },
        },
      },
    } as any);

    const { getAllByText, queryByText } = render(
      <Header {...{ headerElements, indexPath: "/" }} />,
    );
    expect(queryByText("Login")).toBeNull();
    expect(getAllByText("testName")[0]).toBeInTheDocument();
  });
});
