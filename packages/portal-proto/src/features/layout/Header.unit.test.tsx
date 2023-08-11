import { fireEvent } from "@testing-library/react";
import { headerElements } from "../user-flow/workflow/navigation-utils";
import { Header } from "./Header";
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

    jest.mock("next/router", () => ({
      useRouter: jest.fn().mockReturnValue({
        pathname: "",
      }),
    }));
  });

  test("should show login button when the username is null initially", () => {
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValueOnce({
        data: {
          username: null,
          projects: { gdc_ids: {} },
        },
      })
      .mockReturnValueOnce(["1", "2"])
      .mockReturnValueOnce(null);

    const { getByTestId, queryByTestId } = render(
      <Header {...{ headerElements, indexPath: "/" }} />,
    );
    expect(getByTestId("loginButton")).toBeInTheDocument();
    expect(queryByTestId("userdropdown")).toBeNull();
  });

  test("should not show login button when the username is present", () => {
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValueOnce({
        data: {
          username: "testName",
          projects: { gdc_ids: {} },
        },
      })
      .mockReturnValueOnce(["1", "2"])
      .mockReturnValueOnce(null);

    const { getByTestId, queryByTestId } = render(
      <Header {...{ headerElements, indexPath: "/" }} />,
    );
    expect(queryByTestId("loginButton")).toBeNull();
    expect(getByTestId("userdropdown")).toBeInTheDocument();
  });

  test("should show Session Expire Modal when fetch token returns 401", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);

    jest
      .spyOn(core, "useCoreSelector")
      .mockReturnValueOnce({
        data: {
          username: "testName",
          projects: { gdc_ids: {} },
        },
      })
      .mockReturnValueOnce(["1", "2"])
      .mockReturnValueOnce(null);

    jest
      .spyOn(core, "fetchToken")
      .mockReturnValue(Promise.resolve({ text: "", status: 401 }));
    const { getByTestId } = render(
      <Header {...{ headerElements, indexPath: "/" }} />,
    );

    await fireEvent.click(getByTestId("userdropdown"));
    await fireEvent.click(getByTestId("userprofilemenu"));
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "SessionExpireModal" },
      type: "modals/showModal",
    });
    expect(mockDispatch).not.toBeCalledWith({
      payload: { modal: "UserProfileModal" },
      type: "modals/showModal",
    });
  });
});

test("should show User Profile Modal when fetch token returns 401", async () => {
  const mockDispatch = jest.fn();
  jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);

  jest
    .spyOn(core, "useCoreSelector")
    .mockReturnValueOnce({
      data: {
        username: "testName",
        projects: { gdc_ids: {} },
      },
    })
    .mockReturnValueOnce(["1", "2"])
    .mockReturnValueOnce(null);

  jest
    .spyOn(core, "fetchToken")
    .mockReturnValue(Promise.resolve({ text: "", status: 200 }));
  const { getByTestId } = render(
    <Header {...{ headerElements, indexPath: "/" }} />,
  );

  await fireEvent.click(getByTestId("userdropdown"));
  await fireEvent.click(getByTestId("userprofilemenu"));
  expect(mockDispatch).not.toBeCalledWith({
    payload: { modal: "SessionExpireModal" },
    type: "modals/showModal",
  });
  expect(mockDispatch).toBeCalledWith({
    payload: { modal: "UserProfileModal" },
    type: "modals/showModal",
  });
});
