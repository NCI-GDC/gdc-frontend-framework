import React, { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { useRouter } from "next/router";
import { Loader, Highlight, Select, SelectProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { validate as uuidValidate } from "uuid";
import {
  useGetHistoryQuery,
  useQuickSearchQuery,
  HistoryDefaults,
} from "@gff/core";
import {
  entityIconMapping,
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
  last?: boolean;
}

export const QuickSearch = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debounced] = useDebouncedValue(searchText, 250);
  const [matchedSearchList, setMatchedSearchList] = useState([]);

  const router = useRouter();

  const { data } = useQuickSearchQuery(debounced);

  const { searchList, query } = data || {};

  const { data: fileHistory } = useGetHistoryQuery(searchText.trim(), {
    skip:
      searchText === "" ||
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
      if (fileHistory !== undefined && fileHistory.length > 0) {
        const latestVersion = fileHistory.find(
          (f) => f.file_change === "released",
        )?.uuid;
        setMatchedSearchList([
          {
            value: latestVersion,
            label: latestVersion,
            obj: fileHistory,
            superseded: true,
            entity: "File",
          },
        ]);
      } else {
        setMatchedSearchList(
          searchList.map((obj, i) => ({
            value: obj.id, // required by plugin
            label: obj.id, // required by plugin
            symbol: obj.symbol,
            obj: obj,
            last: searchList.length === i + 1, // for styling
          })),
        );
      }
      setLoading(false);
    }
  }, [debounced, searchList, query, fileHistory]);

  const renderItem: SelectProps["renderOption"] = ({
    option: { value, label, symbol, obj, superseded, entity, last, ...others },
  }: {
    option: ItemProps;
  }) => {
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

    const IconFormatted = ({ Icon }: { Icon: any }): JSX.Element => (
      <div className="bg-accent-cool-content-lighter rounded-full">
        <Icon className="p-1.5 w-10 h-10" aria-hidden />
      </div>
    );
    const entityForMapping = entity || atob(label).split(":")[0];
    return (
      <div
        data-testid="text-search-result"
        {...others}
        aria-label={`${badgeText}, ${matchingToken}, Category: ${entityForMapping}`}
      >
        <div className="px-4 hover:bg-primary-lightest ">
          <div
            className={`py-2 flex gap-2 ${
              last ? "" : "border-b border-gdc-grey-light"
            }`}
          >
            <div className="self-center">
              <IconFormatted Icon={entityIconMapping[entityForMapping].icon} />
            </div>
            <div className="flex flex-col leading-5">
              <div className="font-bold">{badgeText}</div>
              <span className="">
                <Highlight
                  highlight={searchText.trim()}
                  highlightStyles={{ fontStyle: "italic" }}
                  span
                  className="break-normal"
                >
                  {mainText}
                </Highlight>
              </span>
              <span className="text-base-content-dark">
                <b>Category:</b>{" "}
                {entityIconMapping[entityForMapping].category
                  ? entityIconMapping[entityForMapping].category
                  : entityForMapping}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      leftSection={
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
        dropdown:
          "bg-base-max rounded-t-none rounded-b border-0 drop-shadow-md -mt-2",
        option:
          "p-0 m-0 block data-[combobox-selected=true]:bg-primary-lightest data-[combobox-selected=true]:text-black",
      }}
      maxDropdownHeight={1000} //large number so no scroll bar
      comboboxProps={{
        position: "bottom",
        middlewares: { flip: false, shift: false },
      }}
      size="sm"
      rightSection={
        searchText.length > 0 ? (
          <CloseIcon className="cursor-pointer" aria-label="clear" />
        ) : (
          <></>
        )
      }
      rightSectionPointerEvents="all"
      renderOption={renderItem}
      data={matchedSearchList}
      searchable
      nothingFoundMessage={
        //This is so it does not show no results when loading or when user has not entered anything
        searchText.length > 0 && debounced.length > 0 && !loading ? (
          <span data-testid="no-results-quick-search-bar">
            {"No results found"}
          </span>
        ) : undefined
      }
      onSearchChange={(query) => {
        setLoading(true);
        setMatchedSearchList([]);
        setSearchText(query);
      }}
      filter={({ options }) => options}
      searchValue={searchText}
      onChange={onSelectItem}
      value="" // set to blank so that a value does not flash when making a selection before the next page loads
      onDropdownClose={() => {
        // setTimeout added to make sure this is called after onSearchChange
        setTimeout(() => {
          setLoading(false);
        }, 0);
      }}
    />
  );
};
