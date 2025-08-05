import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'http://localhost:7071/api';

interface ApiResponse {
  total_cases: number;
  returned_cases: number;
  offset: number;
  limit: number;
  case_summaries: CaseData[];
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
  offset?: number;
  limit?: number;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    toast({
      title: "خطأ في البحث",
      description: "فشل في جلب بيانات القضايا. يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
      variant: "destructive",
    });
  };

  const searchCases = useCallback(async (params: SearchParams): Promise<ApiResponse | null> => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      
      if (params.search) {
        searchParams.append('search', params.search);
      }
      if (params.offset) {
        searchParams.append('offset', String(params.offset));
      }
      if (params.limit) {
        searchParams.append('limit', String(params.limit));
      }
      
      const url = `${API_BASE_URL}/case_summaries${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      toast({
        title: "تم البحث بنجاح",
        description: `تم العثور على ${data.total_cases} قضية`,
      });
      
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
  };
};