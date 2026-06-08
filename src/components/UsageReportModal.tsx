/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Printer, Download, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult } from '../types';

interface UsageReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

export function UsageReportModal({ isOpen, onClose, result }: UsageReportModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 no-print">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-ink">산업안전보건관리비 사용내역서 (초안)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                >
                  <Printer className="w-4 h-4" /> 출력 / PDF 저장
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content - Printable Area */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 print-content bg-white">
              <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                  body * { visibility: hidden; }
                  .print-content, .print-content * { visibility: visible; }
                  .print-content { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    width: 100%; 
                    padding: 0 !important; 
                  }
                  .no-print { display: none !important; }
                }
              `}} />
              
              <div className="max-w-[210mm] mx-auto space-y-10">
                {/* Document Header */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-black border-b-4 border-ink pb-4 inline-block px-12">
                    산업안전보건관리비 사용내역서
                  </h1>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm pt-2">
                    Industrial Safety and Health Management Budget Usage Report
                  </p>
                </div>

                {/* Form Table */}
                <table className="w-full border-2 border-ink text-sm">
                  <tbody>
                    <tr>
                      <th className="bg-gray-50 p-4 border border-ink text-left w-32">공사명</th>
                      <td className="p-4 border border-ink font-medium" colSpan={3}>[공사명을 입력하세요]</td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 p-4 border border-ink text-left">항목 분류</th>
                      <td className="p-4 border border-ink font-bold text-primary" colSpan={3}>
                        {result.category || "기타 안전관리비"}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 p-4 border border-ink text-left">물품/내역</th>
                      <td className="p-4 border border-ink font-bold">{result.itemName}</td>
                      <th className="bg-gray-50 p-4 border border-ink text-left w-32">계상 가능 여부</th>
                      <td className="p-4 border border-ink font-black text-lg">
                        {result.statusLabel} ({result.status})
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 p-4 border border-ink text-left">금액(예상)</th>
                      <td className="p-4 border border-ink font-mono text-right" colSpan={3}>₩ ____________________</td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 p-4 border border-ink text-left align-top">사용 용도 및 사유</th>
                      <td className="p-4 border border-ink align-top italic text-gray-700" colSpan={3} style={{ minHeight: '80px' }}>
                        {result.summary}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Attachments Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">증빙 자료 (관련 근거 및 질의회시)</h3>
                  </div>
                  
                  <div className="grid gap-6">
                    {result.bases.map((base, idx) => (
                      <div key={idx} className="p-6 bg-gray-50 rounded-2xl border-l-8 border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-black text-ink">{base.title}</h4>
                          <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                            출처: {base.source}
                          </span>
                        </div>
                        <div className="p-4 bg-white rounded-xl text-gray-700 leading-relaxed text-sm whitespace-pre-wrap italic border border-gray-100">
                          {base.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-10 flex justify-between items-end border-t border-gray-100">
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>본 문서는 SafeCash AI 분석 시스템을 통해 생성되었습니다.</p>
                    <p>작성일시: {new Date(result.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-4">
                    <p className="font-bold text-sm">위와 같이 산업안전보건관리비 사용을 신청/보고합니다.</p>
                    <div className="flex items-center justify-end gap-12 pt-4">
                      <span className="font-bold text-lg">현장 대리인:</span>
                      <span className="w-32 h-10 border-b-2 border-gray-200 flex items-end justify-center text-gray-300">(인)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer (No Print) */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 no-print flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Info className="w-4 h-4" />
                <span>출력 시 배경 그래픽 포함 설정을 확인하세요.</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-ink text-white rounded-xl font-bold text-sm hover:opacity-90"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
