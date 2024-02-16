import React, {
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
  useId,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { uniq } from "lodash";
import tw from "tailwind-styled-components";
import {
  Badge,
  Highlight,
  Pagination,
  TextInput,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import { MdSearch as SearchIcon, MdClose as CloseIcon } from "react-icons/md";
import { FaCheck as CheckIcon } from "react-icons/fa";
import { SearchResult } from "minisearch";
import {
  FacetSearchDocument,
  useFacetSearch,
} from "@/features/cohortBuilder/dictionary";
import BtnWithHoverCallout from "./BtnWithHoverCallout";

const PAGE_SIZE = 5;

const P = tw.p`
  uppercase
  text-base
  text-sm
`;

type FullResult = SearchResult & FacetSearchDocument;

export const SearchInput: React.FC = () => {
  const [searchResults, setSearchResults] = useState<FullResult[]>([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { ref } = useFocusWithin({
    onBlur: () => {
      setDropdownOpen(false);
      setActivedescendant(undefined);
    },
  });

  const miniSearch = useFacetSearch();

  const searchFacets = (s: string) => {
    return miniSearch.search(s, {
      prefix: true,
      combineWith: "AND",
    });
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm("");
    setFilteredCategories([]);
  };

  const onSearchChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilteredCategories([]);

    const results = searchFacets(e.target.value) as FullResult[];
    if (results.length === 0) {
      setSearchResults([]);
    } else {
      setSearchResults(results);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filteredCategories]);

  useEffect(() => {
    setDropdownOpen(searchTerm.length > 0);
  }, [searchTerm]);

  const filteredResults = useMemo(
    () =>
      searchResults.filter(
        (result) =>
          filteredCategories.length === 0 ||
          filteredCategories.includes(result.category),
      ),
    [filteredCategories, searchResults],
  );

  const clickResult = (result: FullResult) => {
    router.push({
      query: {
        ...router?.query,
        tab: result.categoryKey,
      },
      hash: result.id,
    });
    setDropdownOpen(false);
    setActivedescendant(undefined);
  };

  const toggleCategory = (selected: boolean, cat: string) => {
    if (selected) {
      setFilteredCategories(filteredCategories.filter((c) => c !== cat));
    } else {
      setFilteredCategories([...filteredCategories, cat]);
    }
  };
  const id = useId();
  const comboboxId = `${id}-combobox`;
  const comboboxlistId = `${id}-combobox-list`;
  const comboboxItemId = `${id}-item-`;
  const textInputRef = useRef(null);
  const selectedItemRef = useRef(null);
  const [activedescendant, setActivedescendant] = useState(undefined);

  const menuKeybordNav = (e: React.KeyboardEvent<any>) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        //If the grid is displayed, closes it
        if (dropdownOpen) {
          setDropdownOpen(false);
          setActivedescendant(undefined);
          //Sets visual focus on the textbox
          textInputRef.current.focus();
        } else {
          //If the grid is not displayed, clears the textbox
          setSearchTerm("");
        }
        break;
      case "Enter":
        //Exclude tabbed items
        if (!selectedItemRef.current) {
          break;
        }
        //Sets the textbox value to the content of the first cell in the row containing focus.
        selectedItemRef.current.click();
        setActivedescendant(undefined);
        //Closes the grid popup. happens automaticly
        //Sets focus on the textbox. should already be there
        break;
      case "ArrowRight":
      case "ArrowDown":
        //If the grid is displayed, moves focus to the first suggested value.
        if (dropdownOpen && filteredResults.length > 0) {
          e.preventDefault();
          textInputRef.current.focus(); // make sure focus is on search bar
          //figure out what to select

          // if more items select next item
          if (
            typeof activedescendant === "undefined" ||
            activedescendant + 2 + (page - 1) * PAGE_SIZE >
              filteredResults.length
          ) {
            // if on last page go back to beginning
            setPage(1);
            // if at end of list go back to beginning
            setActivedescendant(0);
          } else {
            //if at end of page go to next page
            if (activedescendant + 2 > PAGE_SIZE) {
              setPage(page + 1);
              setActivedescendant(0);
            } else {
              setActivedescendant(activedescendant + 1);
            }
          }
        }
        break;
      case "ArrowLeft":
      case "ArrowUp":
        // If the grid is displayed, moves focus to the last suggested value
        if (dropdownOpen && filteredResults.length > 0) {
          e.preventDefault();
          textInputRef.current.focus(); // make sure focus is on search bar
          //figure out what to select

          // if previous items select previous item
          if (
            typeof activedescendant === "undefined" ||
            (page === 1 && activedescendant === 0)
          ) {
            // moves focus to the last suggested page
            setPage(Math.ceil(filteredResults.length / PAGE_SIZE));
            // moves focus to the last suggested value
            setActivedescendant((filteredResults.length - 1) % PAGE_SIZE);
          } else {
            //if at start of page go to previous page
            if (activedescendant === 0) {
              setPage(page - 1);
              setActivedescendant(PAGE_SIZE - 1);
            } else {
              setActivedescendant(activedescendant - 1);
            }
          }
        }

        break;
      case "Home":
        //Moves focus to the textbox and places the editing cursor at the beginning of the field
        setActivedescendant(undefined);
        break;
      case "End":
        //Moves focus to the textbox and places the editing cursor at the end of the field
        setActivedescendant(undefined);
        break;
      default:
        //Moves focus to the textbox.
        //Types the character in the textbox.
        setActivedescendant(undefined);
    }
  };

  return (
    <div ref={ref} className="relative">
      <TextInput
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="grid"
        aria-expanded={dropdownOpen}
        aria-controls={comboboxId}
        aria-activedescendant={
          typeof activedescendant === "undefined"
            ? null
            : `${comboboxItemId}${activedescendant}`
        }
        icon={<SearchIcon size={24} aria-hidden="true" />}
        placeholder="Search"
        data-testid="textbox-cohort-builder-search-bar"
        aria-label="App Search Input"
        value={searchTerm}
        onChange={onSearchChanged}
        onFocus={() => setDropdownOpen(searchTerm.length > 0)}
        onKeyDown={menuKeybordNav}
        classNames={{
          root: "w-[25rem]",
          input: "focus:border-2 focus:border-primary text-sm",
        }}
        size="sm"
        rightSection={
          searchTerm.length > 0 && (
            <ActionIcon
              onClick={() => {
                clearSearch();
                ref.current.focus();
              }}
              data-testid="search-input-clear-search"
            >
              <CloseIcon aria-label="clear search" />
            </ActionIcon>
          )
        }
        ref={textInputRef}
      />
      {dropdownOpen && (
        <div
          className="absolute z-10 bg-base-max w-[400px] p-4 drop-shadow-md"
          id={comboboxId}
          onKeyDown={menuKeybordNav}
          role="grid"
          tabIndex={-1}
        >
          {searchResults.length === 0 ? (
            <p
              className="text-base text-sm"
              data-testid="cohort-builder-search-no-results"
            >
              No results for{" "}
              <b>
                <i>{searchTerm}</i>
              </b>
            </p>
          ) : (
            <>
              <div
                role="group"
                data-testid="text-filter-results-by-related-categories"
                aria-label="Filter Results by Related Categories"
                aria-controls={comboboxlistId}
              >
                <P>Related Categories</P>
                <ul className="flex flex-wrap gap-x-1 my-2">
                  {uniq(searchResults.map((result) => result.category)).map(
                    (cat) => {
                      const selected = filteredCategories.includes(cat);
                      return (
                        <li key={cat}>
                          <button
                            onClick={() => toggleCategory(selected, cat)}
                            aria-checked={selected}
                            role="checkbox"
                          >
                            <Badge
                              className={`cursor-pointer capitalize text-sm font-normal ${
                                selected
                                  ? "text-white bg-primary-dark hover: "
                                  : "text-primary-dark border-solid border-primary-dark hover:text-white hover:bg-primary-dark"
                              }`}
                              color="white"
                              leftSection={selected ? <CheckIcon /> : undefined}
                            >
                              {cat}
                            </Badge>
                          </button>
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
              <P>
                Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                {page * PAGE_SIZE > filteredResults.length
                  ? filteredResults.length
                  : page * PAGE_SIZE}{" "}
                out of {filteredResults.length} for: <b>{searchTerm}</b>
              </P>

              <ul className="mb-4" id={comboboxlistId}>
                {filteredResults
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((result, index) => {
                    const matchingEnums = result?.enum.filter((e) =>
                      result.terms.some((t) => e.toLowerCase().includes(t)),
                    );
                    const showTooltip =
                      result.description !== "" || matchingEnums.length > 0;
                    const extraAttributes =
                      activedescendant === index
                        ? {
                            $focus: true,
                            "aria-selected": true,
                            ref: selectedItemRef,
                          }
                        : {};
                    return (
                      <li
                        data-testid="text-search-result"
                        className="cursor-pointer"
                        key={result.id}
                      >
                        <Tooltip
                          events={{
                            hover: showTooltip,
                            focus: showTooltip,
                            touch: false,
                          }}
                          label={
                            <>
                              <Highlight
                                highlight={searchTerm}
                                highlightStyles={{ fontStyle: "italic" }}
                              >
                                {result.description}
                              </Highlight>
                              {result.description &&
                                matchingEnums.length > 0 && <br />}
                              {matchingEnums.length > 0 && (
                                <div data-testid="cohort-builder-search-matching-values">
                                  <b>Values Matched: </b>
                                  <Highlight
                                    highlight={searchTerm}
                                    highlightStyles={{ fontStyle: "italic" }}
                                  >
                                    {matchingEnums.join(" • ")}
                                  </Highlight>
                                </div>
                              )}
                            </>
                          }
                          multiline
                          position="left-start"
                          width={400}
                          color="white"
                          classNames={{
                            tooltip: "text-black drop-shadow-md rounded-none",
                          }}
                          offset={17}
                          opened={
                            showTooltip && activedescendant === index
                              ? true
                              : undefined
                          } // this is to preserve default mouse behavior
                        >
                          <BtnWithHoverCallout
                            tabIndex={-1}
                            onClick={() => clickResult(result)}
                            id={`${comboboxItemId}${index}`}
                            {...extraAttributes}
                            aria-label={`${result.name} Category: ${result.category}`}
                          >
                            <div className="p-2 leading-5">
                              <b>
                                <Highlight
                                  highlight={searchTerm}
                                  highlightStyles={{ fontStyle: "italic" }}
                                >
                                  {result.name}
                                </Highlight>
                              </b>
                              <span className="text-base-content-dark">
                                <b>Category:</b> {result.category}
                              </span>
                            </div>
                          </BtnWithHoverCallout>
                        </Tooltip>
                        <hr />
                      </li>
                    );
                  })}
              </ul>
              <Pagination
                data-testid="pagination"
                color="accent.5"
                className="ml-auto justify-center"
                value={page}
                onChange={setPage}
                total={Math.ceil(filteredResults.length / PAGE_SIZE)}
                size="sm"
                radius="xs"
                withEdges
                siblings={0}
                classNames={{ control: "border-0" }}
                getItemProps={() => ({ tabIndex: "-1" })}
                getControlProps={() => ({ tabIndex: "-1" })}
                aria-hidden
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
