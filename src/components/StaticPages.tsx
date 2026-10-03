import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Compass, 
  Send,
  Users
} from 'lucide-react';

interface StaticPageProps {
  navigateTo: (path: string) => void;
}

export function AboutUs({ navigateTo }: StaticPageProps) {
  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-8 pb-10">
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#111827] to-[#1F2937] rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Building2 className="w-96 h-96 -mr-16 -mb-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="text-[#FF6321] text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
            About SafeCash & AUTOMO Safety Lab
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mt-4">
            안전하고 지속 가능한 <br/>
            건설 산업의 기틀을 만드는 <span className="text-[#FF6321]">세이프캐시</span>
          </h2>
          <p className="mt-4 text-sm text-gray-300 font-medium leading-relaxed">
            SafeCash(세이프캐시)는 대한민국 건설 현장의 투명하고 효율적인 산업안전보건비 정산 및 관리를 돕기 위해 개발된 혁신적인 AI 기반 스마트 판별 솔루션입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6321] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">최상의 정확도와 전문성</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              고용노동부 고시(제2023-49호, 제2025-11호 등) 개정 정보와 법제처 유권해석 데이터를 실시간에 준하게 반영하여 가장 정합성 높은 정산 증빙 가이드를 제공합니다.
            </p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">투명한 안전 예산 집행</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              애매한 법적 해석으로 인해 현장에 꼭 필요한 안전 장비가 누락되거나, 정산 부적격 판정으로 시공사가 불이익을 당하는 불상사를 능동적으로 예방합니다.
            </p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">무상 및 접근 권리 보장</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              건설재해 예방을 꿈꾸는 모든 현장 관리자, 감리원, 안전 책임자가 회원가입 없이 완전히 투명하게 익명성 하에 도구를 활용할 수 있도록 무상 배포를 약속합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">
          AUTOMO 안전연구소 소개
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          오토모 안전연구소(AUTOMO Safety Lab)는 건설 및 산업 안전 규제 IT 기술 융합에 특화된 실천적 안전 연구 싱크탱크입니다. 복잡하게 얽힌 노동·산업법령을 현장의 시선으로 디코드하여 실무 중심의 모바일 도구를 개발, 공급하는 혁신 선두 주자입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-5 bg-gray-50 rounded-xl space-y-1">
            <p className="text-xs font-bold text-gray-400">연구소 명칭</p>
            <p className="font-extrabold text-gray-800 text-sm">오토모 안전연구소 (AUTOMO Safety Lab)</p>
          </div>
          <div className="p-5 bg-gray-50 rounded-xl space-y-1">
            <p className="text-xs font-bold text-gray-400">주요 활동 영역</p>
            <p className="font-extrabold text-gray-800 text-sm">건설안전 법률 IT 매칭, 중대재해 예방 솔루션 개발, 가설물 안전성 자문</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigateTo('/')}
          className="px-6 py-3 bg-[#1E3A8A] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
        >
          돌아가서 안전비 진단하기
        </button>
        <button
          onClick={() => navigateTo('/guides')}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all cursor-pointer"
        >
          8대 항목 실무가이드북 보기
        </button>
      </div>
    </div>
  );
}

