import { useState } from "react";
import { MdSearch } from 'react-icons/md'
import Select from "react-select";

type SearchFunction = {
  (term: string): Record<string, any>;
};

interface MetaSearchProp {
  readonly handler: SearchFunction;
  readonly onChange: (string) => void;
}

const searchCategories = [
  { value: "All", label: "All" },
  { value: "Clinical", label: "Clinical" },
  { value: "Biospecimen", label: "Biospecimen" },
  { value: "Molecular", label: "Molecular" },
  { value: "Files", label: "Files" },
];

export const MetaSearch: React.FC<MetaSearchProp> = ({ onChange } ) => {
  const [searchScope, setSearchScope] = useState(searchCategories[0]);

  const handleChange = (value) => {
    setSearchScope(value);
  };

  return (
    <div className="flex flex-row items-center justify-center w-full p-2">
      <div className="bg-white flex items-center ">
        <div className="flex items-center border-1 h-2">
          <Select
            components={{
              IndicatorSeparator: () => null
            }}
            inputId="cohort-manager__meta_search"
            options={searchCategories}
            defaultValue={searchCategories[0]}
            className="border-nci-gray-light w-36"
            onChange={handleChange}
          />
        </div>
        <div className="relative"><input type="text"
                                         className="h-10 w-96 pr-8 pl-5 border-nci-gray-light rounded-r-full z-0 focus:shadow focus:outline-none"
                                         placeholder={`Search ${searchScope.label.toLocaleLowerCase()}...`}
                                         onChange={(e) => {onChange ( e.target.value)}}/>
          <div className="absolute top-2 right-3 h-4" ><MdSearch size="1.5em"/>
          </div>
        </div>

      </div>
    </div>);

};

export default MetaSearch;
