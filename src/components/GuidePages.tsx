import React, { useState } from 'react';
import { guidesData, GuideArticle } from './guidesData';
import { 
  BookOpen, 
  ArrowLeft, 
  Search, 
  Bookmark, 
  Compass, 
  CheckCircle,
  FileText,
  HelpCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface GuidePagesProps {
  currentPath: string;
  navigateTo: (path: string) => void;
  onSelectKeyword?: (keyword: string) => void;
}

export function GuidePages({ currentPath, navigateTo, onSelectKeyword }: GuidePagesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extract guide ID if path matches /guides/:id
  const match = currentPath.match(/\/guides\/([1-8])/);
  const selectedGuideId = match ? match[1] : null;

  const handleKeywordSearch = (keyword: string) => {
    if (onSelectKeyword) {
      onSelectKeyword(keyword);
      navigateTo('/');
    }
  };

  // Render Single Guide View
  if (selectedGuideId) {
    const guide = guidesData.find(g => g.id === selectedGuideId);
    if (!guide) {
      return (
        <div className="p-8 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-400 font-bold">존재하지 않는 가이드 페이지입니다.</p>
          <button
            onClick={() => navigateTo('/guides')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm"
          >
            가이드 목록으로 가기
          </button>
        </div>
      );
    }

    return (
      <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-8 pb-12 font-sans text-ink">
        {/* Header Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo('/guides')}
            className="p-2 hover:bg-gray-200 bg-white rounded-xl border border-gray-200 transition-colors flex items-center justify-center cursor-pointer"
            title="가이드 목록으로"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <span className="text-xs font-bold text-[#FF6321] uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded">
              안전비 8대 고시 기준
            </span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Safety Expense Professional Handbook
            </p>
          </div>
        </div>

        {/* Article Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-black text-gray-400 block mb-2">항목 분류: {guide.category}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {guide.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed mt-4 italic border-l-4 border-[#FF6321] pl-4">
              "{guide.summary}"
            </p>
          </div>

          <div className="border-t border-gray-100 pt-8 space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            <p className="text-gray-700 font-semibold">{guide.content}</p>

            {guide.sections.map((section, idx) => (
              <div key={idx} className="space-y-3 pt-4 border-t border-dashed border-gray-100 first:border-0 first:pt-0">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#FF6321] flex-shrink-0" />
                  <span>{section.subtitle}</span>
                </h3>
                <div className="text-sm font-medium text-gray-600 bg-gray-50/50 rounded-2xl p-5 border border-gray-100 whitespace-pre-wrap leading-relaxed">
                  {section.body}
                </div>
              </div>
            ))}
          </div>

          {/* Action CTA inside Article */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-blue-900 text-sm sm:text-base">이 항목을 내 계산기에서 직접 정산 판별해볼까요?</h4>
              <p className="text-xs text-blue-700/80 font-medium">AI 진단을 통해서 더 구체적인 개별 자재 제품명을 입력해보세요.</p>
            </div>
            <button
              onClick={() => navigateTo('/')}
              className="px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl font-bold text-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/10"
            >
              <span>실시간 계산기 가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Map (Quick Jump Footer) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">전체 가이드 빠른 이동</h4>
          <div className="flex flex-wrap gap-2">
            {guidesData.map(g => (
              <button
                key={g.id}
                onClick={() => navigateTo(`/guides/${g.id}`)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  g.id === selectedGuideId
                    ? 'bg-[#FF6321] text-white border-transparent shadow-md shadow-orange-500/10'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {g.id}호
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Guides List View
  const filteredGuides = guidesData.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-8 pb-10">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#111827] to-[#1F2937] rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 -mr-16 -mb-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="text-[#FF6321] text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Professional Safety budget Handbook
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mt-4">
            산업안전보건관리비 <br/>
            <span className="text-[#FF6321]">8대 항목 정산 실무 가이드북</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
            고용노동부 지침 및 공식 유권해석(질의회시) 데이터로 해설하는 최강의 현장 실무 가이드입니다. 검색창을 이용해 관심이 있는 유권해석 내용을 찾아보세요.
          </p>
        </div>
      </div>

      {/* Guide Search Area */}
      <div className="relative max-w-xl w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="관심 키워드 또는 분류 검색... (예: 스마트 안전장비, 핫팩, 신호수)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#FF6321] font-semibold text-gray-800 placeholder:text-gray-400 shadow-xs"
        />
      </div>

      {/* Grid of Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pl-2">
          <h3 className="text-lg font-bold text-gray-900">가이드 목차 ({filteredGuides.length}개 발견)</h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">KOSHA 최신 지침 탑재 완료</span>
        </div>
        
        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">검색어와 부합하는 가이드를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigateTo(`/guides/${guide.id}`)}
                className="p-6 bg-white border border-gray-100 hover:border-[#FF6321]/30 hover:shadow-md hover:-translate-y-0.5 rounded-3xl cursor-pointer flex flex-col justify-between transition-all group shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#FF6321] bg-[#FFF0E9] px-2 py-0.5 rounded">
                      제 {guide.id}호 사유
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {guide.category}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-gray-900 group-hover:text-[#FF6321] transition-colors text-base line-clamp-1">
                    {guide.title.split(': ')[0]}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                    {guide.summary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-[#FF6321]">
                  <span>실무 매뉴얼 정독하기</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
