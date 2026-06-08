/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bookmark, BookmarkCheck, ChevronRight, Download, Info, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { AnalysisResult } from '../types';
import { generateEvidencePDF } from '../services/pdfGenerator';

interface ResultCardProps {
  result: AnalysisResult;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export function ResultCard({ result, isBookmarked, onToggleBookmark }: ResultCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getStatusStyles = () => {
    switch (result.status) {
      case 'O': return 'status-indicator-o';
      case 'X': return 'status-indicator-x';
      case '△': return 'status-indicator-delta';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusIconText = () => {
    return result.status || '?';
  };

  const handleDownloadEvidence = async () => {
    setIsGenerating(true);
    try {
      await generateEvidencePDF(result);
    } catch (e) {
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 flex items-start justify-between border-b border-gray-50">
        <div className="flex items-center space-x-6">
          <div className={`w-20 h-20 flex items-center justify-center rounded-3xl font-black text-4xl shadow-inner ${getStatusStyles()}`}>
            {getStatusIconText()}
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-ink">{result.itemName}</h2>
            <p className="text-lg text-gray-500 font-medium">산업안전보건비 계상 분석 결과</p>
          </div>
        </div>
        <div className={`${getStatusStyles()} px-4 py-2 rounded-full font-bold text-sm border-2 border-transparent shadow-sm`}>
          {result.statusLabel}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-primary">
          <h4 className="text-xs font-bold text-primary uppercase mb-3 tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4" /> 판별 근거
          </h4>
          <p className="text-lg leading-relaxed font-medium text-gray-800 italic">
            "{result.summary}"
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">관련 법적 근거 및 질의회시</h4>
          <div className="grid gap-3">
            {result.bases.map((base, idx) => (
              <div key={idx} className="p-5 bg-white border border-gray-200 rounded-2xl flex justify-between items-center group hover:border-primary/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                    base.source.includes('질의') ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {base.source.includes('질의') ? 'FAQ' : 'PDF'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{base.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{base.source}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">{base.content}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          분석 시점: {new Date(result.timestamp).toLocaleString()}
        </span>
        <div className="flex space-x-2">
          <button
            id="btn-download-evidence"
            onClick={handleDownloadEvidence}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> 생성 중...</>
              : <><Download className="w-4 h-4" /> 증빙근거자료 다운로드</>
            }
          </button>
          <button
            id="btn-toggle-bookmark"
            onClick={onToggleBookmark}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              isBookmarked
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            {isBookmarked ? '이미 저장됨' : '북마크 저장'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
