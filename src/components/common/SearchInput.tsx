'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchInput({ className }: { className?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // For now, we'll just log. A real implementation would navigate to a search results page.
      // router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      console.log('Searching for:', searchTerm.trim());
      // toast({ title: "Search", description: `Searching for: ${searchTerm.trim()}` });
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center w-full max-w-sm ${className}`}>
      <Input
        type="search"
        placeholder="Search market insights (e.g. Nifty)"
        className="pr-10 h-10 rounded-md border-input focus:border-primary"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search market insights"
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary">
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
