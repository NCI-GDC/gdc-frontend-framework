import { ActionIcon, Button } from "@mantine/core";
import { showNotification, cleanNotifications } from "@mantine/notifications";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { FaUndo as UndoIcon, FaShoppingCart as CartIcon } from "react-icons/fa";
import { fileInCart } from "src/utils";
import {
  CART_LIMIT,
  removeFilesFromCart,
  addFilesToCart,
  CoreDispatch,
  selectCart,
  useCoreSelector,
  useCoreDispatch,
  CartFile,
} from "@gff/core";

interface OverLimitNotificationProps {
  readonly numFilesInCart: number;
}
const OverLimitNotification: React.FC<OverLimitNotificationProps> = ({
  numFilesInCart,
}: OverLimitNotificationProps) => (
  <>
    <p>
      The cart is limited to {CART_LIMIT.toLocaleString()} files and currently
      contains {numFilesInCart.toLocaleString()}{" "}
      {numFilesInCart === 1 ? "file" : "files"}.
    </p>
    <p>
      Please add fewer files and/or first remove some files from the cart before
      adding more.
    </p>
  </>
);

interface UndoButtonProps {
  readonly action: () => void;
}
const UndoButton: React.FC<UndoButtonProps> = ({ action }: UndoButtonProps) => {
  return (
    <Button variant={"white"} onClick={action} leftIcon={<UndoIcon />}>
      <span className="underline">Undo</span>
    </Button>
  );
};

interface AddNotificationProps {
  readonly files: CartFile[];
  readonly currentCart: CartFile[];
  dispatch: CoreDispatch;
}
const AddNotification: React.FC<AddNotificationProps> = ({
  files,
  currentCart,
  dispatch,
}: AddNotificationProps) => {
  const filesToAdd = files.filter(
    (f) => !currentCart.map((c) => c.file_id).includes(f.file_id),
  );

  const newCart = [...currentCart, ...filesToAdd];

  const alreadyInCart = files.filter((f) =>
    currentCart.map((c) => c.file_id).includes(f.file_id),
  );

  if (filesToAdd.length > 0) {
    dispatch(addFilesToCart(filesToAdd));
  }

  if (files.length === 1) {
    if (filesToAdd.length === 1) {
      return (
        <>
          <p>Added {files[0].file_name} to the cart.</p>
          <UndoButton
            action={() => removeFromCart(filesToAdd, newCart, dispatch)}
          />
        </>
      );
    } else {
      return (
        <>{files[0].file_name} was already in the cart and was not added.</>
      );
    }
  } else {
    if (alreadyInCart.length === 0) {
      return (
        <>
          <p>
            Added {filesToAdd.length}{" "}
            {filesToAdd.length === 1 ? "file" : "files"} to the cart.
          </p>
          <UndoButton
            action={() => removeFromCart(filesToAdd, newCart, dispatch)}
          />
        </>
      );
    } else {
      return (
        <>
          <p>
            Added {filesToAdd.length}{" "}
            {filesToAdd.length === 1 ? "file" : "files"} to the cart.
          </p>
          <p>
            {alreadyInCart.length}{" "}
            {alreadyInCart.length === 1 ? "file was" : "files were"} already in
            the cart and {alreadyInCart.length === 1 ? "was" : "were"} not
            added.
          </p>
          {filesToAdd.length !== 0 && (
            <UndoButton
              action={() => removeFromCart(filesToAdd, newCart, dispatch)}
            />
          )}
        </>
      );
    }
  }
};

interface RemoveNotificationProps {
  files: readonly CartFile[];
  readonly currentCart: CartFile[];
  dispatch: CoreDispatch;
}
const RemoveNotification: React.FC<RemoveNotificationProps> = ({
  files,
  currentCart,
  dispatch,
}: RemoveNotificationProps) => {
  const filesToRemove = files.filter((f) =>
    currentCart.map((cartFile) => cartFile.file_id).includes(f.file_id),
  );

  const newCart = files.filter((f) => !filesToRemove.includes(f));

  if (filesToRemove.length === 1) {
    return (
      <>
        <p>Removed {filesToRemove[0].file_name} from the cart.</p>
        <UndoButton
          action={() => addToCart(filesToRemove, newCart, dispatch)}
        />
      </>
    );
  } else {
    return (
      <>
        <p>Removed {filesToRemove.length} files from the cart.</p>
        {filesToRemove.length !== 0 && (
          <UndoButton
            action={() => addToCart(filesToRemove, newCart, dispatch)}
          />
        )}
      </>
    );
  }
};

