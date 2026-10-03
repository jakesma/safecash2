/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    if (query.trim()) {
      onSearch(query.trim());
      e.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            name="query"
            placeholder="물품명 또는 구매 상황을 입력하세요 (예: 현장용 선풍기)"
            disabled={isLoading}
            className="w-full rounded-2xl border-2 border-transparent bg-white p-4 pl-12 text-base shadow-xl outline-none transition-all placeholder:text-gray-300 focus:border-primary disabled:opacity-50 sm:p-6 sm:pl-16 sm:text-xl"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary sm:left-6">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
            ) : (
              <Search className="h-5 w-5 stroke-[3] sm:h-6 sm:w-6" />
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:scale-100 disabled:opacity-50 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
        >
          판별하기
        </button>
      </div>
    </form>
  );
}
