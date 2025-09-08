'use client';

import React from 'react';

export default function Pagination({ page = 1, limit = 12, total = 0, onPageChange }: any) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      {pages.map((p: number) => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 border rounded ${p === page ? 'bg-black text-white' : ''}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  );
}
