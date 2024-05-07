import { showNotification } from "@mantine/notifications";
import { fireEvent } from "@testing-library/react";
import { render } from "test-utils";
import { CartFile } from "@gff/core";
import { addToCart, removeFromCart } from "./updateCart";

jest.mock("@mantine/notifications");
const mockedShowNotification = showNotification as jest.Mock;

beforeEach(() => mockedShowNotification.mockClear());

describe("updateCart, addToCart", () => {
  it("add single file", () => {
    const dispatchMock = jest.fn();
    addToCart(
      [{ file_name: "filey", file_id: "1" } as CartFile],
      [],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Added filey to the cart.")).toBeInTheDocument();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("add single file already in cart", () => {
    const dispatchMock = jest.fn();

    addToCart(
      [{ file_name: "filey", file_id: "1" } as CartFile],
      [{ file_id: "1" } as CartFile],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(
      getByText("filey was already in the cart and was not added."),
    ).toBeInTheDocument();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("add mutiple files", () => {
    const dispatchMock = jest.fn();
    addToCart(
      [
        { file_name: "filey", file_id: "1" },
        { file_name: "abc", file_id: "2" },
      ] as CartFile[],
      [],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Added 2 files to the cart.")).toBeInTheDocument();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("add 2 files, 1 already in cart", () => {
    const dispatchMock = jest.fn();
    addToCart(
      [
        { file_name: "filey", file_id: "1" },
        { file_name: "abc", file_id: "2" },
      ] as CartFile[],
      [{ file_id: "2" } as CartFile],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Added 1 file to the cart.")).toBeInTheDocument();
    expect(
      getByText("1 file was already in the cart and was not added."),
    ).toBeInTheDocument();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("add multiple files, some already in cart", () => {
    const dispatchMock = jest.fn();
    addToCart(
      [
        { file_name: "filey", file_id: "1" },
        { file_name: "abc", file_id: "2" },
        { file_name: "filey", file_id: "3" },
        { file_name: "abc", file_id: "4" },
      ] as CartFile[],
      [{ file_id: "2" }, { file_id: "4" }] as CartFile[],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Added 2 files to the cart.")).toBeInTheDocument();
    expect(
      getByText("2 files were already in the cart and were not added."),
    ).toBeInTheDocument();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("add too many files", () => {
    const dispatchMock = jest.fn();
    const files = Array(9999).fill({ file_name: "filey", file_id: "1" });
    addToCart(
      files,
      [{ file_id: "2" }, { file_id: "4" }] as CartFile[],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(
      getByText("Please add fewer files", { exact: false }),
    ).toBeInTheDocument();
    expect(
      getByText("currently contains 2 files", { exact: false }),
    ).toBeInTheDocument();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("undo button shows remove notification", () => {
    const dispatchMock = jest.fn();
    addToCart(
      [{ file_name: "filey", file_id: "1" } as CartFile],
      [],
      dispatchMock,
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    fireEvent.click(getByText("Undo"));

    const { getByText: getByRemoveNotificationText } = render(
      mockedShowNotification.mock.calls[1][0].message,
    );

    expect(
      getByRemoveNotificationText("Removed filey from the cart."),
    ).toBeInTheDocument();
  });

  it("do not show undo button if cart was not modified", () => {
    const dispatchMock = jest.fn();

    addToCart(
      [{ file_name: "filey", file_id: "1" } as CartFile],
      [{ file_id: "1" } as CartFile],
      dispatchMock,
    );

    const { queryByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(queryByText("Undo")).not.toBeInTheDocument();
  });
});

describe("updateCart, removeFromCart", () => {
  it("remove single file", () => {
    removeFromCart(
      [{ file_name: "abc", file_id: "2" }] as CartFile[],
      [{ file_id: "2" } as CartFile],
      jest.fn(),
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Removed abc from the cart.")).toBeInTheDocument();
  });

  it("remove multiple files", () => {
    removeFromCart(
      [
        { file_name: "filey", file_id: "1" },
        { file_name: "abc", file_id: "2" },
      ] as CartFile[],
      [{ file_id: "1" }, { file_id: "2" }] as CartFile[],
      jest.fn(),
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Removed 2 files from the cart.")).toBeInTheDocument();
  });

  it("undo button shows add notification", () => {
    removeFromCart(
      [{ file_name: "abc", file_id: "2" }] as CartFile[],
      [{ file_id: "2" } as CartFile],
      jest.fn(),
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    fireEvent.click(getByText("Undo"));

    const { getByText: getByAddNotificationText } = render(
      mockedShowNotification.mock.calls[1][0].message,
    );

    expect(
      getByAddNotificationText("Added abc to the cart."),
    ).toBeInTheDocument();
  });
});
