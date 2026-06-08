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

반드시 다음 정보를 포함한 JSON 형식으로 응답하세요:
1. itemName: 입력된 물품명
2. category: 계상 항목 분류 (예: 1. 안전보건관계자 인건비 등, 2. 안전시설비 등, 3. 개인보호구 및 소모품비 등 ...)
3. status: 'O', 'X', '△' 중 하나
4. statusLabel: "계상 가능", "계상 불가", "조건부 가능" 중 하나
5. summary: 판별 이유에 대한 간결한 요약 (한글)
6. bases: 공신력 있는 근거 자료 리스트. 특히 '질의회시(Q&A)' 내용을 상세히 포함하세요.
   - title: 근거 명칭 또는 질의 제목 (예: [질의] 현장용 선풍기 구입비용 계상 여부)
   - content: 핵심 내용 또는 답변 요약. 실제 질의응답 현장 상황을 반영하여 구체적으로 작성.
   - source: 출처 기관명 (예: 고용노동부, 산업안전보건공단)

최신 고용노동부 고시(건설업 산업안전보건비 계상 및 사용기준)를 기준으로 판단해 주세요.
`;

const MOCK_DATA: Record<string, Omit<AnalysisResult, 'timestamp'>> = {
  '안전모': {
    itemName: '안전모',
    category: '3. 개인보호구 및 소모품비 등',
    status: 'O',
    statusLabel: '계상 가능',
    summary: '근로자 개인보호구에 해당하는 안전모 구매비용은 산업안전보건비로 계상이 가능합니다.',
    bases: [
      {
        title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호',
        content: '개인보호구 및 소모품비: 근로자에게 지급하는 개인보호구(안전모, 안전화, 안전장갑 등) 구매 비용 계상 가능.',
        source: '고용노동부 고시'
      }
    ]
  },
  '현장용 선풍기': {
    itemName: '현장용 선풍기',
    category: '6. 근로자의 건강장해예방비 등',
    status: '△',
    statusLabel: '조건부 가능',
    summary: '현장 작업용 선풍기는 폭염 대책 등 근로자 건강장해 예방을 위한 목적으로 사용될 경우 조건부로 계상이 가능합니다. 단, 일반 사무실이나 휴게실용 선풍기 등은 불가할 수 있습니다.',
    bases: [
      {
        title: '폭염 대비 근로자 건강장해 예방 조치 관련 질의회시',
        content: '옥외 작업장에서 근로자의 열사병 등 예방을 위해 설치하는 현장 작업용 선풍기, 이동식 에어컨 등은 건강장해예방비 항목으로 계상 가능함. 단, 현장 사무실 또는 고정식 휴게실 내 냉난방 장치는 불가.',
        source: '고용노동부 질의회시'
      }
    ]
  },
  '안전화': {
    itemName: '안전화',
    category: '3. 개인보호구 및 소모품비 등',
    status: 'O',
    statusLabel: '계상 가능',
    summary: '근로자 개인보호구에 해당하는 안전화 구매비용은 산업안전보건비로 계상이 가능합니다.',
    bases: [
      {
        title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제3호',
        content: '개인보호구 및 소모품비: 안전화, 안전대 등 법정 보호구 지급비용 계상 가능.',
        source: '고용노동부 고시'
      }
    ]
  },
  '여름용 쿨스카프': {
    itemName: '여름용 쿨스카프',
    category: '6. 근로자의 건강장해예방비 등',
    status: '△',
    statusLabel: '조건부 가능',
    summary: '여름용 쿨스카프, 쿨토시 등은 고용노동부 혹서기 특별대책 등에 따라 폭염 기간(6월~9월) 동안 한시적으로 계상이 가능합니다.',
    bases: [
      {
        title: '혹서기 폭염 대비 근로자 건강재해예방 기준',
        content: '6월에서 9월 사이 폭염 기간 동안 근로자에게 지급하는 쿨스카프, 쿨토시, 멀티스카프, 아이스조끼 등은 계상 가능함.',
        source: '고용노동부 지침'
      }
    ]
  },
  '안전관리자 인건비': {
    itemName: '안전관리자 인건비',
    category: '1. 안전보건관계자 등의 인건비 및 업무수당 등',
    status: 'O',
    statusLabel: '계상 가능',
    summary: '선임된 안전관리자의 인건비는 산업안전보건비로 계상이 가능합니다. 단, 겸임이나 미선임 상태에서의 지급은 제한될 수 있습니다.',
    bases: [
      {
        title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제1호',
        content: '안전보건관계자 인건비: 전담 안전관리자, 보건관리자의 인건비 및 수당 계상 가능.',
        source: '고용노동부 고시'
      }
    ]
  },
  '소화기': {
    itemName: '소화기',
    category: '2. 안전시설비 등',
    status: 'O',
    statusLabel: '계상 가능',
    summary: '화재 예방을 위해 작업 현장에 비치하는 임시 소화기는 안전시설비 항목으로 계상이 가능합니다.',
    bases: [
      {
        title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제2호',
        content: '안전시설비: 임시 소화설비, 소화기 구매 및 관리 비용은 현장 화재 예방 목적으로 계상 가능.',
        source: '고용노동부 고시'
      }
    ]
  },
  '안전난간': {
    itemName: '안전난간',
    category: '2. 안전시설비 등',
    status: 'O',
    statusLabel: '계상 가능',
    summary: '추락 방지를 위해 임시로 설치하는 안전난간, 추락방지망 등은 안전시설비 항목으로 계상이 가능합니다.',
    bases: [
      {
        title: '건설업 산업안전보건비 계상 및 사용기준 제7조 제1항 제2호',
        content: '안전시설비: 추락방지용 난간, 울타리, 가설 통로, 안전대 걸이대 등의 시설 설치 비용 계상 가능.',
        source: '고용노동부 고시'
      }
    ]
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

    // Heuristics for non-exact queries
    let status: 'O' | 'X' | '△' = '△';
    let statusLabel = '조건부 가능';
    let category = '9. 그 밖의 안전보건비용';
    let summary = `입력하신 '${query}' 항목은 사용 목적 및 장소에 따라 조건부로 계상이 가능할 수 있습니다.`;
    let content = `작업 현장 및 사용 목적에 따라 부합 여부를 검토해야 하며, 시공비나 근로자 복리후생 성격의 사용은 계상 대상에서 제외됩니다.`;
    let source = '고용노동부 기준';

    const isO = /(안전|보호구|소화|난간|울타리|방지망|안전보건|교육|경고|보안경|귀마개)/i.test(query);
    const isX = /(시공|사무실|휴게실|복리후생|회식|커피|음료수|간식|환경개선|청소|사무용)/i.test(query);

    if (isO && !isX) {
      status = 'O';
      statusLabel = '계상 가능';
      summary = `입력하신 '${query}' 항목은 산업안전보건 관련 규정 및 사용 기준에 부합하여 안전보건비로 계상이 가능합니다.`;
      category = query.includes('인건비') || query.includes('관리자')
        ? '1. 안전보건관계자 등의 인건비 및 업무수당 등'
        : query.includes('시설') || query.includes('난간') || query.includes('소화')
        ? '2. 안전시설비 등'
        : '3. 개인보호구 및 소모품비 등';
      content = `해당 물품 또는 활동은 산업재해 예방을 목적으로 하고 있어, 건설업 산업안전보건비 계상 및 사용기준 제7조 규정에 해당합니다.`;
    } else if (isX) {
      status = 'X';
      statusLabel = '계상 불가';
      summary = `입력하신 '${query}' 항목은 시공비 성격, 단순 환경개선비, 근로자 복리후생비 등에 해당하므로 산업안전보건비로 계상할 수 없습니다.`;
      category = '계상 불가 (일반 시공/복리후생 항목)';
      content = `산업안전보건법에 따라 시공 상 또는 복리후생, 원활한 공사수행 목적 등으로 설치/지급하는 비품 및 소모품 등은 안전보건비 계상 대상에서 제외됩니다.`;
      source = '고용노동부 지침';
    }

    return {
      itemName: query,
      category,
      status,
      statusLabel,
      summary,
      bases: [
        {
          title: `건설업 산업안전보건비 사용 적정성 검토 (${query})`,
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