export function ContactUs({ navigateTo }: StaticPageProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('모든 필수 입력 항목을 채워주세요.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-8 pb-10">
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-3xl">
          <span className="text-orange-400 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
            Contact Support & Partnership
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight mt-4">
            서비스 이용 문의 및 기술 제휴
          </h2>
          <p className="mt-4 text-sm text-gray-200 font-medium leading-relaxed">
            SafeCash 서비스 오동작 신고, 건설업 산업안전보건관리비 관련 의학/법률 자정 추가 건의 및 단체 맞춤형 커스텀 솔루션 도입 협의 등의 창구가 언제나 열려있습니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">공식 소통 채널</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">이메일 문의</p>
                  <p className="text-[13px] font-bold text-gray-800">contact@automosafety.co.kr</p>
                  <p className="text-xs text-gray-400">보통 1영업일 이내에 충실하게 회신을 드립니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6321] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">전화 및 고객 센터</p>
                  <p className="text-[13px] font-bold text-gray-800">070-1234-5678</p>
                  <p className="text-xs text-gray-400">평일 09:00 - 18:00 (점심시간 12:00 - 13:00 / 토·일·공휴일 휴무)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">연구소 오시는 길</p>
                  <p className="text-[13px] font-bold text-gray-800">서울특별시 금천구 가산디지털1로 168, 우림라이온스밸리 B동 502호</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3.5 text-xs text-gray-500">
            <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              본 웹사이트에 게재된 어떠한 분석 정보도 법적 대외 효력을 갖는 유일 무대의 최종 결론이 아니며, 분쟁 발생 시 고용노동청 지청 근로감독관의 감사 지침을 절대 우선 적용해야 합니다. 이에 상응하는 법률 분쟁에 당사는 면책입니다.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">1:1 빠른 온라인 문의</h3>
          
          {submitted ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-gray-800 text-base">문의가 성공적으로 전달되었습니다!</h4>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                입력해주신 메일({formData.email})로 담당자 검토 후 신속하게 회신해 드리겠습니다. AUTOMO 안전연구소를 향한 관심에 깊이 감사드립니다.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                className="mt-4 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                추가 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">이름 / 기업명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="홍길동 과장 또는 (주)오토모건설"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] font-semibold text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">회신받을 이메일 주소 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] font-semibold text-gray-800 placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">문의 상세 기재 <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="예: 여름용 쿨 조끼에 쓰이는 탈부착식 냉매 팩의 정산 근거 보고서에 고장이 발생했습니다. 확인 요청합니다."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] font-semibold text-gray-800 placeholder:text-gray-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6321] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>접수 요청 보내기</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage({ navigateTo }: StaticPageProps) {
  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-6 pb-10">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-gray-900">개인정보처리방침 (Privacy Policy)</h2>
          <p className="text-xs text-gray-400 mt-1">시행 일자: 2026년 08월 21일 (최신 고시 기준 적용)</p>
        </div>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
          <div>
            <h3 className="text-base font-bold text-ink mb-2">1. 개인정보 수집 및 이용 목적</h3>
            <p>
              SafeCash(세이프캐시, 이하 "서비스")는 회원가입이나 로그인 절차 없이 누구나 무상으로 이용할 수 있는 일방향 익명 검색 서비스입니다. 본 서비스는 어떠한 경우에도 사용자의 실명, 전화번호, 이메일 주소, 비밀번호 등 개인 식별에 활용될 수 있는 모든 정보군에 대해 수집 또는 백엔드 데이터베이스 저장을 명확히 거부하고 실행하지 않습니다.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink mb-2">2. 로컬 스토리지(Local Storage) 이용 고지</h3>
            <p>
              사용자가 안전관리비 판별을 위해 입력한 '물품명', '검색 분석 결과', '검색 이력 데이터' 및 '북마크 리스트'는 타사 서버 또는 당사 어플리케이션 시스템으로 자동 전송 및 기록되지 않으며 오직 사용자의 브라우저 로컬 저장소인 <strong>로컬 스토리지(LocalStorage)</strong>에 로컬 유지됩니다. 이 정보는 사용자께서 브라우저의 캐시나 인터넷 방문 기록을 영구 소거하거나 당사 화면상의 '모든 이력 지우기' 버튼을 조작함으로써 즉시 삭제됩니다.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink mb-2">3. 구글 애드센스(Google AdSense) 및 쿠키(Cookie) 송출 안내</h3>
            <p>
              서비스의 영속적인 고품질 AI 분석 정보 제공 및 인프라 운영 유지를 지지하고자 화면 전반에 **구글 애드센스(AdSense)** 기반 브랜디드 배너 광고를 배포하고 있습니다. 구글을 포함한 외부 공급업체는 본 사이트의 고객 방문 내역에 따라 표적 광고 매칭을 제공하기 위해 **쿠키(Cookie)**를 활용합니다.
            </p>
            <p className="mt-2">
              쿠키 저장을 원치 않는 사용자는 사용하는 브라우저의 옵션 설정을 자율 가동하여 쿠키 저장을 사전에 원격 차단하거나 승인을 거부할 수 있습니다. 단, 이 거절 행위 시 구글 애드센스 렌더링에 일시 오류가 발수될 수 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink mb-2">4. 개인정보 보호 담당 부서 안내</h3>
            <p>
              서비스 개인정보 보안 및 프라이버시 유지에 관련하여 법적 권리 주장 또는 개선 사항 의견 개진을 원하는 고객께서는 AUTOMO 안전연구소 소통 본부 메일([contact@automosafety.co.kr](mailto:contact@automosafety.co.kr))로 송고해 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <button
          onClick={() => navigateTo('/')}
          className="px-6 py-3 bg-[#1E3A8A] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-md"
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export function TermsOfServicePage({ navigateTo }: StaticPageProps) {
  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-6 pb-10">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-gray-900">서비스 이용약관 (Terms of Service)</h2>
          <p className="text-xs text-gray-400 mt-1">시행 일자: 2026년 08월 21일</p>
        </div>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
          <div>
            <h3 className="text-base font-bold text-ink mb-2">제1조 (목적)</h3>
            <p>
              본 규정은 AUTOMO 안전연구소(이하 "연구소")가 일반 환경에 정보 공유 목적으로 서비스하는 SafeCash(이하 "서비스")의 이용 권한 및 한계, 면책 범위를 기술한 기본적인 동의 수칙입니다.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink mb-2">제2조 (안전관리비 판별 시스템의 한계 및 면책 면제)</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>본 서비스는 대형 노동 법률 및 고용노동부 지침을 AI 및 행정 유권해석 데이터를 토대로 보조 판단하는 참고용 비공식 진단 도구입니다.</li>
              <li className="font-bold text-ink">
                AI의 판독 결과(계상 가능 O, 조건부△, 불가 X)와 안내 문서 및 첨부 법적 근거 리스트 등은 어떠한 경우에도 법적 강제력을 담보하지 않으며, 노동청 현장 근로감독관, 발주처, 감리인 회계 감사의 절대 가늠 표준이 될 수 없습니다.
              </li>
              <li>이용자는 본 시스템이 매칭해 준 가이드를 선도 참조하되, 최종 비용 집행에 관한 결정은 안전 주무관청 관할 지청 및 행정 전문가에게 정합성을 확인한 후 수행해야 합니다.</li>
              <li>연구소는 사용자의 주관적 판단에 따른 서비스 활용 오류, 비용 불인정 삭감, 손실 보상 패널티 등에 대해 일체의 민형사적 손해 책임 의무를 면제받습니다.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink mb-2">제3조 (구글 애드센스 노출 및 상업적 권리)</h3>
            <p>
              연구소는 무료 보장 운영 자금을 축적하기 위하여 사이트 내 일부 레이아웃 지점에 구글 애드센스 미디어를 노출 배포하며, 사용자는 브라우저 접근 시 이에 묵시적으로 수긍한 것으로 성립됩니다.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-ink mb-2">제4조 (지식재산 자재의 도용 및 리버스 금지)</h3>
            <p>
              본 시스템 내 탑재된 렌더링 프레임워크 디자인, 텍스트 데이터베이스, 판별 알고리즘 문맥의 창설적 저작은 연구소에 지식재산권이 배속되어 있으므로, 기타 집단의 상업적 무단 발췌, 클로닝 배포 및 리버스엔지니어링 활동을 전적으로 형사 금지합니다.
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => navigateTo('/')}
          className="px-6 py-3 bg-[#1E3A8A] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-md"
        >
          메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
