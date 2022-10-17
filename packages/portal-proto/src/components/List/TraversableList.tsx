import { List } from "@mantine/core";
import { isEmpty } from "lodash";
import { useState } from "react";

interface Props<T> {
  /**
   * Array of any kinds
   */
  data: T[];
  /**
   * function to render list element
   */
  renderItem: (item: T, idx: number) => React.ReactNode;
  /**
   * function to create a key for the list
   */
  keyExtractor: (item: T) => string;
  /**
   * optional: function to be called when Escape key is pressed
   */
  onCancel?: () => void;
  /**
   * optional: function to be called when Shift + Tab key is pressed
   */
  onListBlur?: () => void;
  /**
   * optional: function to be called when Tab key is pressed
   */
  onListTab?: () => void;
  /**
   * optional: function to be called when the list element is selected
   */
  onSelectItem?: (index: number) => void;
  /**
   * optional: function to be called when the list is focused
   */
  onFocusList?: (index: number) => void;
}

export const TraversableList = <T extends unknown>({
  data,
  onListBlur,
  onSelectItem,
  onCancel,
  onFocusList,
  keyExtractor,
  onListTab,
  renderItem,
}: Props<T>): JSX.Element => {
  const [focusedItem, setFocusedItem] = useState<undefined | number>(undefined);

  const getPreviousItem = (items: Array<T>, reference: number) =>
    reference !== undefined ? Math.max(0, reference - 1) : items.length - 1;

  const getNextItem = (items: Array<T>, reference: number) =>
    reference !== undefined ? Math.min(items.length - 1, reference + 1) : 0;

  const focusPreviousItem = () => {
    if (isEmpty(data)) return;
    const prevFocusIdx = getPreviousItem(data, focusedItem);
    setFocusedItem(prevFocusIdx);
    onFocusList && onFocusList(prevFocusIdx);
  };

  const focusNextItem = () => {
    if (isEmpty(data)) return;
    const nextFocusIdx = getNextItem(data, focusedItem);
    setFocusedItem(nextFocusIdx);
    onFocusList && onFocusList(nextFocusIdx);
  };

  const selectItem = (idx: number) => {
    onSelectItem && onSelectItem(idx);
  };

  const cancel = () => {
    setFocusedItem(undefined);
    onFocusList && onFocusList(undefined);
    onCancel && onCancel();
  };

  const keyBoardPress = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusPreviousItem();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusNextItem();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectItem(focusedItem);
    } else if (event.shiftKey && event.key === "Tab") {
      setFocusedItem(undefined);
      onFocusList && onFocusList(undefined);
      onListBlur && onListBlur();
    } else if (event.key === "Tab") {
      onListTab && onListTab();
    }
  };

  return (
    <>
      {data.length > 0 ? (
        <List
          onKeyDown={keyBoardPress}
          className="absolute md:left-0 sm:left-0 lg:left-auto right-0 top-10 bg-base-lightest w-[512px] border-r-10 border-1 border-base"
          tabIndex={0}
          onFocus={() => {
            setFocusedItem(0);
            onFocusList && onFocusList(0);
          }}
          data-testid="list"
        >
          {data?.map((item, idx) => {
            return (
              <List.Item
                key={keyExtractor(item)}
                className={`${
                  idx === focusedItem &&
                  "bg-primary-darkest text-primary-contrast-darkest"
                } cursor-pointer`}
                onMouseEnter={() => {
                  setFocusedItem(idx);
                  onFocusList && onFocusList(idx);
                }}
                onMouseLeave={() => {
                  setFocusedItem(undefined);
                  onFocusList && onFocusList(undefined);
                }}
                onClick={() => {
                  selectItem(idx);
                }}
                data-testid="list-item"
              >
                {renderItem(item, idx)}
              </List.Item>
            );
          })}
        </List>
      ) : (
        <div className="w-80 absolute md:left-0 sm:left-0 lg:left-auto right-0 bg-base-lightest top-10 p-2 border-r-10 border-1 border-base">
          No results found
        </div>
      )}
    </>
  );
};
