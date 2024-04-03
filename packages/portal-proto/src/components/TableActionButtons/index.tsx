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
            ? "bg-primary text-base-max"
            : "bg-base-max text-primary"
        } border border-primary rounded px-2 h-6 w-8
         hover:bg-primary hover:text-base-lightest`}
        onClick={() => {
          isOutputFileInCart
            ? removeFromCart(file, currentCart, dispatch)
            : addToCart(file, currentCart, dispatch);
        }}
        data-testid="add-remove-cart-button"
      >
        <CartIcon title="Add to Cart" size={16} />
      </Button>
      <DownloadFile
        file={downloadFile}
        showLoading={false}
        setfileToDownload={setFileToDownload}
        variant="icon"
      />
    </div>
  );
};
