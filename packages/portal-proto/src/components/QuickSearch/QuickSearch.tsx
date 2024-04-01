import React, { useState, forwardRef } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { useRouter } from "next/router";
import { Badge, Loader, Highlight, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { validate as uuidValidate } from "uuid";
import { useGetHistoryQuery, useQuickSearch, HistoryDefaults } from "@gff/core";
import { TypeIcon } from "../TypeIcon";
import {
  entityShortNameMapping,
  QuickSearchEntities,
} from "./entityShortNameMapping";
import { extractEntityPath, findMatchingToken } from "./utils";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  symbol?: string;
  "data-hovered": boolean;
  obj: Record<string, any>;
  superseded?: boolean;
  entity?: QuickSearchEntities;
}

export const QuickSearch = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debounced] = useDebouncedValue(searchText, 250);
  const [matchedSearchList, setMatchedSearchList] = useState([]);

  const router = useRouter();

  const {
    data: { searchList, query },
  } = useQuickSearch(debounced);

  const { data: fileHistory } = useGetHistoryQuery(searchText.trim(), {
    skip:
      debounced === "" ||
      searchList?.length > 0 ||
      !uuidValidate(debounced.trim()),
  });

  // Checks search results returned against current search to make sure it matches
  useDeepCompareEffect(() => {
    if (debounced === "") {
      setLoading(false);
      setMatchedSearchList([]);
    } else if (query === debounced) {
      if (fileHistory !== undefined) {
        setMatchedSearchList([
          {
            value: fileHistory[0].uuid,
            label: fileHistory[0].uuid,
            obj: fileHistory,
            superseded: true,
            entity: "File",
          },
        ]);
      } else {
        setMatchedSearchList(
          searchList.map((obj) => ({
            value: obj.id, // required by plugin
            label: obj.id, // required by plugin
            symbol: obj.symbol,
            obj: obj,
          })),
        );
      }
      setLoading(false);
    }
  }, [debounced, searchList, query, fileHistory]);

  const renderItem = forwardRef<HTMLDivElement, ItemProps>(
    (
      { value, label, symbol, obj, superseded, entity, ...others }: ItemProps,
      ref,
    ) => {
      let badgeText: string;
      if (superseded) {
        badgeText = (obj as HistoryDefaults[]).find(
          (f) => f.file_change === "released",
        )?.uuid;
      } else {
        badgeText = symbol || atob(label).split(":")?.[1];
      }
      const matchingToken = findMatchingToken(
        obj,
        searchText.trim().toLocaleLowerCase(),
      );
      const mainText = superseded
        ? `File ${matchingToken} has been updated`
        : matchingToken;

      return (
        <div
          data-testid="text-search-result"
          ref={ref}
          {...others}
          aria-label={`${badgeText}, ${matchingToken}`}
        >
          <div
            className={`flex p-2 px-4 ${
              others["data-hovered"] &&
              "bg-primary-darkest text-primary-contrast-darkest"
            }`}
          >
            <div className="self-center">
              <TypeIcon
                iconText={
                  entityShortNameMapping[entity || atob(label).split(":")[0]]
                }
                changeOnHover={others["data-hovered"]}
              />
            </div>
            <div className="flex flex-col">
              <div style={{ width: 200 }}>
                <Badge
                  classNames={{
                    inner: "text-xs",
                    root: `${
                      others["data-hovered"]
                        ? "bg-primary-contrast-darker text-primary-darker"
                        : "bg-primary-darker text-primary-contrast-darker"
                    }`,
                  }}
                  className="cursor-pointer"
                >
                  {badgeText}
                </Badge>
              </div>
              <span className="text-sm">
                <Highlight
                  highlight={searchText.trim()}
                  highlightStyles={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: `${others["data-hovered"] && "#38393a"}`, //nciGrayDarkest : might need to change the color
                  }}
                >
                  {mainText}
                </Highlight>
              </span>
            </div>
          </div>
        </div>
      );
    },
  );

  const onSelectItem = (id: string) => {
    if (!id) {
      return;
    }
    const selectedObj = fileHistory
      ? fileHistory.find((h) => h.uuid === id)
      : matchedSearchList.find((obj) => obj.value == id).obj;
    const entityPath = extractEntityPath(selectedObj);
    router.push(entityPath);
    setSearchText("");
  };

  return (
    <Select
      icon={
        loading ? (
          <Loader size={24} />
        ) : (
          <SearchIcon size={24} aria-hidden="true" />
        )
      }
      placeholder="e.g. BRAF, Breast, TCGA-BLCA, TCGA-A5-A0G2"
      data-testid="textbox-quick-search-bar"
      aria-label="Quick Search Input"
      classNames={{
        input: "focus:border-2 focus:border-primary text-sm",
        dropdown: "bg-base-lightest border-r-10 border-1 border-base",
        item: "p-0 m-0",
      }}
      maxDropdownHeight={1000} //large number so no scroll bar
      dropdownPosition="bottom"
      size="sm"
      rightSection={
        searchText.length > 0 ? <CloseIcon className="cursor-pointer" /> : <></>
      }
      clearable
      itemComponent={renderItem}
      data={matchedSearchList}
      searchable
      nothingFound={
        searchText.length > 0 && debounced.length > 0 && !loading
          ? "No results found"
          : undefined
      } //This is so it does not show no results when loading or when user has not entered anything
      filter={() => true} //dont have plugin filter results
      onSearchChange={(query) => {
        setLoading(true);
        setSearchText(query);
      }}
      searchValue={searchText}
      onChange={onSelectItem}
      value="" // set to blank so that a value does not flash when making a selection before the next page loads
      onDropdownClose={() => {
        setLoading(false);
      }}
    />
  );
};
