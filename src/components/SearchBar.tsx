
"use client"; // This component might be used on client pages

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialTerm?: string;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialTerm = '', placeholder = "Search...", className }) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full items-center space-x-2 ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" variant="default">
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </form>
  );
};

export default SearchBar;
