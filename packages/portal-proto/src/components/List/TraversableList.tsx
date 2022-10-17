import { List } from "@mantine/core";
import { first, last, nth, isEmpty } from "lodash";
import { useState } from "react";

export const TraversableList = ({
  data,
  onListBlur,
  onSelectItem,
  onCancel,
  onFocusList,
  onListTab,
}: {
  data: Array<{
    elem: JSX.Element;
    key: string;
  }>;
  onListBlur: () => void;
  onSelectItem: (index: number) => void;
  onCancel: () => void;
  onFocusList: (index: number) => void; //name it better
  onListTab: () => void;
}): JSX.Element => {
  const [focusedItem, setFocusedItem] = useState(undefined);

  const getPreviousItem = (
    items: Array<{
      elem: JSX.Element;
      key: string;
    }>,
    reference: {
      elem: JSX.Element;
      key: string;
    },
  ) =>
    items.indexOf(
      reference ? nth(items, items.indexOf(reference) - 1) : last(items),
    );

  const getNextItem = (
    items: Array<{
      elem: JSX.Element;
      key: string;
    }>,
    reference: {
      elem: JSX.Element;
      key: string;
    },
  ) =>
    items.indexOf(
      reference ? nth(items, items.indexOf(reference) + 1) : first(items),
    );

  const focusPreviousItem = () => {
    if (isEmpty(data)) return;
    const prevFocusIdx = getPreviousItem(data, data[focusedItem]);
    setFocusedItem(prevFocusIdx);
    onFocusList(prevFocusIdx);
  };

  const focusNextItem = () => {
    if (isEmpty(data)) return;
    const nextFocusIdx = getNextItem(data, data[focusedItem]);
    setFocusedItem(nextFocusIdx);
    onFocusList(nextFocusIdx);
  };

  const selectItem = (idx: number) => {
    onSelectItem(idx);
  };

  const cancel = () => {
    setFocusedItem(undefined);
    onFocusList(undefined);
    onCancel();
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
      onFocusList(undefined);
      onListBlur();
    } else if (event.key === "Tab") {
      onListTab();
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
            onFocusList(0);
          }}
        >
          {data?.map((item, idx) => {
            return (
              <List.Item
                key={item.key}
                className={`${
                  idx === focusedItem &&
                  "bg-primary-darkest text-primary-contrast-darkest"
                } cursor-pointer`}
                onMouseEnter={() => {
                  setFocusedItem(idx);
                  onFocusList(idx);
                }}
                onMouseLeave={() => {
                  setFocusedItem(undefined);
                  onFocusList(undefined);
                }}
                onClick={() => {
                  selectItem(idx);
                }}
              >
                {item.elem}
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
