/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult, SearchHistory } from '../types';
import { Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: SearchHistory[];
  bookmarks: { id: string, result: AnalysisResult }[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
}

export function HistoryList({
  history,
  bookmarks,
  onSelectResult,
  onClearHistory,
}: HistoryListProps) {
  return (
    <div className="space-y-10">
      {/* Recent History */}
      <section>
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">최근 검색 기록</h3>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[10px] font-bold text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              CLEAR
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {history.length > 0 ? (
            history.map((item) => (
              <div 
                key={item.id} 
                className="p-3 bg-gray-50 rounded-xl text-sm flex justify-between items-center group cursor-pointer hover:bg-white hover:shadow-sm hover:border-gray-100 border border-transparent transition-all"
              >
                <span className="font-semibold text-gray-700 truncate mr-2">{item.itemName}</span>
                <span className={`font-black text-xs ${
                  item.status === 'O' ? 'text-[#22C55E]' :
                  item.status === 'X' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                }`}>
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-300 italic px-2">최근 기록이 없습니다</p>
          )}
        </div>
      </section>

      {/* Bookmarks */}
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">북마크</h3>
        <div className="space-y-1.5">
          {bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <button
                key={bookmark.id}
                onClick={() => onSelectResult(bookmark.result)}
                className="w-full text-left p-3 rounded-xl text-sm italic text-gray-600 hover:bg-gray-50 hover:text-primary transition-all flex items-center justify-between group"
              >
                <span className="truncate mr-2 font-medium">{bookmark.result.itemName}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))
          ) : (
            <p className="text-xs text-gray-300 italic px-2">저장된 즐겨찾기가 없습니다</p>
          )}
        </div>
      </section>
    </div>
  );
}
