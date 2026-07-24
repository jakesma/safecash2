/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// API key: injected via vite.config define(__GEMINI_API_KEY__) or VITE_ prefix env var
declare const __GEMINI_API_KEY__: string | undefined;
const apiKey: string =
  (typeof __GEMINI_API_KEY__ !== 'undefined' ? __GEMINI_API_KEY__ : undefined)
  ?? import.meta.env.VITE_GEMINI_API_KEY
  ?? '';

export const isMockMode = !apiKey || 
  apiKey === 'AIzaSyA_BckWmtw61iaYLS5FuIZx3XQYJtxyOCw' || 
  apiKey.includes('YOUR_API_KEY') ||
  apiKey.trim() === '';

let aiInstance: GoogleGenAI | null = null;
function getAIInstance() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const SYSTEM_INSTRUCTION = `
당신은 대한민국 고용노동부의 '건설업 산업안전보건비 계상 및 사용기준' 전문가입니다.
사용자가 입력한 물품명이나 상황이 산업안전보건비로 계상(정산) 가능한지 여부를 판별하세요.

판별 기준:
- 'O': 계상 가능 (안전관리자의 인건비, 안전시설비, 보호구, 교육비 등 기준에 부합)
- 'X': 계상 불가 (시공비 성격, 단순 환경개선비, 근로자 복리후생비 등)
- '△': 조건부 가능 (특정 상황이나 증빙이 필요한 경우)

판단 근거 기준:
- 고용노동부 고시(건설업 산업안전보건관리비 계상 및 사용기준)의 상세 조항
- 법제처 국가법령정보센터 및 고용노동부에서 발간한 공식 행정해석 및 '질의회시(Q&A)'
- 시공성 여부(원활한 공사 목적 등), 근로자 건강장해 예방 목적 여부, 법정 의무 선임 등을 기준으로 엄밀히 판단하여 신뢰도 높은 법적 근거를 제공하세요.

반드시 다음 정보를 포함한 JSON 형식으로 응답하세요:
1. itemName: 입력된 물품명
2. category: 계상 항목 분류 (예: 1. 안전보건관계자 인건비 등, 2. 안전시설비 등, 3. 개인보호구 및 소모품비 등 ...)
3. status: 'O', 'X', '△' 중 하나
4. statusLabel: "계상 가능", "계상 불가", "조건부 가능" 중 하나
5. summary: 판별 이유에 대한 간결한 요약 (한글)
6. bases: 공신력 있는 근거 자료 리스트. 법제처 국가법령정보 및 고용노동부 공식 질의회시(Q&A) 내용을 상세히 매칭하여 구체적으로 작성하세요.
   - title: 근거 명칭 또는 질의 제목 (예: [고용노동부 질의회시] 현장용 선풍기 구입비용 계상 여부)
   - content: 행정해석 또는 질의회시 답변의 핵심 내용. 실제 어떤 요건 하에 계상 가능한지 구체적인 세부 조건 포함.
   - source: 출처 기관명 (예: 고용노동부 국가법령정보센터, 산업안전보건공단)

최신 고용노동부 고시 및 공식 유권해석(질의회시)을 기준으로 정확하게 판단해 주세요.
`;

