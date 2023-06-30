import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { uniq } from "lodash";
import tw from "tailwind-styled-components";
import { Badge, Highlight, Pagination, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { MdSearch } from "react-icons/md";
import { FaCheck as CheckIcon } from "react-icons/fa";
import { SearchResult } from "minisearch";
import {
  FacetSearchDocument,
  useFacetSearch,
} from "@/features/cohortBuilder/dictionary";
import { createKeyboardAccessibleFunction } from "src/utils";
import DivWithHoverCallout from "./DivWithHoverCallout";

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
  const ref = useClickOutside(() => setDropdownOpen(false));

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
  };

  const toggleCategory = (selected: boolean, cat: string) => {
    if (selected) {
      setFilteredCategories(filteredCategories.filter((c) => c !== cat));
    } else {
      setFilteredCategories([...filteredCategories, cat]);
    }
  };

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between bg-base-max w-[400px] p-1 focus:outline-2 rounded-sm border-1">
        <MdSearch size="1.5em" />
        <input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={onSearchChanged}
          className="border-none focus:outline-0 grow-1 w-full"
          onFocus={() => setDropdownOpen(searchTerm.length > 0)}
        />
        {searchTerm.length > 0 && (
          <span
            role="button"
            tabIndex={0}
            onClick={() => clearSearch()}
            onKeyDown={createKeyboardAccessibleFunction(clearSearch)}
            className="text-xs grow-0 mr-1 cursor-pointer"
          >
            Clear
          </span>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute z-10 bg-base-max w-[400px] p-4 drop-shadow-md">
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
              <P>Related Categories</P>
              <div className="flex flex-wrap gap-1 my-2">
                {uniq(searchResults.map((result) => result.category)).map(
                  (cat) => {
                    const selected = filteredCategories.includes(cat);
                    return (
                      <Badge
                        className={
                          selected
                            ? "text-white bg-primary-dark capitalize text-sm font-normal hover: "
                            : "text-primary-dark border-solid border-primary-dark capitalize text-sm font-normal hover:text-white hover:bg-primary-dark"
                        }
                        color="white"
                        tabIndex={0}
                        onClick={() => toggleCategory(selected, cat)}
                        onKeyDown={createKeyboardAccessibleFunction(() =>
                          toggleCategory(selected, cat),
                        )}
                        leftSection={selected ? <CheckIcon /> : undefined}
                        key={cat}
                      >
                        {cat}
                      </Badge>
                    );
                  },
                )}
              </div>
              <P>
                Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                {page * PAGE_SIZE > filteredResults.length
                  ? filteredResults.length
                  : page * PAGE_SIZE}{" "}
                out of {filteredResults.length} for: <b>{searchTerm}</b>
              </P>
              <ul className="mb-4">
                {filteredResults
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((result) => {
                    const matchingEnums = result?.enum.filter((e) =>
                      result.terms.some((t) => e.toLowerCase().includes(t)),
                    );
                    const showTooltip =
                      result.description !== "" || matchingEnums.length > 0;
                    return (
                      <li className="cursor-pointer" key={result.id}>
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
                        >
                          <DivWithHoverCallout
                            role="button"
                            tabIndex={0}
                            onClick={() => clickResult(result)}
                            onKeyPress={createKeyboardAccessibleFunction(() =>
                              clickResult(result),
                            )}
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
                          </DivWithHoverCallout>
                        </Tooltip>
                        <hr />
                      </li>
                    );
                  })}
              </ul>
              <Pagination
                page={page}
                onChange={setPage}
                total={Math.ceil(filteredResults.length / PAGE_SIZE)}
                withEdges
                siblings={0}
                color={"primary"}
                classNames={{
                  item: "border-0",
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
