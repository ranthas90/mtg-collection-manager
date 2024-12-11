import { Search } from "lucide-react";
import { Input } from "./Input";

const SearchInput = ({ onChangeHandler, placeholder = "Search..." }) => {
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default SearchInput;
