import { showNotification } from "@mantine/notifications";
import { render, fireEvent } from "@testing-library/react";
import { GdcFile } from "@gff/core";
import { addToCart, removeFromCart } from "./updateCart";

jest.mock("@mantine/notifications");
const mockedShowNotification = showNotification as jest.Mock<
  typeof showNotification
>;

beforeEach(() => mockedShowNotification.mockClear());

describe("updateCart, addToCart", () => {
  it("add single file", () => {
    const dispatchMock = jest.fn();
    addToCart([{ fileName: "filey", id: "1" } as GdcFile], [], dispatchMock);

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Added filey to the cart.")).toBeInTheDocument();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("add single file already in cart", () => {
    const dispatchMock = jest.fn();

    addToCart([{ fileName: "filey", id: "1" } as GdcFile], ["1"], dispatchMock);

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
        { fileName: "filey", id: "1" },
        { fileName: "abc", id: "2" },
      ] as GdcFile[],
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
        { fileName: "filey", id: "1" },
        { fileName: "abc", id: "2" },
      ] as GdcFile[],
      ["2"],
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
        { fileName: "filey", id: "1" },
        { fileName: "abc", id: "2" },
        { fileName: "filey", id: "3" },
        { fileName: "abc", id: "4" },
      ] as GdcFile[],
      ["2", "4"],
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
    const files = Array(9999).fill({ fileName: "filey", id: "1" });
    addToCart(files, ["2", "4"], dispatchMock);

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
    addToCart([{ fileName: "filey", id: "1" } as GdcFile], [], dispatchMock);

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
});

describe("updateCart, removeFromCart", () => {
  it("remove single file", () => {
    removeFromCart(
      [{ fileName: "abc", id: "2" }] as GdcFile[],
      ["2"],
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
        { fileName: "filey", id: "1" },
        { fileName: "abc", id: "2" },
      ] as GdcFile[],
      ["1", "2"],
      jest.fn(),
    );

    const { getByText } = render(
      mockedShowNotification.mock.calls[0][0].message,
    );
    expect(getByText("Removed 2 files from the cart.")).toBeInTheDocument();
  });

  it("undo button shows add notification", () => {
    removeFromCart([{ fileName: "abc", id: "2" }] as GdcFile[], [], jest.fn());

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
