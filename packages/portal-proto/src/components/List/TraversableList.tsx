import { List } from "@mantine/core";
import { first, last, nth, isEmpty } from "lodash";
import { useState } from "react";

export const TraversableList = ({
  data,
  onListBlur,
  onSelectItem,
  onCancel,
}: {
  data: Array<{
    elem: JSX.Element;
    key: string;
  }>;
  onListBlur: () => void;
  onSelectItem: (index: number) => void;
  onCancel: () => void;
}): JSX.Element => {
  const [focusedItem, setFocusedItem] = useState(undefined);
  const focusPreviousItem = () => {
    if (isEmpty(data)) return;
    const nextFocus = getPreviousItem(data, focusedItem);
    setFocusedItem(nextFocus);
  };

  const focusNextItem = () => {
    if (isEmpty(data)) return;
    const nextFocus = getNextItem(data, focusedItem);
    setFocusedItem(nextFocus);
  };

  const selectItem = (idx) => {
    setFocusedItem(undefined);
    onSelectItem(idx);
  };

  const cancel = () => {
    setFocusedItem(undefined);
    onCancel();
  };

  // templatize
  const getPreviousItem = (items, reference) =>
    reference ? nth(items, items.indexOf(reference) - 1) : last(items);
  const getNextItem = (items, reference) =>
    reference ? nth(items, items.indexOf(reference) + 1) : first(items);

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
      selectItem(data.indexOf(focusedItem));
    }
  };

  return (
    <>
      {data.length > 0 ? (
        <List
          onKeyDown={keyBoardPress}
          className="absolute md:left-0 sm:left-0 lg:left-auto right-0 top-10 bg-base-lightest w-[512px] border-r-10 border-1 border-base"
          tabIndex={0}
          onFocus={() => setFocusedItem(data[0])}
          onBlur={onListBlur}
        >
          {data?.map((item, idx) => (
            <List.Item
              key={item.key}
              className={`${
                item === focusedItem &&
                "bg-primary-darkest text-primary-contrast-darkest"
              } cursor-pointer`}
              onMouseEnter={() => {
                setFocusedItem(item);
              }}
              onMouseLeave={() => {
                setFocusedItem(undefined);
              }}
              onClick={() => {
                selectItem(idx);
              }}
            >
              {item.elem}
            </List.Item>
          ))}
        </List>
      ) : (
        <div className="w-80 absolute md:left-0 sm:left-0 lg:left-auto right-0 bg-base-lightest top-10 p-2 border-r-10 border-1 border-base">
          No results found
        </div>
      )}
    </>
  );
};
