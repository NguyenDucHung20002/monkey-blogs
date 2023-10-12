import { createContext, useContext, useState } from "react";

const SearchMainContext = createContext();

function SearchMainProvider() {
  const [searchMain, setSearchMain] = useState("");
  const value = { searchMain, setSearchMain };
  return (
    <SearchMainContext.Provider value={value}></SearchMainContext.Provider>
  );
}

function useSearchMain() {
  const context = useContext(SearchMainContext);
  if (typeof context === "undefined")
    throw new Error("useSearchMain must be used within SearchMainProvider");
  return context;
}

export { SearchMainProvider, useSearchMain };
