import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:7072/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
}

interface CaseData {
  id: string;
  case_id: string;
  total_documents: number;
  abstractive_summary: string;
  extractive_summary: string;
}

interface SearchParams {
  search?: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    toast({
      title: "Search Error",
      description: "Failed to fetch case data. Please check your connection and try again.",
      variant: "destructive",
    });
  };

  const searchCases = useCallback(async (params: SearchParams): Promise<ApiResponse<CaseData[]> | null> => {
    setLoading(true);
    try {
      let url: string;
      
      if (params.start_date && params.end_date) {
        // Date range search
        const searchParams = new URLSearchParams({
          start_date: params.start_date,
          end_date: params.end_date,
          page: String(params.page || 1),
          page_size: String(params.page_size || 20)
        });
        url = `${API_BASE_URL}/case-summaries/date-range?${searchParams}`;
      } else if (params.search) {
        // Text search
        const searchParams = new URLSearchParams({
          search: params.search,
          page: String(params.page || 1),
          page_size: String(params.page_size || 20)
        });
        url = `${API_BASE_URL}/case-summaries/search?${searchParams}`;
      } else {
        // Get all cases
        const searchParams = new URLSearchParams({
          page: String(params.page || 1),
          page_size: String(params.page_size || 20)
        });
        url = `${API_BASE_URL}/case-summaries?${searchParams}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<CaseData[]> = await response.json();
      
      if (data.success) {
        toast({
          title: "Search completed",
          description: `Found ${data.pagination?.total_items || 0} cases`,
        });
      }
      
      return data;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getCaseById = useCallback(async (caseId: string): Promise<ApiResponse<CaseData> | null> => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/case-summaries?case_id=${encodeURIComponent(caseId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<CaseData> = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getStatistics = useCallback(async (): Promise<any> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/case-summaries/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    searchCases,
    getCaseById,
    getStatistics,
  };
};