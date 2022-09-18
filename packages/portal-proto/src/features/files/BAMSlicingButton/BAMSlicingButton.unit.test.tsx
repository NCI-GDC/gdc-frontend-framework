import { BAMSlicingButton } from "@/features/files/BAMSlicingButton";
import * as core from "@gff/core";
import { render } from "@testing-library/react";
import * as util from "../../../utils/userProjectUtils";
import userEvent from "@testing-library/user-event";

describe("<BAMSlicingButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("show NoAccessModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(core, "useCoreSelector").mockReturnValueOnce({
      data: {
        username: null,
        projects: { gdc_ids: {} },
      },
    });
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as core.GdcFile} />,
    );
    const button = getByTestId("bamButton");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: "NoAccessModal",
      type: "modals/showModal",
    });
    // jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(false);
  });

  it("show NoAccessModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(core, "useCoreSelector").mockReturnValueOnce({
      data: {
        username: "testid",
        projects: { gdc_ids: {} },
      },
    });
    jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(true);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as core.GdcFile} />,
    );
    const button = getByTestId("bamButton");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: "BAMSlicingModal",
      type: "modals/showModal",
    });
  });

  it("show NoAccessToProjectModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(core, "useCoreDispatch").mockImplementation(() => mockDispatch);
    jest.spyOn(core, "useCoreSelector").mockReturnValueOnce({
      data: {
        username: "testid",
        projects: { gdc_ids: {} },
      },
    });
    jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(false);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as core.GdcFile} />,
    );
    const button = getByTestId("bamButton");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: "NoAccessToProjectModal",
      type: "modals/showModal",
    });
  });
});
