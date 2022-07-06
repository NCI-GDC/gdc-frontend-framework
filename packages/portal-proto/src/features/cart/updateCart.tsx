import { ActionIcon, Button } from "@mantine/core";
import { showNotification, cleanNotifications } from "@mantine/notifications";
import { VscTrash as TrashIcon } from "react-icons/vsc";
import { FaUndo as UndoIcon, FaShoppingCart as CartIcon } from "react-icons/fa";
import {
  CART_LIMIT,
  removeFilesFromCart,
  addFilesToCart,
  GdcFile,
  CoreDispatch,
  SlideImageFile,
  selectCart,
  useCoreSelector,
  useCoreDispatch,
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
  readonly files: readonly (GdcFile | SlideImageFile)[];
  readonly currentCart: string[];
  readonly filesToAdd: readonly (GdcFile | SlideImageFile)[];
  readonly numAlreadyInCart: number;
  dispatch: CoreDispatch;
}
const AddNotification: React.FC<AddNotificationProps> = ({
  files,
  currentCart,
  filesToAdd,
  numAlreadyInCart,
  dispatch,
}: AddNotificationProps) => {
  const numFilesAdded = filesToAdd.length;
  const newCart = [
    ...currentCart,
    ...filesToAdd.map((f) => ("id" in f ? f.id : f.file_id)),
  ];

  if (files.length === 1) {
    if (numFilesAdded === 1) {
      return (
        <>
          <p>
            Added{" "}
            {"fileName" in files[0] ? files[0].fileName : files[0].file_name} to
            the cart.
          </p>
          <UndoButton
            action={() => removeFromCart(filesToAdd, newCart, dispatch)}
          />
        </>
      );
    } else {
      return (
        <>
          {"fileName" in files[0] ? files[0].fileName : files[0].file_name} was
          already in the cart and was not added.
        </>
      );
    }
  } else {
    if (numAlreadyInCart === 0) {
      return (
        <>
          <p>
            Added {numFilesAdded} {numFilesAdded === 1 ? "file" : "files"} to
            the cart.
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
            Added {numFilesAdded} {numFilesAdded === 1 ? "file" : "files"} to
            the cart.
          </p>
          <p>
            {numAlreadyInCart}{" "}
            {numAlreadyInCart === 1 ? "file was" : "files were"} already in the
            cart and {numAlreadyInCart === 1 ? "was" : "were"} not added.
          </p>
          {numFilesAdded !== 0 && (
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
  readonly files: readonly (GdcFile | SlideImageFile)[];
  readonly currentCart: string[];
  dispatch: CoreDispatch;
}
const RemoveNotification: React.FC<RemoveNotificationProps> = ({
  files,
  currentCart,
  dispatch,
}: RemoveNotificationProps) => {
  const filesToRemove = files.filter((f) =>
    currentCart.includes("id" in f ? f.id : f.file_id),
  );

  const newCart = files
    .filter((f) => !filesToRemove.includes(f))
    .map((f) => ("id" in f ? f.id : f.file_id));

  if (filesToRemove.length === 1) {
    return (
      <>
        <p>
          Removed{" "}
          {"fileName" in filesToRemove[0]
            ? filesToRemove[0].fileName
            : filesToRemove[0].file_name}{" "}
          from the cart.
        </p>
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
  files: readonly (GdcFile | SlideImageFile)[],
  currentCart: string[],
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
  const filesToRemove = files.map((f) => ("id" in f ? f.id : f.file_id));
  dispatch(removeFilesFromCart(filesToRemove));
};

export const addToCart = (
  files: readonly (GdcFile | SlideImageFile)[],
  currentCart: string[],
  dispatch: CoreDispatch,
): void => {
  const newCartSize = files.length + currentCart.length;
  cleanNotifications();

  if (newCartSize > CART_LIMIT) {
    showNotification({
      message: <OverLimitNotification numFilesInCart={currentCart.length} />,
      classNames: {
        description: "flex flex-col content-center text-center",
      },
    });
  } else {
    const alreadyInCart = files
      .map((f) => ("id" in f ? f.id : f.file_id))
      .filter((f) => currentCart.includes(f));

    const filesToAdd = files.filter(
      (f) => !currentCart.includes("id" in f ? f.id : f.file_id),
    );

    showNotification({
      message: (
        <AddNotification
          files={files}
          currentCart={currentCart}
          filesToAdd={filesToAdd}
          numAlreadyInCart={alreadyInCart.length}
          dispatch={dispatch}
        />
      ),
      classNames: {
        description: "flex flex-col content-center text-center",
      },
    });
    if (filesToAdd.length > 0) {
      dispatch(
        addFilesToCart(filesToAdd.map((f) => ("id" in f ? f.id : f.file_id))),
      );
    }
  }
};

interface AddToCartButtonProps {
  readonly files: GdcFile[];
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  files,
}: AddToCartButtonProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return (
    <Button onClick={() => addToCart(files, currentCart, dispatch)}>
      <CartIcon className="mr-2" /> Add to Cart
    </Button>
  );
};

interface RemoveFromCartButtonProps {
  readonly files: GdcFile[];
  readonly iconOnly?: boolean;
}

export const RemoveFromCartButton: React.FC<RemoveFromCartButtonProps> = ({
  files,
  iconOnly = false,
}: RemoveFromCartButtonProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return iconOnly ? (
    <ActionIcon
      aria-label="Remove from cart"
      variant="outline"
      onClick={() => removeFromCart(files, currentCart, dispatch)}
    >
      <TrashIcon />
    </ActionIcon>
  ) : (
    <Button onClick={() => removeFromCart(files, currentCart, dispatch)}>
      <CartIcon className="mr-2" />
      Remove From Cart
    </Button>
  );
};
