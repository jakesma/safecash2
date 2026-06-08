/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SearchInput } from './components/SearchInput';
import { ResultCard } from './components/ResultCard';
import { QuickChips } from './components/QuickChips';
import { HistoryList } from './components/HistoryList';
import { AnalysisResult, SearchHistory, Bookmark } from './types';
import { analyzeItem, isMockMode } from './services/gemini';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('safecash_history');
    const savedBookmarks = localStorage.getItem('safecash_bookmarks');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('safecash_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('safecash_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeItem(searchQuery);
      setResult(analysis);
      
      const newHistoryItem: SearchHistory = {
        id: crypto.randomUUID(),
        itemName: analysis.itemName,
        status: analysis.status,
        timestamp: analysis.timestamp
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
    } catch (error) {
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = () => {
    if (!result) return;
    setBookmarks(prev => {
      const exists = prev.find(b => b.result.itemName === result.itemName);
      if (exists) {
        return prev.filter(b => b.result.itemName !== result.itemName);
      } else {
        return [{ id: crypto.randomUUID(), result }, ...prev];
      }
    });
  };

  const isBookmarked = result ? !!bookmarks.find(b => b.result.itemName === result.itemName) : false;

  const clearHistory = () => {
    if (confirm('모든 검색 기록을 삭제하시겠습니까?')) {
      setHistory([]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F5F5] font-sans text-ink overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-[#E5E5E5] flex flex-col">
        <div className="p-8 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-black tracking-tighter text-primary">SafeCash</h1>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            안전보건비 스마트 체크
          </p>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          <HistoryList
            history={history}
            bookmarks={bookmarks}
            onSelectResult={setResult}
            onClearHistory={clearHistory}
          />
        </div>

        <div className="p-6 border-t border-[#E5E5E5] bg-gray-50/50 space-y-3">
          <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></div>
            <span>KOSHA 최신 지침 실시간 연동 중</span>
          </div>
          <div className="flex items-center justify-between text-[10px] border-t border-gray-100 pt-2">
            <span className="font-bold text-gray-400 uppercase tracking-wider">서비스 모드</span>
            {isMockMode ? (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-extrabold border border-amber-200">
                오프라인 (Mock)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-extrabold border border-emerald-200">
                온라인 (Gemini AI)
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-8 space-y-6 overflow-hidden">
        <header className="max-w-5xl w-full mx-auto">
          <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          <div className="mt-6">
            <QuickChips onSelect={handleSearch} />
          </div>
        </header>

        <section className="max-w-5xl w-full mx-auto flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-white/50 rounded-[32px] border border-gray-100 italic text-gray-400">
               <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
               <p className="font-bold">현행 고용노동부 고시 및 질의회시 데이터를 검색 중입니다...</p>
            </div>
          ) : result ? (
            <ResultCard
              result={result}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white/30 rounded-[32px] border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                 <ShieldCheck className="w-8 h-8 text-gray-300" />
               </div>
               <p className="text-gray-400 font-bold text-lg">물품명을 검색하여 안전보건비를 체크하세요</p>
               <p className="text-gray-400 text-sm mt-1">예: 인건비, 폭염 물품, 안전모 등</p>
            </div>
          )}
        </section>
      </main>


    </div>
  );
}
