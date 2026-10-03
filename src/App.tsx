/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SearchInput } from './components/SearchInput';
import { ResultCard } from './components/ResultCard';
import { QuickChips } from './components/QuickChips';
import { HistoryList } from './components/HistoryList';
import { AnalysisResult, SearchHistory, Bookmark } from './types';
import { analyzeItem, isMockMode } from './services/gemini';
import { LegalModal } from './components/LegalModals';
import { MainDashboard } from './components/MainDashboard';
import { AboutUs, ContactUs, PrivacyPolicyPage, TermsOfServicePage } from './components/StaticPages';
import { GuidePages } from './components/GuidePages';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path !== '/') {
      setResult(null);
    }
  };

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

  const renderMainContent = () => {
    if (currentPath === '/') {
      return (
        <>
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
              <MainDashboard onSelectKeyword={handleSearch} />
            )}
          </section>
        </>
      );
    }

    if (currentPath.startsWith('/guides')) {
      return (
        <section className="max-w-5xl w-full mx-auto flex-1 overflow-hidden flex flex-col pt-2 bg-white/40 rounded-[32px] p-6 border border-gray-150">
          <GuidePages
            currentPath={currentPath}
            navigateTo={navigateTo}
            onSelectKeyword={handleSearch}
          />
        </section>
      );
    }

    if (currentPath === '/about') {
      return (
        <section className="max-w-5xl w-full mx-auto flex-1 overflow-hidden flex flex-col pt-2 bg-white/40 rounded-[32px] p-6 border border-gray-150">
          <AboutUs navigateTo={navigateTo} />
        </section>
      );
    }

    if (currentPath === '/contact') {
      return (
        <section className="max-w-5xl w-full mx-auto flex-1 overflow-hidden flex flex-col pt-2 bg-white/40 rounded-[32px] p-6 border border-gray-150">
          <ContactUs navigateTo={navigateTo} />
        </section>
      );
    }

    if (currentPath === '/privacy') {
      return (
        <section className="max-w-5xl w-full mx-auto flex-1 overflow-hidden flex flex-col pt-2 bg-white/40 rounded-[32px] p-6 border border-gray-150">
          <PrivacyPolicyPage navigateTo={navigateTo} />
        </section>
      );
    }

    if (currentPath === '/terms') {
      return (
        <section className="max-w-5xl w-full mx-auto flex-1 overflow-hidden flex flex-col pt-2 bg-white/40 rounded-[32px] p-6 border border-gray-150">
          <TermsOfServicePage navigateTo={navigateTo} />
        </section>
      );
    }

    return <MainDashboard onSelectKeyword={handleSearch} />;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F5F5F5] font-sans text-ink overflow-visible md:h-screen md:flex-row md:overflow-hidden">
      {/* Sidebar */}
      <aside className="order-last w-full border-b border-[#E5E5E5] bg-white flex flex-col md:order-none md:w-80 md:border-r md:border-b-0">
        <div className="p-4 sm:p-6 md:p-8 border-b border-[#F5F5F5] cursor-pointer" onClick={() => navigateTo('/')}>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tighter text-primary">SafeCash</h1>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            안전보건비 스마트 체크
          </p>
        </div>

        {/* Navigation Menu */}
        <div className="px-6 py-4 border-b border-[#F5F5F5] space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">메뉴 바로가기</div>
          <button
            onClick={() => navigateTo('/')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentPath === '/' && !result
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>실시간 AI 계상기</span>
          </button>
          
          <button
            onClick={() => navigateTo('/guides')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentPath.startsWith('/guides')
                ? 'bg-[#FF6321]/10 text-[#FF6321] border border-[#FF6321]/20 shadow-xs'
                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4 1.253" />
            </svg>
            <span>실무 가이드북 (8대)</span>
          </button>

          <button
            onClick={() => navigateTo('/about')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentPath === '/about'
                ? 'bg-blue-50 text-[#1E3A8A] border border-blue-100 shadow-xs'
                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>SafeCash 소개 (About)</span>
          </button>

          <button
            onClick={() => navigateTo('/contact')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentPath === '/contact'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs'
                : 'text-gray-600 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>협력 및 문의 (Contact)</span>
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto md:space-y-8">
          <HistoryList
            history={history}
            bookmarks={bookmarks}
            onSelectResult={(res) => {
              navigateTo('/');
              setResult(res);
            }}
            onClearHistory={clearHistory}
          />
        </div>

        <div className="p-4 sm:p-6 border-t border-[#E5E5E5] bg-gray-50/50 space-y-3">
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

        {/* Company Logo & Links */}
        <div className="p-4 sm:p-5 border-t border-[#E5E5E5] bg-white">
          <a
            href="https://www.automosafety.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
            title="AUTOMO 안전연구소 홈페이지"
          >
            <div className="flex items-center justify-center bg-[#F0F2F5] rounded-xl p-3 mb-3 group-hover:bg-[#E8EBF0] transition-colors duration-200">
              <img
                src="/automo-logo.png"
                alt="AUTOMO 안전연구소 로고"
                className="h-14 object-contain"
              />
            </div>
          </a>
          <div className="space-y-1.5">
            <a
              href="https://www.automosafety.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-[#1E3A8A] font-bold hover:text-blue-500 transition-colors duration-150 group"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="truncate group-hover:underline">www.automosafety.co.kr</span>
              <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href="https://automo-safety1222.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-[#1E3A8A] font-bold hover:text-orange-500 transition-colors duration-150 group"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="truncate group-hover:underline">automo-safety1222.tistory.com</span>
              <svg className="w-3 h-3 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold border-t border-gray-100 pt-3 mt-3">
            <button
              onClick={() => navigateTo('/privacy')}
              className={`hover:text-primary transition-colors cursor-pointer ${currentPath === '/privacy' ? 'text-primary underline' : ''}`}
            >
              개인정보처리방침
            </button>
            <span>|</span>
            <button
              onClick={() => navigateTo('/terms')}
              className={`hover:text-primary transition-colors cursor-pointer ${currentPath === '/terms' ? 'text-primary underline' : ''}`}
            >
              이용약관
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="order-first flex min-h-screen flex-1 flex-col p-4 space-y-4 overflow-y-auto sm:p-6 md:order-none md:min-h-0 md:p-8 md:overflow-hidden">
        {renderMainContent()}
      </main>

      {/* 개인정보처리방침 및 이용약관 모달 */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        type={legalType}
      />
    </div>
  );
}
