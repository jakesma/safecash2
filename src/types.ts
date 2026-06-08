/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EligibilityStatus = 'O' | 'X' | '△' | 'UNKNOWN';

export interface LegalBasis {
  title: string;
  content: string;
  source: string;
}

export interface AnalysisResult {
  itemName: string;
  category?: string;
  status: EligibilityStatus;
  statusLabel: string; // "계상 가능", "계상 불가", "조건부 가능"
  summary: string;
  bases: LegalBasis[];
  timestamp: number;
}

export interface Bookmark {
  id: string;
  result: AnalysisResult;
}

export interface SearchHistory {
  id: string;
  itemName: string;
  status: EligibilityStatus;
  timestamp: number;
}