export const removeFromCart = (
  files: readonly CartFile[],
  currentCart: CartFile[],
  dispatch: CoreDispatch,
): void => {
  cleanNotifications();
  showNotification({
    message: (
      <RemoveNotification
        files={files}
        currentCart={currentCart}
        dispatch={dispatch}
      />
    ),
    classNames: {
      description: "flex flex-col content-center text-center",
    },
  });
  const filesToRemove = files.map((f) => f.file_id);
  dispatch(removeFilesFromCart(filesToRemove));
};

export const showCartOverLimitNotification = (numFilesInCart: number): void => {
  showNotification({
    message: <OverLimitNotification numFilesInCart={numFilesInCart} />,
    classNames: {
      description: "flex flex-col content-center text-center",
    },
  });
};

export const addToCart = (
  files: CartFile[],
  currentCart: CartFile[],
  dispatch: CoreDispatch,
): void => {
  const newCartSize = files.length + currentCart.length;
  cleanNotifications();

  if (newCartSize > CART_LIMIT) {
    showCartOverLimitNotification(currentCart.length);
  } else {
    showNotification({
      message: (
        <AddNotification
          files={files}
          currentCart={currentCart}
          dispatch={dispatch}
        />
      ),
      classNames: {
        description: "flex flex-col content-center text-center",
      },
    });
  }
};

interface CartButtonProps {
  readonly files: CartFile[];
  readonly iconOnly?: boolean;
}

export const AddToCartButton: React.FC<CartButtonProps> = ({
  files,
  iconOnly = false,
}: CartButtonProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return iconOnly ? (
    <ActionIcon
      title="Add to cart"
      aria-label="Add to cart"
      className="mx-auto text-primary border-primary bg-base-max"
      onClick={() => addToCart(files, currentCart, dispatch)}
    >
      <CartIcon />
    </ActionIcon>
  ) : (
    <Button
      className="text-primary bg-base-max border-primary hover:bg-primary-darker hover:text-base-max"
      onClick={() => addToCart(files, currentCart, dispatch)}
    >
      <CartIcon className="mr-2" /> Add to Cart
    </Button>
  );
};

export const RemoveFromCartButton: React.FC<CartButtonProps> = ({
  files,
  iconOnly = false,
}: CartButtonProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return iconOnly ? (
    <ActionIcon
      title="Remove From Cart"
      aria-label="Remove from cart"
      variant="outline"
      onClick={() => removeFromCart(files, currentCart, dispatch)}
      className="mx-auto text-primary border-primary bg-base-max"
    >
      <TrashIcon />
    </ActionIcon>
  ) : (
    <Button
      onClick={() => removeFromCart(files, currentCart, dispatch)}
      className="text-primary bg-base-max border-primary hover:bg-primary-darker hover:text-base-max"
    >
      <CartIcon className="mr-2" />
      Remove From Cart
    </Button>
  );
};

interface SingleItemCartButtonProps {
  readonly file: CartFile;
  readonly iconOnly?: boolean;
}

export const SingleItemAddToCartButton: React.FC<SingleItemCartButtonProps> = ({
  file,
  iconOnly = false,
}: SingleItemCartButtonProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return fileInCart(currentCart, file.file_id) ? (
    <ActionIcon
      title="Remove From Cart"
      aria-label="Remove from cart"
      onClick={() => removeFromCart([file], currentCart, dispatch)}
      className="mx-auto text-primary-content-darkest border-primary-darkest bg-primary-light"
    >
      <CartIcon />
    </ActionIcon>
  ) : (
    <AddToCartButton files={[file]} iconOnly={iconOnly} />
  );
};
