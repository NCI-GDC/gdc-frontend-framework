import { useQuickSearch } from "@gff/core";
import { Badge, Loader, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { extractEntityPath, findMatchingToken } from "src/utils";
import { TraversableList } from "../List/TraversableList";
import { TypeIcon } from "../TypeIcon";
import { entityShortNameMapping } from "./entityShortNameMapping";
import Highlight from "@/components/Highlight";

export const QuickSearch = ({
  performSearch,
  setPerformSearch,
}: {
  performSearch: boolean;
  setPerformSearch: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const quickSearchRef = useRef(null);
  const {
    data: { searchList },
    isFetching,
  } = useQuickSearch(searchText);
  const ref = useClickOutside(() => setPerformSearch(false));
  const router = useRouter();

  useEffect(() => {
    if (performSearch) {
      quickSearchRef?.current?.focus();
    }
  }, [performSearch]);

  console.log("searchList: ", searchList);
  const mappedData = searchList?.map((item) => ({
    elem: (
      <div className="flex p-2 mx-2">
        <div className="self-center">
          <TypeIcon
            iconText={entityShortNameMapping[atob(item.id).split(":")[0]]}
            // TODO fix this changeOnHover={item === focusedItem}
          />
        </div>
        <div className="flex flex-col">
          <div style={{ width: 200 }}>
            <Badge
              classNames={{
                inner: "text-xs",
                // TODO: put hover for this too.
                root: "bg-primary-darker text-primary-contrast-darker",
              }}
              className="cursor-pointer"
            >
              {item.symbol || atob(item.id).split(":")[1]}
            </Badge>
          </div>
          {/* TODO need to highlight the token here (there should already be a component for it, when selected or hoverd need to change the text) */}
          <span className="text-sm">
            <Highlight
              search={searchText.trim()}
              text={findMatchingToken(item, searchText.trim())}
            />
          </span>
        </div>
      </div>
    ),
    key: item.id,
  }));

  const onInputKeyDown = (e) => {
    if (e.key === "Escape") {
      searchText.length > 0 ? setSearchText("") : setPerformSearch(false);
    }
  };

  const onInputFocus = () => {
    quickSearchRef.current.setSelectionRange(
      quickSearchRef.current.value.length,
      quickSearchRef.current.value.length,
    );
  };

  const onSelectItem = useCallback(
    (index: number) => {
      setSearchText("");
      setPerformSearch(false);
      if (extractEntityPath(searchList[index]).includes("annotations")) {
        window.open(extractEntityPath(searchList[index]), "_ blank");
        return;
      }
      router.push(extractEntityPath(searchList[index]));
    },
    [router, searchList, setPerformSearch],
  );

  const onListBlur = useCallback(() => {
    quickSearchRef.current.focus();
  }, []);

  const onCancel = useCallback(() => {
    setSearchText("");
    quickSearchRef.current.focus();
  }, []);

  return (
    <>
      <div ref={ref} className="relative">
        <TextInput
          icon={isFetching ? <Loader size={24} /> : <SearchIcon size={24} />}
          placeholder="Quick Search"
          aria-label="Quick Search Input"
          ref={quickSearchRef}
          onKeyDown={onInputKeyDown}
          onFocus={onInputFocus}
          onBlur={() => {
            searchText.length === 0 && setPerformSearch(false);
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

        {!isFetching && searchText.length > 0 && (
          <TraversableList
            data={mappedData}
            onListBlur={onListBlur}
            onCancel={onCancel}
            onSelectItem={onSelectItem}
          />
        )}
      </div>
    </>
  );
};
