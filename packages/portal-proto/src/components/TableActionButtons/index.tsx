import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import {
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  CartFile,
  GdcFile,
} from "@gff/core";
import { Button } from "@mantine/core";
import { FaShoppingCart as CartIcon } from "react-icons/fa";
import { DownloadFile } from "../DownloadButtons";

export const TableActionButtons = ({
  isOutputFileInCart,
  file,
  downloadFile,
  setFileToDownload,
}: {
  isOutputFileInCart: boolean;
  file: CartFile[];
  downloadFile: GdcFile;
  setFileToDownload?: React.Dispatch<React.SetStateAction<GdcFile>>;
}): JSX.Element => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return (
    <div className="flex gap-3">
      <Button
        className={`${
          isOutputFileInCart
            ? "bg-secondary-min text-secondary-contrast-min"
            : "bg-base-lightest text-base-min"
        } border border-base-darkest rounded p-2 hover:bg-base-darkest hover:text-base-contrast-min`}
        onClick={() => {
          isOutputFileInCart
            ? removeFromCart(file, currentCart, dispatch)
            : addToCart(file, currentCart, dispatch);
        }}
        data-testid="add-remove-cart-button"
      >
        <CartIcon title="Add to Cart" />
      </Button>
      <DownloadFile
        file={downloadFile}
        showLoading={false}
        setfileToDownload={setFileToDownload}
      />
    </div>
  );
};
