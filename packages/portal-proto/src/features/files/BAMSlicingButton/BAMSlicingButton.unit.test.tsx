import { BAMSlicingButton } from "@/features/files/BAMSlicingButton";
import * as core from "@gff/core";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as util from "src/utils/userProjectUtils";

describe("<BAMSlicingButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("show NoAccessModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValueOnce({
      data: {
        data: {
          username: null,
          projects: { gdc_ids: {} },
        },
      },
    } as any);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as core.GdcFile} />,
    );
    const button = getByTestId("bamButton");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "NoAccessModal" },
      type: "modals/showModal",
    });
  });

  it("show NoAccessModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValueOnce({
      data: {
        data: {
          username: "testid",
          projects: { gdc_ids: {} },
        },
      },
    } as any);
    jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(true);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as core.GdcFile} />,
    );
    const button = getByTestId("bamButton");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "BAMSlicingModal" },
      type: "modals/showModal",
    });
  });

  it("show NoAccessToProjectModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValueOnce({
      data: {
        data: {
          username: "testid",
          projects: { gdc_ids: {} },
        },
      },
    } as any);
    jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(false);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as core.GdcFile} />,
    );
    const button = getByTestId("bamButton");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "NoAccessToProjectModal" },
      type: "modals/showModal",
    });
  });
});
