import { useState} from "react";
import SearchIcon from '@material-ui/icons/search';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

type SearchFunction = {
  (term: string): Record<string, any>;
};

interface MetaSearchProp {
  readonly handler: SearchFunction;
}

export const MetaSearch: React.FC<unknown> = () => {
  const [searchScope, setSearchScope] = useState('All');

  const handleChange = (event) => {
    setSearchScope(event.target.value);
  };


  return (
    <div className="flex flex-row items-center justify-center w-full p-2">

    <div className="bg-white flex items-center ">
      <div className="flex items-center border-1 h-2">
      <FormControl className="bg-white w-36 min-w-full">
        <Select
          disableUnderline
          value={searchScope}
          onChange={handleChange}
          displayEmpty
          className="px-2"
        >
          <MenuItem value={"All"}>All</MenuItem>
          <MenuItem value={"Clinical"}>Clinical</MenuItem>
          <MenuItem value={"Biospecimen"}>Biospecimen</MenuItem>
        </Select>
      </FormControl>
      </div>
      <div className="relative"><input type="text"
                                       className="h-10 w-96 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none"
                                       placeholder={`Search ${searchScope.toLocaleLowerCase()}...`}/>
        <div className="absolute top-2 right-3"><SearchIcon></SearchIcon>
        </div>
      </div>

    </div>
  </div>);

};

export default MetaSearch;
