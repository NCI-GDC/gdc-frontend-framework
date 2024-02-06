import { ActionIcon, Button } from "@mantine/core";
import { showNotification, cleanNotifications } from "@mantine/notifications";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { FaUndo as UndoIcon, FaShoppingCart as CartIcon } from "react-icons/fa";
import { fileInCart, focusStyles } from "src/utils";
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
import { useEffect } from "react";
import AccessibleNotificationWrapper from "@/components/AccessibleNotificationWrapper";

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
    <Button
      variant={"white"}
      onClick={action}
      leftIcon={<UndoIcon aria-hidden="true" />}
    >
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

  useEffect(() => {
    if (filesToAdd.length > 0) {
      dispatch(addFilesToCart(filesToAdd));
    }
  }, [filesToAdd, dispatch]);

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
      <AccessibleNotificationWrapper>
        <RemoveNotification
          files={files}
          currentCart={currentCart}
          dispatch={dispatch}
        />
      </AccessibleNotificationWrapper>
    ),
    classNames: {
      description: "flex flex-col content-center text-center",
    },
    closeButtonProps: { "aria-label": "Close notification" },
  });
  const filesToRemove = files.map((f) => f.file_id);
  dispatch(removeFilesFromCart(filesToRemove));
};

export const showCartOverLimitNotification = (numFilesInCart: number): void => {
  showNotification({
    message: (
      <AccessibleNotificationWrapper>
        <OverLimitNotification numFilesInCart={numFilesInCart} />
      </AccessibleNotificationWrapper>
    ),
    classNames: {
      description: "flex flex-col content-center text-center",
    },
    closeButtonProps: { "aria-label": "Close notification" },
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
        <AccessibleNotificationWrapper>
          <AddNotification
            files={files}
            currentCart={currentCart}
            dispatch={dispatch}
          />
        </AccessibleNotificationWrapper>
      ),
      classNames: {
        description: "flex flex-col content-center text-center",
      },
      closeButtonProps: { "aria-label": "Close notification" },
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
      className="mx-auto text-primary-content-darkest border-primary-darkest"
      onClick={() => addToCart(files, currentCart, dispatch)}
    >
      <CartIcon />
    </ActionIcon>
  ) : (
    <Button
      className={`font-medium text-sm text-primary bg-base-max hover:bg-primary-darkest hover:text-primary-contrast-darker ${focusStyles}`}
      onClick={() => addToCart(files, currentCart, dispatch)}
      variant="outline"
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
      size={20}
      title="Remove From Cart"
      aria-label="Remove from cart"
      variant="outline"
      onClick={() => removeFromCart(files, currentCart, dispatch)}
      className="ml-4 text-primary border-primary"
    >
      <TrashIcon size={15} />
    </ActionIcon>
  ) : (
    <Button
      onClick={() => removeFromCart(files, currentCart, dispatch)}
      className={`font-medium text-sm text-primary bg-base-max hover:bg-primary-darkest hover:text-primary-contrast-darker ${focusStyles}`}
      variant="outline"
    >
      <CartIcon className="mr-2" />
      Remove From Cart
    </Button>
  );
};

interface SingleItemCartButtonProps {
  readonly file: CartFile;
}

export const SingleItemAddToCartButton: React.FC<SingleItemCartButtonProps> = ({
  file,
}: SingleItemCartButtonProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const inCart = fileInCart(currentCart, file.file_id);

  return (
    <ActionIcon
      title={inCart ? "Remove From Cart" : "Add to Cart"}
      aria-label={inCart ? "Remove from cart" : "Add to Cart"}
      onClick={() => {
        inCart
          ? removeFromCart([file], currentCart, dispatch)
          : addToCart([file], currentCart, dispatch);
      }}
      className={`mx-auto text-primary-content-darkest border-primary-darkest ${
        inCart ? "bg-primary-light" : ""
      }`}
    >
      <CartIcon />
    </ActionIcon>
  );
};
