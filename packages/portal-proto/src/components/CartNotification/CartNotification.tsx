import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  CART_LIMIT,
  useCoreDispatch,
  removeFilesFromCart,
  addFilesToCart,
  GdcFile,
} from "@gff/core";
import { FaUndo as UndoIcon } from "react-icons/fa";

export const OverLimitNotification = ({ numFilesInCart }) => (
  <>
    <p>
      The cart is limited to The cart is limited to {CART_LIMIT} files and
      currently contains {numFilesInCart} files.
    </p>
    <p>
      Please add fewer files and/or first remove some files from the cart before
      adding more.
    </p>
  </>
);

const UndoButton = ({ files }) => {
  const dispatch = useCoreDispatch();

  return (
    <Button variant={'white'} onClick={() => removeFromCart(files, dispatch)} leftIcon={<UndoIcon />}>Undo</Button>
  )
};

export const AddNotification = ({ files, numFilesAdded, numAlreadyInCart }) => {
  if (files.length === 1) {
    if (numFilesAdded === 1) {
      return (
        <>
          <p>Added {files[0].fileName} to the cart.</p>
          <UndoButton files={files} /> 
        </>
      );
    } else {
      return (
        <>{files[0].filename} was already in the cart and was not added.</>
      );
    }
  } else {
    if (numAlreadyInCart === 0) {
      return (
        <>
          <p>Added {numFilesAdded} files to the cart.</p>
          <UndoButton files={files} />
        </>
      );
    } else {
      return (
        <>
          <p>Added {numFilesAdded} files to the cart.</p>
          <p>
            {numAlreadyInCart} files were already in the cart and were not
            added.
          </p>
          <UndoButton files={files} />
        </>
      );
    }
  }
};

export const RemoveNotification = ({ files }) => {
  if (files.length === 1) {
    return <>Removed {files[0].fileName} from the cart.</>;
  } else {
    return <>Removed {files.length} files from the cart.</>;
  }
};

const removeFromCart = (files : GdcFile[], dispatch ) => {
  showNotification({
    message: <RemoveNotification files={files} />,
  });
  const filesToRemove = files.map((f) => f.id);
  dispatch(removeFilesFromCart(filesToRemove));
};

export const addToCart = (files : readonly GdcFile[], currentCart : string[], dispatch ) => {
  const numFilesToBeAdded = files.length + currentCart.length;

  if (numFilesToBeAdded > CART_LIMIT) {
    showNotification({
      message: <OverLimitNotification numFilesInCart={numFilesToBeAdded} />,
    });
  } else {
    const alreadyInCart = files
      .map((f) => f.id)
      .filter((f) => currentCart.includes(f));

    const filesToAdd = files
      .map((f) => f.id)
      .filter((f) => !currentCart.includes(f));

    showNotification({
      message: (
        <AddNotification
          files={files}
          numFilesAdded={filesToAdd.length}
          numAlreadyInCart={alreadyInCart.length}
        />
      ),
    });
    dispatch(addFilesToCart(filesToAdd));
  }
};
