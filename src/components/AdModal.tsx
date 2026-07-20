import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdModalProps {
  onClose: () => void;
  /** 구글 애드센스 ca-pub-XXXXXXXXXXXXXXXX ID (선택사항) */
  adClient?: string;
  /** 구글 애드센스 광고 슬롯 ID (선택사항) */
  adSlot?: string;
  /** 카운트다운 시간 (초, 기본값: 6) */
  durationSeconds?: number;
}

export const AdModal: React.FC<AdModalProps> = ({
  onClose,
  adClient = '',
  adSlot = '',
  durationSeconds = 6
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 구글 애드센스 광고 로드
  useEffect(() => {
    if (adClient && adSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense load error:', err);
      }
    }
  }, [adClient, adSlot]);

  const progressPercent = Math.min(
    100,
    Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#121620] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                SafeCash
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                  스마트 체크
                </span>
              </h2>
              <p className="text-xs text-gray-400">서비스 이용 전 안내 광고입니다</p>
            </div>
          </div>

          {/* Countdown Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            {timeLeft > 0 ? (
              <span className="text-amber-400 font-mono text-sm">{timeLeft}초 남음</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 준비 완료
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ad Container Area */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[280px] bg-black/40 relative">
          {adClient && adSlot ? (
            <div className="w-full flex items-center justify-center overflow-hidden min-h-[250px]">
              <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '250px' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          ) : (
            /* Fallback / Demo Ad Placeholder */
            <div className="w-full h-full min-h-[240px] rounded-xl border border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/0 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1">
                구글 애드센스 전면 광고 영역
              </h3>
              <p className="text-xs text-gray-400 max-w-md mb-4 leading-relaxed">
                현재 데모 모드입니다. 실제 광고를 게재하려면 <code className="bg-black/50 text-amber-300 px-1.5 py-0.5 rounded text-[11px]">AdModal</code> 컴포넌트에 <code className="text-amber-300">adClient</code>와 <code className="text-amber-300">adSlot</code>을 입력하세요.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                6초 대기 후 이용 가능 시스템 작동 중
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            {timeLeft > 0 ? (
              <span>광고를 시청해 주셔서 감사합니다. 카운트다운 완료 후 이용이 가능합니다.</span>
            ) : (
              <span className="text-emerald-400 font-medium">서비스 준비가 완료되었습니다. 시작하기 버튼을 눌러주세요.</span>
            )}
          </p>

          <button
            onClick={onClose}
            disabled={timeLeft > 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shrink-0 ${
              timeLeft > 0
                ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/5'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
            }`}
          >
            {timeLeft > 0 ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-amber-400" />
                <span>{timeLeft}초 후 시작 가능</span>
              </>
            ) : (
              <>
                <span>스마트 안전관리비 검색 시작하기</span>
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
