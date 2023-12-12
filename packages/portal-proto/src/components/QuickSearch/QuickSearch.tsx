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
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextForApi, setSearchTextForApi] = useState("");
  const [focusedListElemIdx, setFocusedListElemIdx] = useState(undefined);
  const [matchedSearchList, setMatchedSearchList] = useState(undefined);
  const quickSearchRef = useRef(null);
  const ref = useClickOutside(() => {
    setLoading(false);
    setShowResults(false);
  });
  const router = useRouter();

  const {
    data: { searchList, query },
  } = useQuickSearch(searchTextForApi);

  // Checks search results returned against current search to make sure it matches
  useEffect(() => {
    if (searchTextForApi === "") {
      setLoading(false);
    } else if (query === searchTextForApi) {
      setMatchedSearchList(searchList);
      setLoading(false);
    }
  }, [searchTextForApi, searchList, query]);

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
      setShowResults(false);
      setLoading(false);
    } else if (e.shiftKey && e.key === "Tab") {
      setLoading(false);
    } else if (e.key === "Enter") {
      setShowResults(true);
    }
  };

  const onInputBlur = () => {
    (searchText.length === 0 ||
      (matchedSearchList && matchedSearchList.length === 0)) &&
      setLoading(false);
  };

  const onInputFocus = () => {
    quickSearchRef.current.setSelectionRange(
      quickSearchRef.current.value.length,
      quickSearchRef.current.value.length,
    );
  };

  const onSelectItem = (index: number) => {
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
    setLoading(false);
    setShowResults(false);
    quickSearchRef.current.focus();
  };

  useEffect(() => {
    setShowResults(false);
    const trimedSearchText = searchText.trim();
    if (trimedSearchText.length > 0) {
      setLoading(true);
      //prevents unneeded api calls if user is typing something
      const delayDebounceFn = setTimeout(() => {
        setSearchTextForApi(trimedSearchText);
        setShowResults(true);
      }, 250);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchText]);

  return (
    <>
      <div ref={ref} className="relative">
        <TextInput
          icon={loading ? <Loader size={24} /> : <SearchIcon size={24} />}
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
                  setLoading(false);
                  setShowResults(false);
                  quickSearchRef.current.focus();
                }}
                className="cursor-pointer"
              />
            )
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {!loading &&
          showResults &&
          searchText.length > 0 &&
          matchedSearchList !== undefined && (
            <TraversableList
              data={matchedSearchList}
              onListBlur={onInputFocus}
              onCancel={onCancel}
              onSelectItem={onSelectItem}
              onFocusList={(idx: number) => setFocusedListElemIdx(idx)}
              renderItem={(item, idx) => renderItem(item, idx)}
              keyExtractor={({ id }) => id}
            />
          )}
      </div>
    </>
  );
};
