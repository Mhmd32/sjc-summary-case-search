import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
interface CaseData {
  id: string;
  case_id: string;
  total_documents: number;
  abstractive_summary: string;
  extractive_summary: string;
}
interface SearchResultsProps {
  results: CaseData[];
  totalCases: number;
  returnedCases: number;
  loading?: boolean;
  searchTerm?: string;
}
const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  totalCases,
  returnedCases,
  loading = false,
  searchTerm
}) => {
  if (loading) {
    return <div className="space-y-6">
        {[1, 2, 3].map(i => <Card key={i} className="p-6 shadow-card animate-pulse">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </Card>)}
      </div>;
  }
  if (results.length === 0) {
    return <Card className="p-12 text-center shadow-card">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2" dir="rtl">
      </h3>
        
      </Card>;
  }
  return <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" dir="rtl">نتائج البحث</h2>
          <p className="text-muted-foreground" dir="rtl">
            تم العثور على {totalCases} قضية {searchTerm && `لـ "${searchTerm}"`}
          </p>
        </div>
        
        <Badge variant="outline" className="bg-primary-light text-primary border-primary/30">
          {returnedCases} من {totalCases}
        </Badge>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {results.map((case_item, index) => <Card key={case_item.id} className="p-6 shadow-card hover:shadow-elegant transition-all duration-300 border-l-4 border-l-primary">
            <div className="space-y-4">
              {/* Case Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground" dir="rtl">
                      قضية رقم #{case_item.case_id}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1" dir="rtl">
                        <FileText className="h-4 w-4" />
                        {case_item.total_documents} وثيقة
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  <span dir="rtl">عرض التفاصيل</span>
                </Button>
              </div>

              {/* Abstractive Summary */}
              {case_item.abstractive_summary && <div className="bg-accent-light p-4 rounded-lg border border-accent/20">
                  <h4 className="font-medium text-accent-foreground mb-2" dir="rtl">الملخص التجريدي</h4>
                  <p className="text-sm text-foreground leading-relaxed text-right" dir="rtl">
                    {case_item.abstractive_summary}
                  </p>
                </div>}

              {/* Extractive Summary */}
              {case_item.extractive_summary && <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                  <h4 className="font-medium text-secondary-foreground mb-2" dir="rtl">النقاط الرئيسية</h4>
                  <div className="text-sm text-foreground space-y-1" dir="rtl">
                    {case_item.extractive_summary.split('\n').filter(line => line.trim()).map((point, idx) => <p key={idx} className="leading-relaxed text-right">
                        {point.replace(/^\*\s*/, '• ')}
                      </p>)}
                  </div>
                </div>}
            </div>
          </Card>)}
      </div>
    </div>;
};
export default SearchResults;