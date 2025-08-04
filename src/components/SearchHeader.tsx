import React from 'react';
import { Search, Scale, FileText } from 'lucide-react';

const SearchHeader: React.FC = () => {
  return (
    <div className="text-center py-12 bg-gradient-to-br from-primary-light to-accent-light rounded-2xl mb-8 shadow-elegant">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary/10 p-4 rounded-full mr-4">
          <Scale className="h-8 w-8 text-primary" />
        </div>
        <div className="bg-accent/10 p-4 rounded-full">
          <FileText className="h-8 w-8 text-accent-foreground" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Legal Case Search Portal
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
        Professional search interface for legal case summaries with advanced voice recognition capabilities
      </p>
      
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Advanced Search</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Case Summaries</span>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          <span>Legal Documentation</span>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;