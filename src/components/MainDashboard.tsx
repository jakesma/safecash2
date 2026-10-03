/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Sparkles, 
  Scale, 
  FileText,
  BadgeAlert
} from 'lucide-react';

interface MainDashboardProps {
  onSelectKeyword: (keyword: string) => void;
}

export function MainDashboard({ onSelectKeyword }: MainDashboardProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const categories = [
    {
      id: '1호',
      title: '안전보건 관계자 인건비',
      description: '전담 안전·보건관리자, 건설용 리프트 운전원, 유도원 및 신호수 등의 임금과 수당.',
      eligibility: '일부 대상 전담 필수',
      bgColor: 'from-blue-50 to-indigo-50 border-blue-100',
      textColor: 'text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: '2호',
      title: '안전시설비 등',
      description: '추락 방지용 난간, 가설 통로, 안전망, 스마트 위험감지 장비의 구입·대여 및 설치 비용.',
      eligibility: '스마트 장비 한도 적용',
      bgColor: 'from-emerald-50 to-teal-50 border-emerald-100',
      textColor: 'text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: '3호',
      title: '개인보호구 및 소모품비',
      description: '안전모, 안전화, 안전조끼, 보안경, 방진마스크, 혹서기 방한/냉방 보호구 지급 비용.',
      eligibility: '100% 계상 가능',
      bgColor: 'from-amber-50 to-orange-50 border-amber-100',
      textColor: 'text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: '4호',
      title: '사업장 안전진단비 등',
      description: '법정 안전보건진단, 작업환경측정, 재해예방 기술지도 및 위험성평가 전문기관 의뢰 수수료.',
      eligibility: '용역비 계상 가능',
      bgColor: 'from-purple-50 to-fuchsia-50 border-purple-100',
      textColor: 'text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: '5호',
      title: '안전보건 교육비 및 행사비',
      description: '신규·정기 안전교육 강사료, 교재 구입비, 우수 근로자 포상금 및 반기별 안전행사 경비.',
      eligibility: '자체 교육비 인정',
      bgColor: 'from-pink-50 to-rose-50 border-pink-100',
      textColor: 'text-rose-900',
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: '6호',
      title: '근로자 건강장해 예방비',
      description: '구급용 약품 구입, 작업장 살수비, 폭염 시 이동식 그늘막 및 탈수 예방 식염수/포도당 가루 비용.',
      eligibility: '주요 개정 항목',
      bgColor: 'from-cyan-50 to-sky-50 border-cyan-100',
      textColor: 'text-sky-900',
      badgeColor: 'bg-cyan-100 text-cyan-700'
    },
    {
      id: '7호',
      title: '건설재해예방 기술지도비',
      description: '법 제73조에 따른 전문 지도기관의 재해예방 기술지도 계약금 및 자문 수수료.',
      eligibility: '의무 기술지도 대상',
      bgColor: 'from-violet-50 to-purple-50 border-violet-100',
      textColor: 'text-violet-900',
      badgeColor: 'bg-violet-100 text-violet-700'
    },
    {
      id: '8호',
      title: '본사 안전관리비 사용',
      description: '본사 안전전담부서 구성원의 급여 및 안전보건 업무 수행을 위한 경비 (일정 한도 내 인정).',
      eligibility: '본사 승인 필요',
      bgColor: 'from-slate-50 to-zinc-50 border-slate-100',
      textColor: 'text-slate-900',
      badgeColor: 'bg-slate-100 text-slate-700'
    }
  ];

  const faqs = [
    {
      q: '차량 신호수나 통행 유도자의 인건비도 안전보건관리비로 계상이 가능한가요?',
      a: '예, 가능합니다. 고용노동부 고시에 따라 건설공사장 내에서 타워크레인, 차량계 하역운반기계 등의 차량 및 장비와 주변 근로자의 충돌 사고를 예방하기 위한 통행 유도자나 전담 신호수의 임금은 안전보건관리비로 계상할 수 있습니다. 단, 자재 정리 등 다른 주공종 업무를 겸임하지 않고 오직 신호/유도 업무만을 전담하여 수행하는 경우로 제한됩니다.',
      keyword: '신호수'
    },
    {
      q: '폭염 및 겨울 한파 예방을 위한 방한/방열 용품도 청구할 수 있나요?',
      a: '예, 가능합니다. 최신 고시 지침에 따라 6월~9월(혹서기)에 근로자 온열질환 예방을 위해 지급하는 아이스조끼, 쿨토시, 쿨스카프 등 냉방 보호구와 야외 그늘막 설치비, 그리고 11월~3월(혹한기)에 한시적으로 지급하는 핫팩, 방한모, 난로 대여비 등은 근로자 건강장해 예방비(6호)로 인정됩니다. 다만 단순한 수박, 탄산음료 등 복리후생 성격의 음식물 구입 비용은 대상에서 제외됩니다.',
      keyword: '쿨스카프'
    },
    {
      q: 'CCTV나 스마트 붕괴센서 같은 첨단 스마트 안전장비의 계상 기준은 어떻게 되나요?',
      a: '인공지능(AI) CCTV, 드론, 스마트 안전帽, 붕괴 위험 감지 센서 등 최신 스마트 안전장비의 구매 및 임차 비용은 계상이 가능합니다. 고용노동부 지침에 따라 스마트 장비 비용은 총 안전보건관리비 예산의 20% 한도 내에서 사용이 가능합니다. (원활한 도입 지원을 위해 개정된 사항입니다.)',
      keyword: '스마트 안전장비'
    },
    {
      q: '소화기나 비상유도등 같은 가설 소방설비 구입비는 몇 호에 해당하나요?',
      a: '임시 소방시설에 해당하는 소화기, 비상경보장치, 간이피난유도선 등의 가설 소방설비와 해당 소방자재의 구매 및 설치 비용은 안전시설비 등(2호)에 해당하여 100% 계상이 가능합니다. 화재 위험이 높은 건설현장에서 필수적인 예방 조치로 폭넓게 인정됩니다.',
      keyword: '소화기'
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto pr-2 space-y-10 pb-10">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#111827] to-[#1F2937] rounded-3xl p-8 text-white relative overflow-hidden shadow-md"
      >
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Scale className="w-96 h-96 -mr-16 -mb-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-[#FF6321] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>고용노동부 고시 제2023-49호 및 공식 유권해석 반영</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            산업안전보건관리비 사용 적절성을 <br/>
            <span className="text-[#FF6321]">공식 법령 가이드라인</span> 기반으로 판별하세요
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
            SafeCash는 현장에서 빈번히 발생하는 부적합 사용 사례와 모호한 유권해석을 AI와 축적된 공시 질의회시 데이터를 통해 즉시 판독해주는 현장 맞춤형 솔루션입니다.
          </p>
        </div>
      </motion.div>

      {/* 8 Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-ink flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF6321]" />
            <span>산업안전보건관리비 8대 사용 항목</span>
          </h3>
          <span className="text-xs font-semibold text-gray-400">고시 제7조 사용 기준</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className={`p-6 rounded-2xl bg-gradient-to-b ${cat.bgColor} border flex flex-col justify-between group transition-all duration-200 shadow-sm`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#FF6321] bg-[#FFF0E9] px-2 py-0.5 rounded">
                    {cat.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                    {cat.eligibility}
                  </span>
                </div>
                <h4 className="font-extrabold text-gray-900 group-hover:text-[#FF6321] transition-colors text-base mb-1.5">
                  {cat.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-ink flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#FF6321]" />
          <span>주요 법적 쟁점 & 자주 묻는 FAQ</span>
        </h3>
        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-sm">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div key={idx} className="transition-colors duration-150">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-gray-50/50 cursor-pointer"
                >
                  <div className="flex gap-3">
                    <span className="text-[#FF6321] font-black text-lg">Q.</span>
                    <span className="font-bold text-gray-800 text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-6 bg-gray-50/30 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-50 pt-4"
                  >
                    <div className="flex gap-3 mb-3">
                      <span className="text-emerald-500 font-black text-lg">A.</span>
                      <span className="font-medium text-gray-600">
                        {faq.a}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">관련 키워드 검색:</span>
                      <button
                        onClick={() => onSelectKeyword(faq.keyword)}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#FF6321] hover:bg-[#FFF0E9] hover:border-[#FF6321] transition-all cursor-pointer"
                      >
                        #{faq.keyword}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AdSense Policy Disclaimer Section */}
      <div className="p-5 bg-gray-100/50 rounded-2xl border border-gray-200/80 flex items-start gap-3.5 text-xs text-gray-500">
        <BadgeAlert className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-gray-700">구글 애드센스 정책 준수 안내</p>
          <p className="leading-relaxed">
            본 사이트는 건설 재해 예방과 안전관리비 투명 정산을 지원하고자 무료 배포됩니다. 서비스의 영속적인 제공 및 법률 데이터 인프라 유지 보수를 위해 구글 애드센스 광고를 송출합니다. 애드센스 크롤러는 사이트 내 정보 유용성과 유권해석 데이터를 포함한 고품질 게시자 콘텐츠 영역을 Contextual 파악하여 광고 게재를 조율합니다.
          </p>
        </div>
      </div>

    </div>
  );
}
