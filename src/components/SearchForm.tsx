import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Calendar, Filter } from 'lucide-react';
import VoiceSearch from './VoiceSearch';

interface SearchFormProps {
  onSearch: (searchTerm: string, dateRange?: { start: string; end: string }) => void;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
    onSearch(searchTerm.trim(), dateRange);
  };

  const handleVoiceSearchUpdate = (voiceSearchTerm: string) => {
    setSearchTerm(voiceSearchTerm);
    // Auto-submit voice search
    setTimeout(() => {
      const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
      onSearch(voiceSearchTerm.trim(), dateRange);
    }, 500);
  };

  return (
    <Card className="p-8 shadow-floating bg-card border-0 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Search Bar */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search case summaries, legal documents, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg bg-background border-border focus:ring-primary focus:border-primary shadow-card"
                disabled={loading}
              />
            </div>
            
            <VoiceSearch
              onSearchUpdate={handleVoiceSearchUpdate}
              isListening={isVoiceListening}
              onListeningChange={setIsVoiceListening}
            />
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowDateRange(!showDateRange)}
              className="h-14 w-14"
              title="Date range filter"
            >
              <Calendar className="h-5 w-5" />
            </Button>
            
            <Button
              type="submit"
              variant="professional"
              size="xl"
              disabled={loading || !searchTerm.trim()}
              className="px-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        {showDateRange && (
          <div className="animate-slide-up bg-secondary/30 p-6 rounded-xl border border-border">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Date Range Filter</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background border-border shadow-card"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background border-border shadow-card"
                />
              </div>
            </div>
            
            {startDate && endDate && (
              <div className="mt-4 p-3 bg-primary-light rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  Searching cases from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Voice Search Status */}
        {isVoiceListening && (
          <div className="animate-fade-in bg-accent-light p-4 rounded-xl border border-accent/30">
            <div className="flex items-center gap-3">
              <div className="animate-pulse-gentle bg-accent rounded-full p-2">
                <Search className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-accent-foreground">Voice search active</p>
                <p className="text-sm text-muted-foreground">Speak clearly to search for cases...</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default SearchForm;