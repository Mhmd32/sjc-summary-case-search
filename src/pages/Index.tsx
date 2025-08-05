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


const Index = () => {
  const [results, setResults] = useState<CaseData[]>([]);
  const [totalCases, setTotalCases] = useState(0);
  const [returnedCases, setReturnedCases] = useState(0);
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { loading, searchCases } = useApi();

  const handleSearch = async (searchTerm: string, page: number = 1) => {
    setCurrentSearch(searchTerm);
    setCurrentPage(page);
    
    const searchParams = {
      search: searchTerm || undefined,
      offset: (page - 1) * 10,
      limit: 10,
    };

    const response = await searchCases(searchParams);
    
    if (response) {
      setResults(response.case_summaries);
      setTotalCases(response.total_cases);
      setReturnedCases(response.returned_cases);
      setTotalPages(Math.ceil(response.total_cases / 10));
    }
  };

  const handlePageChange = (page: number) => {
    handleSearch(currentSearch, page);
  };

  // Load initial data
  React.useEffect(() => {
    handleSearch('');
  }, []);

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
          totalCases={totalCases}
          returnedCases={returnedCases}
          loading={loading}
          searchTerm={currentSearch}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Index;
