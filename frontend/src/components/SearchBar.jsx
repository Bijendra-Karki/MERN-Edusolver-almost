import React, { useState } from "react";
import { Search, X } from 'lucide-react';

function SearchBar({ placeholder = "Search...", onSearch, className = "" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <div 
        className={`
          flex items-center bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden 
          h-10 sm:h-12 transition-all duration-200
          ${isFocused ? 'ring-2 ring-blue-400 shadow-lg' : 'hover:shadow-lg'}
        `}
      >
        <div className="px-2 sm:px-3 text-gray-500 h-full flex items-center justify-center">
         
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            flex-1 px-2 py-2 text-gray-700 focus:outline-none 
            text-sm sm:text-base h-full bg-transparent
            placeholder:text-gray-400
          "
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="
              px-2 sm:px-3 text-gray-400 hover:text-gray-600 
              h-full flex items-center justify-center
              transition-colors duration-200
            "
            aria-label="Clear search"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        
        <button
          type="submit"
          className="
            px-2 sm:px-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50
            h-full flex items-center justify-center
            transition-all duration-200 border-l border-gray-200
          "
          aria-label="Search"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;