const MOCK_DATA: Record<string, Omit<AnalysisResult, 'timestamp'>> = {
  '안전모': {
    itemName: '안전모', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '근로자 개인보호구에 해당하는 안전모 구매비용은 산업안전보건비로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '개인보호구 및 소모품비: 근로자에게 지급하는 개인보호구(안전모, 안전화, 안전장갑 등) 구매 비용 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전화': {
    itemName: '안전화', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '근로자 개인보호구에 해당하는 안전화 구매비용은 산업안전보건비로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '개인보호구 및 소모품비: 안전화, 안전대 등 법정 보호구 지급비용 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전장갑': {
    itemName: '안전장갑', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '근로자 보호를 위한 안전장갑은 개인보호구로 산업안전보건비 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '안전장갑 등 개인보호구 구매비용은 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전대': {
    itemName: '안전대', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '고소 작업 시 추락 방지를 위한 안전대(안전벨트)는 법정 개인보호구로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '안전대(추락방지용 벨트 및 로프 등) 구매비용은 계상 가능.', source: '고용노동부 고시' }]
  },
  '방진마스크': {
    itemName: '방진마스크', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '분진 발생 작업 현장에서 근로자에게 지급하는 방진마스크는 개인보호구로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '방진마스크, 방독마스크 등 호흡보호구 구매비용은 계상 가능.', source: '고용노동부 고시' }]
  },
  '보호안경': {
    itemName: '보호안경', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '비산물, 분진 등으로부터 눈을 보호하기 위한 보호안경은 개인보호구로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '보호안경, 차광 안경 등 구매비용은 계상 가능.', source: '고용노동부 고시' }]
  },
  '귀마개': {
    itemName: '귀마개', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '소음 작업 현장에서 근로자에게 지급하는 귀마개(청력보호구)는 개인보호구로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '귀마개, 귀덮개 등 청력보호구 구매비용은 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전조끼': {
    itemName: '안전조끼', category: '3. 개인보호구 및 소모품비 등', status: 'O', statusLabel: '계상 가능',
    summary: '시인성 확보를 위한 형광·반사 안전조끼는 근로자 안전을 위한 개인보호구로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호', content: '형광 또는 반사 기능이 있는 안전조끼는 개인보호구로 계상 가능.', source: '고용노동부 고시' }]
  },
  '소화기': {
    itemName: '소화기', category: '2. 안전시설비 등', status: 'O', statusLabel: '계상 가능',
    summary: '화재 예방을 위해 작업 현장에 비치하는 임시 소화기는 안전시설비 항목으로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제2호', content: '안전시설비: 임시 소화설비, 소화기 구매 및 관리 비용은 현장 화재 예방 목적으로 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전난간': {
    itemName: '안전난간', category: '2. 안전시설비 등', status: 'O', statusLabel: '계상 가능',
    summary: '추락 방지를 위해 임시로 설치하는 안전난간, 추락방지망 등은 안전시설비 항목으로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제2호', content: '안전시설비: 추락방지용 난간, 울타리, 가설 통로, 안전대 걸이대 등의 시설 설치 비용 계상 가능.', source: '고용노동부 고시' }]
  },
  '추락방지망': {
    itemName: '추락방지망', category: '2. 안전시설비 등', status: 'O', statusLabel: '계상 가능',
    summary: '추락 재해 방지를 위한 추락방지망(안전망) 설치 비용은 안전시설비로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제2호', content: '추락방지망, 낙하물 방지망 등 안전시설 설치 비용 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전표지판': {
    itemName: '안전표지판', category: '2. 안전시설비 등', status: 'O', statusLabel: '계상 가능',
    summary: '현장 내 위험 구역 안내 및 경고를 위한 안전표지판 구매·설치 비용은 안전시설비로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제2호', content: '안전표지판, 경고 표지, 안전 울타리 등 설치 비용 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전관리자 인건비': {
    itemName: '안전관리자 인건비', category: '1. 안전보건관계자 등의 인건비 및 업무수당 등', status: 'O', statusLabel: '계상 가능',
    summary: '선임된 안전관리자의 인건비는 산업안전보건비로 계상이 가능합니다. 단, 겸임이나 미선임 상태에서의 지급은 제한될 수 있습니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제1호', content: '안전보건관계자 인건비: 전담 안전관리자, 보건관리자의 인건비 및 수당 계상 가능.', source: '고용노동부 고시' }]
  },
  '안전교육': {
    itemName: '안전교육', category: '4. 사업장의 안전진단비 등', status: 'O', statusLabel: '계상 가능',
    summary: '법정 안전보건교육 실시에 소요되는 교육비(강사료, 교재비 등)는 산업안전보건비로 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제4호', content: '안전보건교육비: 법정 교육 실시를 위한 강사료, 교재비, 시청각 자료비 등 계상 가능.', source: '고용노동부 고시' }]
  },
  '현장용 선풍기': {
    itemName: '현장용 선풍기', category: '6. 근로자의 건강장해예방비 등', status: '△', statusLabel: '조건부 가능',
    summary: '현장 작업용 선풍기는 폭염 대책 등 근로자 건강장해 예방을 위한 목적으로 사용될 경우 조건부로 계상이 가능합니다. 단, 일반 사무실이나 휴게실용 선풍기 등은 불가할 수 있습니다.',
    bases: [{ title: '[고용노동부 질의회시] 폭염 대비 근로자 건강장해 예방 조치 관련', content: '옥외 작업장에서 근로자의 열사병 등 예방을 위해 설치하는 현장 작업용 선풍기, 이동식 에어컨 등은 건강장해예방비 항목으로 계상 가능함. 단, 현장 사무실 또는 고정식 휴게실 내 냉난방 장치는 불가.', source: '고용노동부 질의회시 및 국가법령정보센터' }]
  },
  '이동식 에어컨': {
    itemName: '이동식 에어컨', category: '6. 근로자의 건강장해예방비 등', status: '△', statusLabel: '조건부 가능',
    summary: '혹서기 폭염 속에서 옥외 작업 근로자를 위한 냉방 장치로 사용할 경우 조건부로 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 질의회시] 스마트 냉방장비 및 이동식 에어컨 계상 여부', content: '옥외 작업 장소에 설치하여 열사병 등 온열질환 예방을 목적으로 한 일시적 냉방장치(이동식 에어컨, 미스트 분무기 등) 구매 및 임대비는 계상 가능함. 단, 현장 사무실/휴게실 등에 고정식으로 임대 또는 설치하는 냉장고, 에어컨 등은 현장 관리비(시공사 부담) 성격이므로 계상 불가.', source: '고용노동부 질의회시 및 국가법령정보센터' }]
  },
  '그늘막': {
    itemName: '그늘막', category: '6. 근로자의 건강장해예방비 등', status: '△', statusLabel: '조건부 가능',
    summary: '폭염 기간 옥외 작업장 근로자의 일시적 휴식을 위한 그늘막 설치 비용은 조건부로 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 질의회시] 혹서기 임시 그늘막 설치 비용 계상 여부', content: '야외 작업 근로자들을 위해 옥외 작업 구역 인근에 임시 설치하는 천막, 간이 그늘막은 건강장해예방비로 인정. 단, 기존 가설 휴게실의 보수/유지 비용 등은 제외.', source: '고용노동부 질의회시' }]
  },
  '핫팩': {
    itemName: '핫팩', category: '6. 근로자의 건강장해예방비 등', status: '△', statusLabel: '조건부 가능',
    summary: '혹한기(11월~익년 3월) 동안 한랭질환 예방을 위해 현장 근로자에게 지급하는 핫팩은 조건부로 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 지침] 혹한기 근로자 안전 보건 가이드라인', content: '동절기 혹한 시 한랭질환 예방을 위해 근로자에게 배부하는 핫팩, 간이 발열팩, 발열조끼 등은 혹한기 기간(11월~익년 3월) 동안 한시적으로 인정. 방한파카, 일반 점퍼 등 통상적 의복은 제외.', source: '고용노동부 지침 및 국가법령정보센터' }]
  },
  '스마트 안전장비': {
    itemName: '스마트 안전장비', category: '2. 안전시설비 등', status: 'O', statusLabel: '계상 가능',
    summary: '최신 개정 고시에 따라 현장 안전 유도 및 추락·붕괴 방지를 목적으로 하는 스마트 안전장비 구입 및 임대 비용은 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 고시] 스마트 안전장비 계상 범위 및 한도 규정', content: '건설업 산업안전보건관리비 사용 기준 개정에 따라 스마트 안전 장비(스마트 안전모, 위험감지 센서, 스마트 안전조끼 등) 구입·임대비는 100% 안전보건비로 계상 가능함. 단, 현장 전체 안전보건관리비 총액의 20% 이내여야 함.', source: '고용노동부 고시 및 국가법령정보센터' }]
  },
  '신호수 수당': {
    itemName: '신호수 수당', category: '1. 안전보건관계자 등의 인건비 및 업무수당 등', status: '△', statusLabel: '조건부 가능',
    summary: '차량계 건설기계 충돌 방지나 차량 유도를 위해 전담 배치된 유도자/신호수의 인건비는 조건부 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 질의회시] 건설차량 신호수 및 장비 유도자 인건비', content: '크레인, 덤프트럭 등 대형 건설기계 충돌 예방 및 위험 부위 통제를 위해 전담 배치하여 업무를 수행한 기간 동안의 신호수 및 장비 유도자의 인건비는 계상 가능. 단, 타 작업(시공)을 주로 하며 간헐적으로 신호 업무를 하는 경우는 불인정.', source: '고용노동부 질의회시' }]
  },
  '구급약품': {
    itemName: '구급약품', category: '6. 근로자의 건강장해예방비 등', status: 'O', statusLabel: '계상 가능',
    summary: '현장 내 응급처치를 위한 구급약품이나 응급용품 구매비용은 계상이 가능합니다.',
    bases: [{ title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제6호', content: '건강장해예방비: 부상 근로자의 구급 및 치료에 필요한 구급약품(소독약, 붕대, 연고 등) 및 구급용구(구급상자, 산소호흡기 등) 구매비용 계상 가능.', source: '고용노동부 고시 및 국가법령정보센터' }]
  },
  '쿨스카프': {
    itemName: '쿨스카프', category: '6. 근로자의 건강장해예방비 등', status: '△', statusLabel: '조건부 가능',
    summary: '쿨스카프, 쿨토시 등은 혹서기 폭염 대책 등에 따라 여름철(6월~9월) 동안 조건부로 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 지침] 혹서기 폭염 대비 근로자 건강재해예방 기준', content: '6~9월 폭염 기간 동안 근로자에게 지급하는 쿨스카프, 쿨토시, 아이스조끼, 멀티스카프 등은 건강장해예방비로 계상 가능함.', source: '고용노동부 지침 및 국가법령정보센터' }]
  },
  '여름용 쿨스카프': {
    itemName: '여름용 쿨스카프', category: '6. 근로자의 건강장해예방비 등', status: '△', statusLabel: '조건부 가능',
    summary: '여름용 쿨스카프, 쿨토시 등은 혹서기 폭염 대책 등에 따라 여름철(6월~9월) 동안 조건부로 계상이 가능합니다.',
    bases: [{ title: '[고용노동부 지침] 혹서기 폭염 대비 근로자 건강재해예방 기준', content: '6~9월 폭염 기간 동안 근로자에게 지급하는 쿨스카프, 쿨토시, 아이스조끼 등은 계상 가능함.', source: '고용노동부 지침 및 국가법령정보센터' }]
  },
  '회식비': {
    itemName: '회식비', category: '계상 불가 (복리후생 항목)', status: 'X', statusLabel: '계상 불가',
    summary: '회식비는 근로자 복리후생 성격의 비용으로 산업안전보건비로 계상할 수 없습니다.',
    bases: [{ title: '[고용노동부 질의회시] 근로자 단합 목적의 지출 계상 여부', content: '회식비, 격려금, 간식비 등 사기 진작이나 단합, 친목을 도모하기 위한 비용 및 복리후생 성격의 비용은 안전보건관리비로 사용 불가.', source: '고용노동부 질의회시 및 국가법령정보센터' }]
  },
  '사무용품': {
    itemName: '사무용품', category: '계상 불가 (일반 시공/복리후생 항목)', status: 'X', statusLabel: '계상 불가',
    summary: '일반 사무용품은 안전보건과 직접 관련이 없어 산업안전보건비로 계상할 수 없습니다.',
    bases: [{ title: '[고용노동부 질의회시] 사무실 비품 및 소모품', content: '공사수행 목적의 일반 사무실 사무용품, 문구류, 종이컵 등은 안전과 직접적 연관이 없으므로 시공사 간접비 처리 사항이며 계상 불가.', source: '고용노동부 질의회시' }]
  }
};

