import { useState } from "react";
import { MdSearch } from 'react-icons/md'
import Select from "react-select";
import { search_facets } from "./dictionary";

type SearchFunction = {
  (term: string): Record<string, any>;
};

interface MetaSearchProp {
  readonly onChange: (any) => void;
}


export const MetaSearch: React.FC<MetaSearchProp> = ({ onChange } : MetaSearchProp ) => {

  const onSearchChanged = (e) => {
    const results = search_facets(e.target.value);
    onChange(results);
  }

  return (
    <div className="flex flex-row items-center justify-center w-full p-2">
      <div className="bg-white flex items-center ">
        <div className="relative"><input type="text"
                                         className="h-10 w-96 pr-8 pl-5 border-nci-gray-light rounded-full z-0 focus:shadow focus:outline-none"
                                         placeholder={`Search ...`}
                                         onChange={onSearchChanged}/>
          <div className="absolute top-2 right-3 h-4" ><MdSearch size="1.5em"/>
          </div>
        </div>

      </div>
    </div>);

};

export default MetaSearch;
