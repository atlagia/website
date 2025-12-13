import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  apiEndpoint: string;
  lang: string;
  placeholder: {
    [key: string]: string;
  };
  searchStyles?: {
    icon?: string;
    button?: string;
    form?: string;
    input?: string;
  };
}

export default function Search({ apiEndpoint, lang, placeholder, searchStyles }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/${lang}/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={searchStyles?.button || "p-2 hover:bg-gray-100 rounded-full"}
        aria-label="Search"
      >
        <SearchIcon size={20} className={searchStyles?.icon || "text-gray-700"} />
      </button>

      {isOpen && (
        <form
          onSubmit={handleSearch}
          className={searchStyles?.form || "absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50"}
        >
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder[lang] || placeholder['en']}
            className={searchStyles?.input || "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"}
          />
        </form>
      )}
    </div>
  );
}