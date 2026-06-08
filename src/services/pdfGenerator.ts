/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

// A4 dimensions (mm)
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export async function generateEvidencePDF(result: AnalysisResult): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // ── 한글 처리: 유니코드 지원 폰트 로드 ──────────────────────────────
  // jsPDF 기본 폰트로 한글 직접 출력이 어려우므로
  // 브라우저 print-to-PDF 방식 대신 HTML→PDF 변환을 사용합니다.
  // 여기서는 브라우저 내장 프린트 다이얼로그를 열어 PDF 저장을 유도합니다.
  // (한글 폰트 임베딩 없이도 완벽한 출력 가능)

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }

  const statusColor =
    result.status === 'O' ? '#166534' :
    result.status === 'X' ? '#991B1B' : '#92400E';

  const statusBg =
    result.status === 'O' ? '#DCFCE7' :
    result.status === 'X' ? '#FEE2E2' : '#FEF9C3';

  const basesHTML = result.bases.map((base, idx) => `
    <div class="basis-card">
      <div class="basis-header">
        <span class="basis-index">${idx + 1}</span>
        <div class="basis-title-wrap">
          <p class="basis-title">${base.title}</p>
          <span class="basis-source">${base.source}</span>
        </div>
      </div>
      <div class="basis-content">${base.content}</div>
    </div>
  `).join('');

  const now = new Date(result.timestamp).toLocaleString('ko-KR');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>증빙근거자료_${result.itemName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
      font-size: 10pt;
      color: #1A1A1A;
      background: white;
      padding: 20mm 18mm;
    }

    /* ── 상단 헤더 ── */
    .doc-header {
      text-align: center;
      border-bottom: 3px solid #1A1A1A;
      padding-bottom: 10mm;
      margin-bottom: 8mm;
    }
    .doc-title {
      font-size: 22pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin-bottom: 2mm;
    }
    .doc-subtitle {
      font-size: 8pt;
      color: #888;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* ── 판정 결과 배지 ── */
    .verdict-box {
      display: flex;
      align-items: center;
      gap: 6mm;
      background: ${statusBg};
      border: 2px solid ${statusColor}40;
      border-radius: 8px;
      padding: 6mm 8mm;
      margin-bottom: 8mm;
    }
    .verdict-badge {
      width: 16mm;
      height: 16mm;
      background: ${statusColor};
      color: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20pt;
      font-weight: 900;
      flex-shrink: 0;
    }
    .verdict-info h2 {
      font-size: 16pt;
      font-weight: 900;
      color: ${statusColor};
    }
    .verdict-info p {
      font-size: 9pt;
      color: #555;
      margin-top: 1mm;
    }

    /* ── 기본 정보 테이블 ── */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8mm;
      font-size: 9.5pt;
    }
    .info-table th {
      background: #F5F5F5;
      padding: 3.5mm 4mm;
      text-align: left;
      font-weight: 700;
      border: 1px solid #D1D1D1;
      white-space: nowrap;
      width: 28mm;
    }
    .info-table td {
      padding: 3.5mm 4mm;
      border: 1px solid #D1D1D1;
      line-height: 1.5;
    }
    .info-table td.category {
      font-weight: 700;
      color: #FF6321;
    }

    /* ── 판별 근거 요약 ── */
    .summary-box {
      background: #F9FAFB;
      border-left: 5px solid #FF6321;
      border-radius: 0 8px 8px 0;
      padding: 5mm 6mm;
      margin-bottom: 8mm;
    }
    .summary-box .label {
      font-size: 7pt;
      font-weight: 700;
      color: #FF6321;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 2mm;
    }
    .summary-box p {
      font-size: 10pt;
      line-height: 1.7;
      font-style: italic;
      color: #333;
    }

    /* ── 증빙 근거 섹션 ── */
    .section-title {
      font-size: 11pt;
      font-weight: 900;
      border-bottom: 2px solid #E5E5E5;
      padding-bottom: 3mm;
      margin-bottom: 5mm;
      display: flex;
      align-items: center;
      gap: 2mm;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 14px;
      background: #FF6321;
      border-radius: 2px;
      margin-right: 1mm;
    }

    .basis-card {
      border: 1px solid #E5E5E5;
      border-radius: 8px;
      padding: 5mm 6mm;
      margin-bottom: 4mm;
      page-break-inside: avoid;
    }
    .basis-header {
      display: flex;
      align-items: flex-start;
      gap: 4mm;
      margin-bottom: 3mm;
    }
    .basis-index {
      width: 7mm;
      height: 7mm;
      background: #FF6321;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 0.5mm;
    }
    .basis-title-wrap { flex: 1; }
    .basis-title {
      font-size: 10pt;
      font-weight: 700;
      color: #1A1A1A;
      line-height: 1.4;
    }
    .basis-source {
      font-size: 7.5pt;
      color: #999;
      font-weight: 500;
    }
    .basis-content {
      background: #FAFAFA;
      border-radius: 4px;
      padding: 3.5mm 4mm;
      font-size: 9pt;
      color: #444;
      line-height: 1.7;
      border: 1px solid #F0F0F0;
    }

    /* ── 서명란 ── */
    .signature-section {
      margin-top: 10mm;
      border-top: 1px solid #E5E5E5;
      padding-top: 6mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .doc-info {
      font-size: 7.5pt;
      color: #999;
      line-height: 1.8;
    }
    .signature-box {
      text-align: center;
    }
    .signature-box p {
      font-size: 9pt;
      font-weight: 700;
      margin-bottom: 6mm;
    }
    .signature-line {
      display: flex;
      gap: 12mm;
    }
    .sign-item {
      text-align: center;
    }
    .sign-item .role {
      font-size: 8.5pt;
      font-weight: 700;
      margin-bottom: 8mm;
    }
    .sign-item .line {
      border-bottom: 1.5px solid #999;
      width: 36mm;
      padding-bottom: 1mm;
      font-size: 7.5pt;
      color: #bbb;
      text-align: center;
    }

    @media print {
      body { padding: 0; }
      @page {
        size: A4;
        margin: 18mm 15mm;
      }
    }
  </style>
</head>
<body>
  <!-- 문서 제목 -->
  <div class="doc-header">
    <div class="doc-title">산업안전보건관리비 계상 증빙근거자료</div>
    <div class="doc-subtitle">Evidence Document for Industrial Safety & Health Management Budget</div>
  </div>

  <!-- 판정 결과 -->
  <div class="verdict-box">
    <div class="verdict-badge">${result.status}</div>
    <div class="verdict-info">
      <h2>${result.itemName} — ${result.statusLabel}</h2>
      <p>항목 분류: ${result.category || '산업안전보건관리비'}</p>
    </div>
  </div>

  <!-- 기본 정보 -->
  <table class="info-table">
    <tbody>
      <tr>
        <th>물품 / 내역</th>
        <td><strong>${result.itemName}</strong></td>
        <th style="width:28mm;">계상 가능 여부</th>
        <td><strong style="color:${statusColor};">${result.statusLabel} (${result.status})</strong></td>
      </tr>
      <tr>
        <th>항목 분류</th>
        <td class="category" colspan="3">${result.category || '산업안전보건관리비 계상 항목'}</td>
      </tr>
      <tr>
        <th>분석 일시</th>
        <td colspan="3">${now}</td>
      </tr>
    </tbody>
  </table>

  <!-- 판별 근거 요약 -->
  <div class="summary-box">
    <div class="label">▪ 판별 근거 요약</div>
    <p>${result.summary}</p>
  </div>

  <!-- 증빙 근거 자료 -->
  <div class="section-title">관련 법적 근거 및 질의회시 (${result.bases.length}건)</div>
  ${basesHTML}

  <!-- 서명란 -->
  <div class="signature-section">
    <div class="doc-info">
      <p>본 문서는 SafeCash AI 시스템을 통해 자동 생성된 참고 자료입니다.</p>
      <p>최종 판단은 담당 감리원 및 발주청 지침에 따라 확인하시기 바랍니다.</p>
      <p>출처: 고용노동부 고시 「건설업 산업안전보건비 계상 및 사용기준」</p>
    </div>
    <div class="signature-box">
      <p>위와 같이 산업안전보건관리비 계상을 확인합니다.</p>
      <div class="signature-line">
        <div class="sign-item">
          <div class="role">작 성 자</div>
          <div class="line">(인)</div>
        </div>
        <div class="sign-item">
          <div class="role">안전관리자</div>
          <div class="line">(인)</div>
        </div>
        <div class="sign-item">
          <div class="role">현장소장</div>
          <div class="line">(인)</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
