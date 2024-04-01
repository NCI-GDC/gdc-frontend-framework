import { CartFile, GdcFile } from "@gff/core";
import { render } from "@testing-library/react";
import { TableActionButtons } from ".";
import userEvent from "@testing-library/user-event";
import * as cartFunctions from "@/features/cart/updateCart";
import * as core from "@gff/core";

describe("<TableActionButtons />", () => {
  beforeEach(() => {
    jest.spyOn(core, "useCoreSelector").mockReturnValue([] as CartFile[]);
    jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
    jest
      .spyOn(core, "useLazyFetchUserDetailsQuery")
      .mockImplementation(jest.fn().mockReturnValue([jest.fn()]));
  });

  it("should remove already present file from the cart", async () => {
    const { getByTestId } = render(
      <TableActionButtons
        isOutputFileInCart={true}
        file={[] as CartFile[]}
        downloadFile={{} as GdcFile}
        setFileToDownload={jest.fn()}
      />,
    );

    const cartButton = getByTestId("add-remove-cart-button");
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

    const cartButton = getByTestId("add-remove-cart-button");
    const mockAddCartFunc = jest.spyOn(cartFunctions, "addToCart");
    await userEvent.click(cartButton);

    expect(mockAddCartFunc).toBeCalled();
  });
});
