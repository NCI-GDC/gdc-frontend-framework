import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { FaUndo as UndoIcon } from "react-icons/fa";
import {
  CART_LIMIT,
  useCoreDispatch,
  removeFilesFromCart,
  addFilesToCart,
  GdcFile,
  CoreDispatch,
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
  readonly files: readonly GdcFile[];
  dispatch: CoreDispatch;
}
const UndoButton: React.FC<UndoButtonProps> = ({
  files,
  dispatch,
}: UndoButtonProps) => {
  return (
    <Button
      variant={"white"}
      onClick={() => removeFromCart(files, dispatch)}
      leftIcon={<UndoIcon />}
    >
      <span className="underline">Undo</span>
    </Button>
  );
};

interface AddNotificationProps {
  readonly files: readonly GdcFile[];
  readonly numFilesAdded: number;
  readonly numAlreadyInCart: number;
  dispatch: CoreDispatch;
}
const AddNotification: React.FC<AddNotificationProps> = ({
  files,
  numFilesAdded,
  numAlreadyInCart,
  dispatch,
}: AddNotificationProps) => {
  if (files.length === 1) {
    if (numFilesAdded === 1) {
      return (
        <>
          <p>Added {files[0].fileName} to the cart.</p>
          <UndoButton files={files} dispatch={dispatch} />
        </>
      );
    } else {
      return (
        <>{files[0].fileName} was already in the cart and was not added.</>
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
          <UndoButton files={files} dispatch={dispatch} />
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
          <UndoButton files={files} dispatch={dispatch} />
        </>
      );
    }
  }
};

interface RemoveNotificationProps {
  readonly files: readonly GdcFile[];
}
const RemoveNotification: React.FC<RemoveNotificationProps> = ({
  files,
}: RemoveNotificationProps) => {
  if (files.length === 1) {
    return <>Removed {files[0].fileName} from the cart.</>;
  } else {
    return <>Removed {files.length} files from the cart.</>;
  }
};

export const removeFromCart = (
  files: readonly GdcFile[],
  dispatch: CoreDispatch,
): void => {
  showNotification({
    message: <RemoveNotification files={files} />,
    classNames: {
      description: "flex flex-col content-center text-center",
    },
  });
  const filesToRemove = files.map((f) => f.id);
  dispatch(removeFilesFromCart(filesToRemove));
};

export const addToCart = (
  files: readonly GdcFile[],
  currentCart: string[],
  dispatch: CoreDispatch,
): void => {
  const numFilesToBeAdded = files.length + currentCart.length;

  if (numFilesToBeAdded > CART_LIMIT) {
    showNotification({
      message: <OverLimitNotification numFilesInCart={numFilesToBeAdded} />,
      classNames: {
        description: "flex flex-col content-center text-center",
      },
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
          dispatch={dispatch}
        />
      ),
      classNames: {
        description: "flex flex-col content-center text-center",
      },
    });
    if (filesToAdd.length > 0) {
      dispatch(addFilesToCart(filesToAdd));
    }
  }
};
