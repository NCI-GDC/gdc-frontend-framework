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
  const [focusedListElemIdx, setFocusedListElemIdx] = useState(undefined);
  const quickSearchRef = useRef(null);
  const ref = useClickOutside(() => setPerformSearch(false));
  const router = useRouter();

  const {
    data: { searchList },
    isFetching,
  } = useQuickSearch(searchText);

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
      searchText.length > 0 ? setSearchText("") : setPerformSearch(false);
    } else if (e.shiftKey && e.key === "Tab") {
      setPerformSearch(false);
    }
  };

  const onInputBlur = () => {
    (searchText.length === 0 || searchList.length === 0) &&
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
    const entityPath = extractEntityPath(searchList[index]);
    // Note: for annotations we need to open v1 portal in a new tab
    if (entityPath.includes("annotations")) {
      window.open(entityPath, "_ blank");
      return;
    }
    router.push(entityPath);
  };

  const onCancel = () => {
    setSearchText("");
    quickSearchRef.current.focus();
  };

  return (
    <>
      <div ref={ref} className="relative">
        <TextInput
          icon={isFetching ? <Loader size={24} /> : <SearchIcon size={24} />}
          placeholder="e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2"
          aria-label="Quick Search Input"
          ref={quickSearchRef}
          onKeyDown={onInputKeyDown}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          classNames={{
            input: "focus:border-2 fo  cus:drop-shadow-xl",
          }}
          size="sm"
          rightSection={
            searchText.length > 0 && (
              <CloseIcon
                onClick={() => {
                  setSearchText("");
                  quickSearchRef.current.focus();
                }}
                className="cursor-pointer"
              />
            )
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {!isFetching && searchText.length > 0 && (
          <TraversableList
            data={searchList}
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
