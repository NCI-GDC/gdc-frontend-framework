import { useState } from "react";
import { MdSearch, MdArrowForward, MdClear } from "react-icons/md";
import { search_facets } from "@/features/cohortBuilder/dictionary";

export const SearchInput: React.FC = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm("");
  };

  const onSearchChanged = (e) => {
    setSearchTerm(e.target.value);

    const results = search_facets(e.target.value);
    if (results.length == 0) {
      setSearchResults([]);
    } else {
      const searchRes = results.map((x) => {
        return (({ category, subcategory, name }) => ({
          category,
          subcategory,
          name,
        }))(x);
      });
      setSearchResults(searchRes);
    }
  };

  return (
    <div className="flex flex-col items-center relative z-10">
      <div className="flex flex-row items-center justify-end w-full p-2">
        <div className="bg-none flex items-center w-1/2 ">
          <div className="relative w-full ">
            <div className="absolute top-2 right-3 h-4">
              {searchTerm.length == 0 ? (
                <MdSearch size="1.5em" />
              ) : (
                <MdClear size="1.5em" onClick={() => clearSearch()} />
              )}
            </div>
            <input
              type="text"
              className="h-10 pr-8 w-full pl-5  shadow-md  border-primary-light rounded-sm focus:ring-primary-light focus:border-primary-light hover:shadow-lg hover:border-primary-lighter"
              placeholder={`Search ...`}
              value={searchTerm}
              onChange={onSearchChanged}
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          searchResults.length == 0 ? "hidden" : ""
        } flex-col border-2 mt-14 absolute z-20 bg-primary-lightest w-1/2 m-16 py-4 px-1 drop-shadow ${
          searchResults.length > 6 ? "h-48 overflow-y-auto" : ""
        } `}
      >
        <div className="w-full border-b-2 border-base ">
          {searchResults.length}{" "}
          {searchResults.length === 1 ? "result" : "results"} found for{" "}
          <em>{searchTerm}</em>:
        </div>
        {searchResults.map((x, index) => {
          return (
            <div
              key={`${x.name}_${index}`}
              className="flex flex-row items-center hover:bg-primary-lighter px-4"
            >
              {x.category}
              <MdArrowForward size="1.0em" /> {x.subcategory}
              <MdArrowForward size="1.0em" /> {x.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchInput;
