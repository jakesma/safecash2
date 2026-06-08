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
      <div className="relative group flex items-center">
        <input
          type="text"
          name="query"
          placeholder="물품명 또는 구매 상황을 입력하세요 (예: 현장용 선풍기)"
          disabled={isLoading}
          className="w-full p-6 pl-16 bg-white border-2 border-transparent focus:border-primary rounded-2xl shadow-xl text-xl outline-none transition-all placeholder:text-gray-300 disabled:opacity-50"
        />
        <div className="absolute left-6 text-gray-400 group-focus-within:text-primary transition-colors">
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Search className="w-6 h-6 stroke-[3]" />
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-4 px-6 py-3 bg-ink text-white rounded-xl font-bold hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          판별하기
        </button>
      </div>
    </form>
  );
}
