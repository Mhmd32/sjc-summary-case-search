import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import VoiceSearch from './VoiceSearch';

interface SearchFormProps {
  onSearch: (searchTerm: string) => void;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleVoiceSearchUpdate = (voiceSearchTerm: string) => {
    setSearchTerm(voiceSearchTerm);
    // Auto-submit voice search
    setTimeout(() => {
      onSearch(voiceSearchTerm.trim());
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
                placeholder="ابحث في ملخصات القضايا والوثائق القانونية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg bg-background border-border focus:ring-primary focus:border-primary shadow-card text-right"
                disabled={loading}
                dir="rtl"
              />
            </div>
            
            <VoiceSearch
              onSearchUpdate={handleVoiceSearchUpdate}
              isListening={isVoiceListening}
              onListeningChange={setIsVoiceListening}
            />
            
            <Button
              type="submit"
              variant="professional"
              size="xl"
              disabled={loading}
              className="px-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  جاري البحث...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  بحث
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Voice Search Status */}
        {isVoiceListening && (
          <div className="animate-fade-in bg-accent-light p-4 rounded-xl border border-accent/30">
            <div className="flex items-center gap-3">
              <div className="animate-pulse-gentle bg-accent rounded-full p-2">
                <Search className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-accent-foreground">البحث الصوتي نشط</p>
                <p className="text-sm text-muted-foreground">تحدث بوضوح للبحث في القضايا...</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
};

export default SearchForm;