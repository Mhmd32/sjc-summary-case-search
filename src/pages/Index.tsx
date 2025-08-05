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

  const { loading, searchCases } = useApi();

  const handleSearch = async (searchTerm: string) => {
    setCurrentSearch(searchTerm);
    
    const searchParams = {
      search: searchTerm || undefined,
      offset: 0,
      limit: 20,
    };

    const response = await searchCases(searchParams);
    
    if (response) {
      setResults(response.case_summaries);
      setTotalCases(response.total_cases);
      setReturnedCases(response.returned_cases);
    }
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
        />
      </div>
    </div>
  );
};

export default Index;
