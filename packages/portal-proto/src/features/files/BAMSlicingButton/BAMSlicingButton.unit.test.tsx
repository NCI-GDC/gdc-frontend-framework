import { BAMSlicingButton } from "@/features/files/BAMSlicingButton";
import { render } from "test-utils";
import userEvent from "@testing-library/user-event";
import * as util from "src/utils/userProjectUtils";
import { GdcFile, useCoreDispatch, useFetchUserDetailsQuery } from "@gff/core";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useFetchUserDetailsQuery: jest.fn(),
}));

describe("<BAMSlicingButton />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("show NoAccessModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.mocked(useCoreDispatch).mockImplementation(() => mockDispatch);
    jest.mocked(useFetchUserDetailsQuery).mockReturnValueOnce({
      data: {
        data: {
          username: null,
          projects: { gdc_ids: {} },
        },
      },
    } as any);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as GdcFile} />,
    );
    const button = getByTestId("button-bam-slicing");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "NoAccessModal" },
      type: "modals/showModal",
    });
  });

  it("show NoAccessModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.mocked(useCoreDispatch).mockImplementation(() => mockDispatch);
    jest.mocked(useFetchUserDetailsQuery).mockReturnValueOnce({
      data: {
        data: {
          username: "testid",
          projects: { gdc_ids: {} },
        },
      },
    } as any);
    jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(true);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as GdcFile} />,
    );
    const button = getByTestId("button-bam-slicing");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "BAMSlicingModal" },
      type: "modals/showModal",
    });
  });

  it("show NoAccessToProjectModal when not logged in", async () => {
    const mockDispatch = jest.fn();
    jest.mocked(useCoreDispatch).mockImplementation(() => mockDispatch);
    jest.mocked(useFetchUserDetailsQuery).mockReturnValueOnce({
      data: {
        data: {
          username: "testid",
          projects: { gdc_ids: {} },
        },
      },
    } as any);
    jest.spyOn(util, "userCanDownloadFile").mockReturnValueOnce(false);
    const { getByTestId } = render(
      <BAMSlicingButton isActive={false} file={{} as GdcFile} />,
    );
    const button = getByTestId("button-bam-slicing");
    await userEvent.click(button);
    expect(mockDispatch).toBeCalledWith({
      payload: { modal: "NoAccessToProjectModal" },
      type: "modals/showModal",
    });
  });
});
