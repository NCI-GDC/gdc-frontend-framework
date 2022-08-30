import { ChangeEvent, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { uniq } from "lodash";
import tw from "tailwind-styled-components";
import { FaCheck as CheckIcon } from "react-icons/fa";
import { Badge, Highlight, Pagination, Tooltip } from "@mantine/core";
import { search_facets } from "@/features/cohortBuilder/dictionary";

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
      <div className="flex items-center justify-between bg-white w-[400px] p-1 ring-2 rounded-sm">
        <MdSearch size="1.5em" />
        <input
          type="search"
          placeholder={`Search`}
          value={searchTerm}
          onChange={onSearchChanged}
          className="border-none ring-0 grow-1 w-full"
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

      {searchResults.length > 1 && (
        <div className="absolute z-10 bg-white w-[400px] p-4 drop-shadow-md">
          <P>Related Categories</P>
          <div className="flex flex-wrap gap-1 my-2">
            {uniq(searchResults.map((result) => result.subcategory)).map(
              (subcat) => {
                const selected = filteredCategories.includes(subcat);
                return (
                  <Badge
                    color="white"
                    onClick={() =>
                      selected
                        ? setFilteredCategories(
                            filteredCategories.filter((c) => c !== subcat),
                          )
                        : setFilteredCategories([...filteredCategories, subcat])
                    }
                    leftSection={selected ? <CheckIcon /> : undefined}
                    className={
                      selected
                        ? "text-white bg-nci-blue-darkest capitalize text-sm font-normal"
                        : "text-nci-blue border-solid border-nci-blue capitalize text-sm font-normal"
                    }
                  >
                    {subcat}
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
            out of {filteredResults.length} for <b>{searchTerm}</b>
          </P>
          <ul className="mb-4">
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
                        tooltip: "text-black drop-shadow-md rounded-none",
                      }}
                      offset={17}
                    >
                      <DivWithHoverCallout>
                        <div className="p-2 leading-5">
                          <b>
                            <Highlight highlight={result.terms}>
                              {result.name}
                            </Highlight>
                          </b>
                          <span className="text-nci-gray">
                            <b>Category:</b> {result.subcategory}
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
        </div>
      )}
    </>
  );
};

export default SearchInput;
