import React, { useState } from 'react';
import SearchHeader from '@/components/SearchHeader';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import { useApi } from '@/hooks/useApi';

interface CaseData {
  id: string;
  case_id: string;
  total_documents: number;
  abstractive_summary: string;
  extractive_summary: string;
}

interface PaginationData {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

const Index = () => {
  const [results, setResults] = useState<CaseData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    page_size: 20,
    total_items: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });
  const [currentSearch, setCurrentSearch] = useState<{
    searchTerm?: string;
    dateRange?: { start: string; end: string };
  }>({});

  const { loading, searchCases } = useApi();

  const handleSearch = async (
    searchTerm: string, 
    dateRange?: { start: string; end: string }
  ) => {
    setCurrentSearch({ searchTerm, dateRange });
    
    const searchParams = {
      search: searchTerm,
      start_date: dateRange?.start,
      end_date: dateRange?.end,
      page: 1,
      page_size: 20,
    };

    const response = await searchCases(searchParams);
    
    if (response && response.success) {
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    }
  };

  const handlePageChange = async (page: number) => {
    const searchParams = {
      search: currentSearch.searchTerm,
      start_date: currentSearch.dateRange?.start,
      end_date: currentSearch.dateRange?.end,
      page,
      page_size: 20,
    };

    const response = await searchCases(searchParams);
    
    if (response && response.success) {
      setResults(Array.isArray(response.data) ? response.data : [response.data]);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <SearchHeader />
        
        <SearchForm 
          onSearch={handleSearch}
          loading={loading}
        />
        
        <SearchResults
          results={results}
          pagination={pagination}
          loading={loading}
          onPageChange={handlePageChange}
          searchTerm={currentSearch.searchTerm}
        />
      </div>
    </div>
  );
};

export default Index;
