import { CartFile, GdcFile } from "@gff/core";
import { render } from "test-utils";
import { TableActionButtons } from ".";
import userEvent from "@testing-library/user-event";
import * as cartFunctions from "@/features/cart/updateCart";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn().mockReturnValue(jest.fn()),
  useCoreSelector: jest.fn().mockReturnValue([] as CartFile[]),
  useLazyFetchUserDetailsQuery: jest
    .fn()
    .mockImplementation(jest.fn().mockReturnValue([jest.fn()])),
}));

describe("<TableActionButtons />", () => {
  it("should remove already present file from the cart", async () => {
    const { getByTestId } = render(
      <TableActionButtons
        isOutputFileInCart={true}
        file={[] as CartFile[]}
        downloadFile={{} as GdcFile}
        setFileToDownload={jest.fn()}
      />,
    );

    const cartButton = getByTestId("button-add-remove-cart");
    const mockRemoveCartFunc = jest.spyOn(cartFunctions, "removeFromCart");
    await userEvent.click(cartButton);

    expect(mockRemoveCartFunc).toBeCalled();
  });

  it("should add file to the cart if not already present", async () => {
    const { getByTestId } = render(
      <TableActionButtons
        isOutputFileInCart={false}
        file={[] as CartFile[]}
        downloadFile={{} as GdcFile}
        setFileToDownload={jest.fn()}
      />,
    );

    const cartButton = getByTestId("button-add-remove-cart");
    const mockAddCartFunc = jest.spyOn(cartFunctions, "addToCart");
    await userEvent.click(cartButton);

    expect(mockAddCartFunc).toBeCalled();
  });
});
