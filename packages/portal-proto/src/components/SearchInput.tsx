import { ChangeEvent, useEffect, useState } from "react";
import { uniq, debounce } from "lodash";
import tw from "tailwind-styled-components";
import { Badge, Highlight, Pagination, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { MdSearch } from "react-icons/md";
import { FaCheck as CheckIcon } from "react-icons/fa";
import { useFacetSearch } from "@/features/cohortBuilder/dictionary";
import { useRouter } from "next/router";

const PAGE_SIZE = 5;
const DivWithHoverCallout = tw.div`
  flex
  items-center
  hover:bg-nci-blue-lightest
  hover:before:w-0
  hover:before:h-0
  hover:before:absolute
  hover:before:left-2
  hover:before:border-t-[10px]
  hover:before:border-t-solid
  hover:before:border-t-transparent
  hover:before:border-b-[10px]
  hover:before:border-b-solid
  hover:before:border-b-transparent
  hover:before:border-r-[10px]
  hover:before:border-r-solid
  hover:before:border-r-nci-blue-lightest
`;

const P = tw.p`
  uppercase
  text-nci-gray
  text-sm
`;

export const SearchInput: React.FC = () => {
  const [searchResults, setSearchResults] = useState([]);
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

    const results = searchFacets(e.target.value);
    if (results.length == 0) {
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

  const filteredResults = searchResults.filter(
    (result) =>
      filteredCategories.length === 0 ||
      filteredCategories.includes(result.category),
  );

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between bg-white w-[400px] p-1 ring-2 rounded-sm">
        <MdSearch size="1.5em" />
        <input
          type="search"
          placeholder={`Search`}
          value={searchTerm}
          onChange={onSearchChanged}
          className="border-none ring-0 grow-1 w-full"
          onFocus={() => setDropdownOpen(searchTerm.length > 0)}
        />
        {searchTerm.length > 0 && (
          <span
            onClick={() => clearSearch()}
            className="text-xs grow-0 mr-1 cursor-pointer"
          >
            Clear
          </span>
        )}
      </div>

      {dropdownOpen && (
        <div className="absolute z-10 bg-white w-[400px] p-4 drop-shadow-md">
          {searchResults.length === 0 ? (
            <P>
              No results for <i>{searchTerm}</i>
            </P>
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
                            ? "text-white bg-nci-blue-darkest capitalize text-sm font-normal"
                            : "text-nci-blue border-solid border-nci-blue capitalize text-sm font-normal"
                        }
                        color="white"
                        onClick={() =>
                          selected
                            ? setFilteredCategories(
                                filteredCategories.filter((c) => c !== cat),
                              )
                            : setFilteredCategories([
                                ...filteredCategories,
                                cat,
                              ])
                        }
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
                    return (
                      <li className="cursor-pointer" key={result.id}>
                        <Tooltip
                          label={
                            <>
                              <Highlight highlight={result.terms}>
                                {result.description}
                              </Highlight>
                              {result.description &&
                                matchingEnums.length > 0 && <br />}
                              {matchingEnums.length > 0 && (
                                <>
                                  <b>Values Matched: </b>
                                  <Highlight highlight={result.terms}>
                                    {matchingEnums.join(" • ")}
                                  </Highlight>
                                </>
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
                          <DivWithHoverCallout>
                            <div
                              className="p-2 leading-5"
                              onClick={() =>
                                router.push({
                                  query: {
                                    ...router.query,
                                    tab: result.categoryKey,
                                  },
                                  hash: result.id,
                                })
                              }
                            >
                              <b>
                                <Highlight highlight={result.terms}>
                                  {result.name}
                                </Highlight>
                              </b>
                              <span className="text-nci-gray">
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
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
