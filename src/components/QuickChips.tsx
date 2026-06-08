/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface QuickChipsProps {
  onSelect: (item: string) => void;
}

const COMMON_ITEMS = [
  '안전모', '현장용 선풍기', '안전화', '여름용 쿨스카프', '안전관리자 인건비', '소화기', '안전난간'
];

export function QuickChips({ onSelect }: QuickChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-bold text-gray-400 mr-2">자주 찾는 항목:</span>
      {COMMON_ITEMS.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-all active:scale-95"
        >
          #{item}
        </button>
      ))}
    </div>
  );
}
