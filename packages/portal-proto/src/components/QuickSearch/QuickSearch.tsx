import { useQuickSearch } from "@gff/core";
import { Badge, Loader, TextInput, Highlight } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { TraversableList } from "../List/TraversableList";
import { TypeIcon } from "../TypeIcon";
import { entityShortNameMapping } from "./entityShortNameMapping";
import { extractEntityPath, findMatchingToken } from "./utils";

export const QuickSearch = (): JSX.Element => {
  const [performSearch, setPerformSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextForApi, setSearchTextForApi] = useState("");
  const [focusedListElemIdx, setFocusedListElemIdx] = useState(undefined);
  const [matchedSearchList, setMatchedSearchList] = useState(undefined);
  const quickSearchRef = useRef(null);
  const ref = useClickOutside(() => setPerformSearch(false));
  const router = useRouter();

  const {
    data: { searchList, query },
    isFetching,
  } = useQuickSearch(searchTextForApi);

  // Checks search results returned against current search to make sure it matches
  useEffect(() => {
    if (searchTextForApi && query === searchTextForApi) {
      setMatchedSearchList(searchList);
    }
  }, [searchTextForApi, searchList, query]);

  useEffect(() => {
    if (performSearch) {
      quickSearchRef?.current?.focus();
    }
  }, [performSearch]);

  const renderItem = (item: Record<string, any>, idx: number) => (
    <div className="flex p-2 mx-2">
      <div className="self-center">
        <TypeIcon
          iconText={entityShortNameMapping[atob(item.id).split(":")[0]]}
          changeOnHover={idx === focusedListElemIdx}
        />
      </div>
      <div className="flex flex-col">
        <div style={{ width: 200 }}>
          <Badge
            classNames={{
              inner: "text-xs",
              root: `${
                idx === focusedListElemIdx
                  ? "bg-primary-contrast-darker text-primary-darker"
                  : "bg-primary-darker text-primary-contrast-darker"
              }`,
            }}
            className="cursor-pointer"
          >
            {item.symbol || atob(item.id).split(":")[1]}
          </Badge>
        </div>
        <span className="text-sm">
          <Highlight
            highlight={searchText.trim()}
            highlightStyles={{
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: "14px",
              color: `${idx === focusedListElemIdx && "#38393a"}`, //nciGrayDarkest : might need to change the color
            }}
          >
            {findMatchingToken(item, searchText.trim().toLocaleLowerCase())}
          </Highlight>
        </span>
      </div>
    </div>
  );

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      searchText.length > 0 ? setSearchTextForApi("") : setPerformSearch(false);
      setMatchedSearchList(undefined);
    } else if (e.shiftKey && e.key === "Tab") {
      setPerformSearch(false);
    }
  };

  const onInputBlur = () => {
    (searchText.length === 0 || matchedSearchList.length === 0) &&
      setPerformSearch(false);
  };

  const onInputFocus = () => {
    quickSearchRef.current.setSelectionRange(
      quickSearchRef.current.value.length,
      quickSearchRef.current.value.length,
    );
  };

  const onSelectItem = (index: number) => {
    setPerformSearch(false);
    const entityPath = extractEntityPath(matchedSearchList[index]);
    // Note: for annotations we need to open v1 portal in a new tab
    if (entityPath.includes("annotations")) {
      window.open(entityPath, "_ blank");
      return;
    }
    router.push(entityPath);
    setSearchText("");
  };

  const onCancel = () => {
    setSearchText("");
    setSearchTextForApi("");
    quickSearchRef.current.focus();
  };

  useEffect(() => {
    //prevents unneeded api calls if user is typing something
    const delayDebounceFn = setTimeout(() => {
      setSearchTextForApi(searchText.trim());
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <>
      <div ref={ref} className="relative">
        <TextInput
          icon={
            isFetching ? (
              <Loader size={24} />
            ) : (
              <SearchIcon size={24} className="text-primary" />
            )
          }
          placeholder="e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2"
          data-testid="textbox-quick-search-bar"
          aria-label="Quick Search Input"
          ref={quickSearchRef}
          onKeyDown={onInputKeyDown}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          classNames={{
            input: "focus:border-2 focus:border-primary text-sm",
          }}
          size="sm"
          rightSection={
            searchText.length > 0 && (
              <CloseIcon
                onClick={() => {
                  setSearchText("");
                  setSearchTextForApi("");
                  quickSearchRef.current.focus();
                }}
                className="cursor-pointer"
              />
            )
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {!isFetching &&
          searchTextForApi.length > 0 &&
          matchedSearchList !== undefined && (
            <TraversableList
              data={matchedSearchList}
              onListBlur={onInputFocus}
              onCancel={onCancel}
              onSelectItem={onSelectItem}
              onFocusList={(idx: number) => setFocusedListElemIdx(idx)}
              onListTab={() => setPerformSearch(false)}
              renderItem={(item, idx) => renderItem(item, idx)}
              keyExtractor={({ id }) => id}
            />
          )}
      </div>
    </>
  );
};
