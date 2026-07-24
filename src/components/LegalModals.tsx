import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? '개인정보처리방침' : '서비스 이용약관';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
          {isPrivacy ? (
            <>
              <div>
                <h3 className="text-base font-semibold text-ink mb-2">1. 개인정보 수집에 대한 고지</h3>
                <p>
                  SafeCash(세이프캐시, 이하 "서비스")는 회원가입이나 로그인 절차 없이 누구나 무상으로 이용할 수 있는 익명 서비스입니다. 본 서비스는 어떠한 경우에도 사용자의 이름, 연락처, 이메일 등 식별 가능한 개인정보를 직접 수집하거나 서버에 저장하지 않습니다.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink mb-2">2. 로컬 스토리지(Local Storage) 이용</h3>
                <p>
                  사용자가 검색한 검색 기록 및 북마크(즐겨찾기) 정보는 서버에 전송되거나 저장되지 않으며, 오직 사용자의 브라우저 내부 저장소인 <strong>로컬 스토리지(LocalStorage)</strong>에만 보관됩니다. 이 데이터는 사용자가 직접 브라우저 캐시를 삭제하거나 기록 삭제 버튼을 누르면 즉시 파기됩니다.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink mb-2">3. 서드파티 서비스 및 쿠키(Cookie) 안내</h3>
                <p>
                  본 서비스는 서비스 운영 지원 및 맞춤형 광고 게재를 위해 <strong>구글 애드센스(Google AdSense)</strong> 및 구글 애널리틱스 등 서드파티 제공 서비스를 이용할 수 있습니다. 이 과정에서 구글 등 서드파티 제공업체는 사용자의 웹사이트 방문 기록에 기반하여 광고를 게재하기 위해 쿠키를 사용할 수 있습니다.
                </p>
                <p className="mt-2">
                  사용자는 웹 브라우저 설정을 변경하여 모든 쿠키를 거부하거나 쿠키가 전송될 때 알림을 받도록 설정할 수 있습니다. 다만 쿠키 설정을 거부할 경우 일부 서비스 기능 이용에 제한이 있을 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink mb-2">4. 문의 사항</h3>
                <p>
                  개인정보 처리 및 보안 관련 문의 사항이 있으신 경우 서비스 배포처인 AUTOMO 안전연구소 공식 채널을 통해 문의해 주시기 바랍니다.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-base font-semibold text-ink mb-2">제1조 (목적)</h3>
                <p>
                  본 약관은 AUTOMO 안전연구소(이하 "연구소")가 제공하는 SafeCash(세이프캐시) 서비스(이하 "서비스")의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink mb-2">제2조 (서비스의 한계 및 면책 고지)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>본 서비스는 건설업 산업안전보건비의 계상 및 사용 여부를 인공지능(AI) 기술 및 기존 행정해석을 기반으로 임시 판별하여 정보성 참고 자료로 제공합니다.</li>
                  <li className="font-bold text-ink">AI의 분석 결과와 안내된 유권해석 정보는 법적 효력을 갖지 않으며, 공사 발주처, 감리단, 노동청 등 실정산 검토 시의 절대적인 판단 기준이 될 수 없습니다.</li>
                  <li>이용자는 본 서비스의 결과를 참조하되, 최종 판단 및 사용 적격성 여부는 고용노동부 고시 및 관할 고용노동청 근로감독관의 최종 해석을 받아 처리해야 합니다.</li>
                  <li>연구소는 이용자가 서비스를 사용하여 수행한 의사결정이나 정산 불인정으로 인한 불이익, 손해 등에 대해 어떠한 법적 책임도 지지 않습니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink mb-2">제3조 (광고의 게재)</h3>
                <p>
                  연구소는 서비스의 안정적인 무상 제공 및 유지보수를 위해 서비스 화면 내에 광고(구글 애드센스 등)를 게재할 수 있으며, 사용자는 서비스 이용 시 노출되는 광고에 대해 동의하는 것으로 간주됩니다.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink mb-2">제4조 (지식재산권 및 이용 제한)</h3>
                <p>
                  본 서비스의 디자인, 알고리즘, 콘텐츠에 대한 모든 지식재산권은 연구소에 귀속됩니다. 사용자는 서비스를 상업적 목적으로 무단 복제, 배포 또는 리버스 엔지니어링할 수 없습니다.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-ink text-white font-bold rounded-xl hover:bg-black transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
