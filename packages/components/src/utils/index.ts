import { KeyboardEventHandler } from "react";

export const createKeyboardAccessibleFunction = (
  func: () => void,
): KeyboardEventHandler<any> => {
  return (e: React.KeyboardEvent<any>) => (e.key === "Enter" ? func() : null);
};
