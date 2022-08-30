import { ChangeEvent, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { uniq } from "lodash";
import { Badge, Highlight, Pagination, Tooltip } from "@mantine/core";
import { search_facets } from "@/features/cohortBuilder/dictionary";

const PAGE_SIZE = 5;

export const SearchInput: React.FC = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm("");
  };

  const onSearchChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    const results = search_facets(e.target.value);
    if (results.length == 0) {
      setSearchResults([]);
    } else {
      setSearchResults(results);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filteredCategories]);

  console.log(searchResults);

  const filteredResults = searchResults.filter(
    (result) =>
      filteredCategories.length === 0 ||
      filteredCategories.includes(result.subcategory),
  );

  return (
    <>
      <div className="flex items-center justify-between bg-white w-80 p-2 ring-2">
        <MdSearch size="1.5em" />
        <input
          type="search"
          placeholder={`Search`}
          value={searchTerm}
          onChange={onSearchChanged}
          className="border-none ring-0 grow-1 w-full"
        />
        {searchTerm.length > 0 && (
          <span onClick={() => clearSearch()} className="text-xs grow-0">
            Clear
          </span>
        )}
      </div>

      {searchResults.length > 1 && (
        <div className="absolute z-10 bg-white w-80 p-2 drop-shadow-md">
          <div className="flex flex-wrap gap-1 mb-2">
            {uniq(searchResults.map((result) => result.subcategory)).map(
              (subcat) => (
                <Badge
                  color="white"
                  onClick={() =>
                    filteredCategories.includes(subcat)
                      ? setFilteredCategories(
                          filteredCategories.filter((c) => c !== subcat),
                        )
                      : setFilteredCategories([...filteredCategories, subcat])
                  }
                  className={
                    filteredCategories.includes(subcat)
                      ? "text-white bg-nci-blue-darkest"
                      : "text-nci-blue border-solid border-nci-blue"
                  }
                >
                  {subcat}
                </Badge>
              ),
            )}
          </div>
          <p className="uppercase text-nci-gray">
            Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
            {page * PAGE_SIZE > filteredResults.length
              ? filteredResults.length
              : page * PAGE_SIZE}{" "}
            out of {filteredResults.length} for <b>{searchTerm}</b>
          </p>
          <ul className="ml-8 mb-4">
            {filteredResults
              .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
              .map((result) => {
                const matchingEnums = result.enum.filter((e) =>
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
                          {matchingEnums.length > 0 && (
                            <>
                              <br />
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
                        tooltip: "text-black drop-shadow-md",
                      }}
                      offset={25}
                    >
                      <div className="hover:bg-nci-blue-lightest">
                        <b>
                          <Highlight highlight={result.terms}>
                            {result.name}
                          </Highlight>
                        </b>
                        <b>Category:</b> {result.subcategory}
                      </div>
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
        </div>
      )}
    </>
  );
};

export default SearchInput;
