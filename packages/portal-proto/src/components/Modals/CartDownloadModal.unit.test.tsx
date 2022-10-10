import { render } from "@testing-library/react";
import UserEvent from "@testing-library/user-event";
import { CartFile } from "@gff/core";
import * as core from "@gff/core";
import CartDownloadModal from "./CartDownloadModal";

jest.spyOn(core, "useCoreDispatch").mockImplementation(jest.fn());
jest.mock("url-join", () => ({
  urlJoin: jest.fn(),
}));

describe("<CartDownloadModal />", () => {
  it("shows number of auth and unauth files", () => {
    const { getByTestId, getByRole } = render(
      <CartDownloadModal
        openModal
        user={{ username: undefined, projects: {} as any }}
        filesByCanAccess={{
          true: [{ fileId: "1" }] as CartFile[],
          false: [{ fileId: "2" }, { fileId: "3" }] as CartFile[],
        }}
        dbGapList={[]}
        setActive={jest.fn()}
      />,
    );

    expect(getByTestId("cart-download-modal-auth-files").textContent).toEqual(
      "1 file that you are authorized to download.",
    );
    expect(getByTestId("cart-download-modal-unauth-files").textContent).toEqual(
      "2 files that you are not authorized to download.",
    );
    expect(
      getByRole("button", { name: "Download 1 Authorized File" }),
    ).toBeInTheDocument();
  });

  it("shows login prompt for not logged in user", () => {
    const { getByText } = render(
      <CartDownloadModal
        openModal
        user={{ username: undefined, projects: {} as any }}
        filesByCanAccess={{
          true: [{ fileId: "1" }] as CartFile[],
          false: [{ fileId: "2" }, { fileId: "3" }] as CartFile[],
        }}
        dbGapList={[]}
        setActive={jest.fn()}
      />,
    );

    expect(getByText("Login")).toBeInTheDocument();
  });

  it("shows request access if unauthed files and logged in", () => {
    const { queryByText, getByTestId } = render(
      <CartDownloadModal
        openModal
        user={{ username: "USERGUY", projects: {} as any }}
        filesByCanAccess={{
          true: [{ fileId: "1" }] as CartFile[],
          false: [{ fileId: "2" }, { fileId: "3" }] as CartFile[],
        }}
        dbGapList={[]}
        setActive={jest.fn()}
      />,
    );

    expect(queryByText("Login")).not.toBeInTheDocument();
    expect(
      getByTestId("cart-download-modal-project-access").textContent,
    ).toEqual(
      "Please request dbGaP Access to the project (click here for more information).",
    );
  });

  it("shows data use agreement if has access controlled files", () => {
    const { getByText } = render(
      <CartDownloadModal
        openModal
        user={{ username: "USERGUY", projects: {} as any }}
        filesByCanAccess={{
          true: [{ fileId: "1" }] as CartFile[],
          false: [{ fileId: "2" }, { fileId: "3" }] as CartFile[],
        }}
        dbGapList={["TCGA"]}
        setActive={jest.fn()}
      />,
    );

    expect(
      getByText(
        "You are attempting to download files that are controlled access:",
      ),
    ).toBeInTheDocument();
  });

  it("cannot download if no authed files", () => {
    const { getByRole } = render(
      <CartDownloadModal
        openModal
        user={{ username: undefined, projects: {} as any }}
        filesByCanAccess={{
          false: [{ fileId: "2" }, { fileId: "3" }] as CartFile[],
        }}
        dbGapList={[]}
        setActive={jest.fn()}
      />,
    );

    expect(
      getByRole("button", { name: "Download 0 Authorized Files" }),
    ).toBeDisabled();
  });

  it("cannot download if user does not accept data use agreement", async () => {
    const { getByRole } = render(
      <CartDownloadModal
        openModal
        user={{ username: "USERGUY", projects: {} as any }}
        filesByCanAccess={{
          true: [{ fileId: "1" }] as CartFile[],
          false: [{ fileId: "2" }, { fileId: "3" }] as CartFile[],
        }}
        dbGapList={["TCGA"]}
        setActive={jest.fn()}
      />,
    );

    const downloadButton = getByRole("button", {
      name: "Download 1 Authorized File",
    });
    expect(downloadButton).toBeDisabled();
    await UserEvent.click(getByRole("checkbox"));
    expect(downloadButton).not.toBeDisabled();
  });
});
