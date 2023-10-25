/* eslint jsx-a11y/no-noninteractive-tabindex: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0*/

import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";

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

export const TraversableList = <T extends Record<string, any>>({
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

  const itemRefs = Array.from({ length: data?.length }, () =>
    React.createRef<HTMLLIElement>(),
  );
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

  const keyBoardPress = (event: React.KeyboardEvent<HTMLLIElement>) => {
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

  useEffect(() => {
    if (focusedItem !== undefined) {
      itemRefs[focusedItem].current.focus();
    }
  }, [focusedItem, itemRefs]);

  return (
    <>
      {data?.length > 0 ? (
        <ul
          className="bg-base-lightest border-r-10 border-1 border-base absolute right-0 top-10 w-[512px] sm:left-0 md:left-0 lg:left-auto z-10"
          tabIndex={0}
          data-testid="list"
        >
          {data?.map((item, idx) => {
            return (
              <li
                key={keyExtractor(item)}
                className="focus:bg-primary-darkest focus:text-primary-contrast-darkest cursor-pointer"
                onMouseEnter={() => {
                  setFocusedItem(idx);
                  onFocusList && onFocusList(idx);
                }}
                onMouseLeave={() => {
                  setFocusedItem(undefined);
                  onFocusList && onFocusList(undefined);
                  itemRefs[idx]?.current?.blur();
                }}
                onClick={() => {
                  selectItem(idx);
                }}
                data-testid="list-item"
                ref={itemRefs[idx]}
                tabIndex={0}
                onKeyDown={keyBoardPress}
                onFocus={() => {
                  setFocusedItem(idx);
                  onFocusList && onFocusList(idx);
                }}
              >
                {renderItem(item, idx)}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="bg-base-lightest border-r-10 border-1 border-base absolute right-0 top-10 w-80 p-2 sm:left-0 md:left-0 lg:left-auto">
          No results found
        </div>
      )}
    </>
  );
};