export async function analyzeItem(query: string): Promise<AnalysisResult> {
  // Mock fallback logic
  if (isMockMode) {
    // Add artificial delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const trimmedQuery = query.trim().replace(/\s+/g, '');
    const matchedKey = Object.keys(MOCK_DATA).find(key => 
      trimmedQuery.includes(key.replace(/\s+/g, '')) || key.replace(/\s+/g, '').includes(trimmedQuery)
    );

    if (matchedKey) {
      const baseResult = MOCK_DATA[matchedKey];
      return {
        ...baseResult,
        itemName: query,
        timestamp: Date.now()
      };
    }

    // ── 휴리스틱 판별 로직 ──────────────────────────────────────────
    // 우선순위: isX(계상불가) > isDelta(조건부) > isO(계상가능) > 기본값(미확인)

    // ① 계상 가능(O): 안전보건 직접 관련 품목
    const isO = new RegExp(
      '안전모|안전화|안전화|안전장갑|안전대|안전벨트|안전망|안전로프|안전조끼|형광조끼|반사조끼|' +
      '방진마스크|방독마스크|송기마스크|방열복|방한복|방화복|' +
      '보호안경|차광안경|용접면|안면보호대|' +
      '귀마개|귀덮개|청력보호구|' +
      '낙하물방지망|추락방지망|방호망|안전네트|' +
      '안전난간|안전울타리|방책|가드레일|안전발판|' +
      '소화기|소화전|소화설비|화재감지기|' +
      '안전표지|경고표지|경고등|안전사인|' +
      '안전보건|안전관리자|보건관리자|안전점검|안전진단|안전검사|' +
      '안전교육|보건교육|위험성평가|안전회의|' +
      '추락방지|낙하방지|감전방지|붕괴방지|비산방지|' +
      '작업발판|비계|가설통로|안전통로|' +
      '방호장치|인터록|비상정지|안전커버|'  +
      '보호구|개인보호|산업안전|스마트안전장비|지능형CCTV|구급약품|구급상자|응급처치|산소호흡기'
    ).test(query);

    // ② 계상 불가(X): 시공비·복리후생·일반 사무 성격
    const isX = new RegExp(
      '시공비|시공용|공사비|공사용|공사자재|건축자재|' +
      '회식|회식비|간식|간식비|음료|커피|식대|과자|주류|' +
      '복리후생|위로금|격려금|상품권|선물|경조사|' +
      '사무용|사무용품|사무기기|사무비품|사무실가구|' +
      '청소|청소용품|청소비|환경개선|위생용품|' +
      '냉장고|세탁기|TV|텔레비전|가전제품|' +
      '책상|소파|커튼|블라인드|카펫|장식|인테리어|화분|' +
      '주차비|차량유지|연료비|유류비|' +
      '식물|조경|화단'
    ).test(query);

    // ③ 조건부 가능(△): 목적·장소·시기에 따라 결정되는 품목
    const isDelta = new RegExp(
      '선풍기|에어컨|냉방|난방|히터|온풍기|' +
      '쿨스카프|쿨토시|아이스조끼|핫팩|핫팩|방한용품|' +
      '이동식화장실|간이화장실|세면대|샤워시설|' +
      '제초|방충|방역|소독|살충|' +
      'CCTV|카메라|드론|촬영장비|' +
      '컴퓨터|노트북|태블릿|스마트폰|' +
      '의약품|구급약|구급상자|응급키트|' +
      '정수기|식수|음용수|' +
      '이동식창고|컨테이너박스|신호수|유도자|화재감시|이동식에어컨|그늘막'
    ).test(query);

    let status: 'O' | 'X' | '△';
    let statusLabel: string;
    let category: string;
    let summary: string;
    let content: string;
    let source: string;

    if (isX) {
      // 최우선: 명백한 계상 불가 항목
      status = 'X';
      statusLabel = '계상 불가';
      category = '계상 불가 (시공비/복리후생 항목)';
      summary = `입력하신 '${query}' 항목은 시공비 성격이거나 근로자 복리후생비에 해당하므로 산업안전보건비로 계상할 수 없습니다.`;
      content = `건설업 산업안전보건비 계상 및 사용기준에 따라, 시공 목적 또는 복리후생·원활한 공사수행을 위한 비품·소모품은 계상 대상에서 제외됩니다.`;
      source = '고용노동부 지침 및 국가법령정보센터';

    } else if (isDelta && !isO) {
      // 조건부: 목적·장소·시기에 따라 달라지는 항목
      status = '△';
      statusLabel = '조건부 가능';
      category = '6. 근로자의 건강장해예방비 등';
      if (/신호수|유도자/.test(query)) {
        category = '1. 안전보건관계자 등의 인건비 및 업무수당 등';
      }
      summary = `입력하신 '${query}' 항목은 법제처 국가법령정보센터 및 고용노동부 공식 질의회시에 따라 사용 목적, 기간 및 배치 조건에 따라 계상 여부가 달라집니다.`;
      content = `해당 항목은 전담 근무 여부(신호수/유도자 등) 또는 혹서기/혹한기 등 특정 기후 환경에서 근로자 보호를 목적으로 한 임시 시설 등에 한해 계상이 인정되므로 증빙 서류 구비가 필수적입니다.`;
      source = '고용노동부 질의회시 및 국가법령정보센터';

    } else if (isO) {
      // 계상 가능: 안전보건 직접 관련 품목
      status = 'O';
      statusLabel = '계상 가능';
      category =
        /인건비|관리자|보건관리|안전담당/.test(query)
          ? '1. 안전보건관계자 등의 인건비 및 업무수당 등'
          : /교육|강의|훈련|위험성평가/.test(query)
          ? '4. 사업장의 안전진단비 등'
          : /시설|난간|소화|발판|통로|비계|방지망|표지|울타리|방책|스마트안전장비/.test(query)
          ? '2. 안전시설비 등'
          : '3. 개인보호구 및 소모품비 등';
      summary = `입력하신 '${query}' 항목은 산업재해 예방을 목적으로 하는 안전보건 관련 품목으로, 고용노동부 고시 및 법제처 국가법령 정보에 따라 계상이 가능합니다.`;
      content = `해당 물품 또는 안전 설비는 고용노동부 고시 제7조 각 호의 사용 요건에 부합하며 직접적인 산업재해 예방 목적으로 인정됩니다.`;
      source = '고용노동부 고시 및 국가법령정보센터';

    } else {
      // 기본값: 키워드 미매칭 → 안전보건 관련 키워드가 없으므로 계상 불가(X)로 판별
      status = 'X';
      statusLabel = '계상 불가';
      category = '계상 불가 (미확인 품목)';
      summary = `입력하신 '${query}' 항목은 산업안전보건비 계상 기준 및 질의회시에 부합하는 안전보건 관련 키워드가 확인되지 않아 계상이 불가합니다.`;
      content = `산업안전보건관리비로 인정받기 위해서는 법령(고시 제7조) 및 고용노동부 유권해석의 인정 목록에 부합해야 합니다.`;
      source = '고용노동부 고시 기준';
    }

    return {
      itemName: query,
      category,
      status,
      statusLabel,
      summary,
      bases: [
        {
          title: `건설업 산업안전보건비 사용 적정성 유권해석 검토 (${query})`,
          content,
          source
        }
      ],
      timestamp: Date.now()
    };
  }

  // Real API path
  try {
    const ai = getAIInstance();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `물품명/상황: ${query}` }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            category: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["O", "X", "△"] },
            statusLabel: { type: Type.STRING },
            summary: { type: Type.STRING },
            bases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  source: { type: Type.STRING },
                },
                required: ["title", "content", "source"]
              }
            }
          },
          required: ["itemName", "category", "status", "statusLabel", "summary", "bases"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}
