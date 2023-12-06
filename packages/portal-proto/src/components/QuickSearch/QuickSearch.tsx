import { useQuickSearch } from "@gff/core";
import { Badge, Loader, Highlight, Select } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState, forwardRef } from "react";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { TypeIcon } from "../TypeIcon";
import { entityShortNameMapping } from "./entityShortNameMapping";
import { extractEntityPath, findMatchingToken } from "./utils";

export const QuickSearch = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextForApi, setSearchTextForApi] = useState("");
  const [matchedSearchList, setMatchedSearchList] = useState([]);

  const router = useRouter();

  const {
    data: { searchList, query },
  } = useQuickSearch(searchTextForApi);

  // Checks search results returned against current search to make sure it matches
  useEffect(() => {
    if (searchTextForApi === "") {
      setLoading(false);
    } else if (query === searchTextForApi) {
      setMatchedSearchList(
        searchList.map((obj) => ({
          value: obj.id, // requiered by plugin
          label: obj.id, // requiered by plugin
          symbol: obj.symbol,
          obj: obj,
        })),
      );
      setLoading(false);
    }
  }, [searchTextForApi, searchList, query]);

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    value: string;
    label: string;
    symbol?: string;
    "data-hovered": boolean;
    obj: Record<string, any>;
  }

  const renderItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ value, label, symbol, obj, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <div
          className={`flex p-2 px-4 ${
            others["data-hovered"] &&
            "bg-primary-darkest text-primary-contrast-darkest"
          }`}
        >
          <div className="self-center">
            <TypeIcon
              iconText={entityShortNameMapping[atob(label).split(":")[0]]}
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
                {symbol || atob(label).split(":")[1]}
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
                {findMatchingToken(obj, searchText.trim().toLocaleLowerCase())}
              </Highlight>
            </span>
          </div>
        </div>
      </div>
    ),
  );

  const onSelectItem = (id: string) => {
    if (!id) {
      return;
    }
    const selectedObj = matchedSearchList.find((obj) => obj.value == id).obj;
    const entityPath = extractEntityPath(selectedObj);
    // Note: for annotations we need to open v1 portal in a new tab
    if (entityPath.includes("annotations")) {
      window.open(entityPath, "_ blank");
      return;
    }
    router.push(entityPath);
    setSearchText("");
  };

  useEffect(() => {
    setMatchedSearchList([]);
    const trimedSearchText = searchText.trim();
    if (trimedSearchText.length > 0) {
      setLoading(true);
      //prevents unneeded api calls if user is typing something
      const delayDebounceFn = setTimeout(() => {
        setSearchTextForApi(trimedSearchText);
      }, 250);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchText]);

  return (
    <Select
      icon={loading ? <Loader size={24} /> : <SearchIcon size={24} />}
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
        searchText.length > 0 && searchTextForApi.length > 0 && !loading
          ? "No results found"
          : undefined
      } //This is so it does not show no results when loading or when user has not entered anything
      filter={() => true} //dont have plugin filter results
      onSearchChange={setSearchText}
      searchValue={searchText}
      onChange={onSelectItem}
      value="" // set to blank so that a value does not flash when making a selection before the next page loads
      onDropdownClose={() => {
        setLoading(false);
      }}
    />
  );
};
