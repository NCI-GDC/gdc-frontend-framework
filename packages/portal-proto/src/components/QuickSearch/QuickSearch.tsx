import { useQuickSearch } from "@gff/core";
import { Loader, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { TraversableList } from "../List/TraversableList";

export const QuickSearch = ({
  performSearch,
  setPerformSearch,
}: {
  performSearch: boolean;
  setPerformSearch: Dispatch<SetStateAction<boolean>>;
}) => {
  const [searchText, setSearchText] = useState("");
  const quickSearchRef = useRef(null);
  const {
    data: { searchList },
    isFetching,
  } = useQuickSearch(searchText);
  const ref = useClickOutside(() => setPerformSearch(false));

  console.log(searchList);
  useEffect(() => {
    if (performSearch) {
      quickSearchRef?.current?.focus();
    }
  }, [performSearch]);

  return (
    <>
      <div ref={ref}>
        <TextInput
          icon={isFetching ? <Loader size={24} /> : <SearchIcon size={24} />}
          placeholder="Quick Search"
          aria-label="Quick Search Input"
          ref={quickSearchRef}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              searchText.length > 0
                ? setSearchText("")
                : setPerformSearch(false);
            }
          }}
          classNames={{
            input: "focus:border-2 focus:drop-shadow-xl",
            wrapper: "w-72",
          }}
          size="sm"
          rightSection={
            searchText.length > 0 && (
              <CloseIcon
                onClick={() => setSearchText("")}
                className="cursor-pointer"
              ></CloseIcon>
            )
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {searchList.length > 0 && (
        <TraversableList data={searchList} query={searchText} />
      )}
    </>
  );
};
