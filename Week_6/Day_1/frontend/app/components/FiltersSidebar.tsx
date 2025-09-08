'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 't-shirts', label: 'T-shirts' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'shirts', label: 'Shirts' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'jeans', label: 'Jeans' },
];

const STYLES = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'party', label: 'Party' },
  { value: 'gym', label: 'Gym' },
];

const SIZES = ['xx-small','x-small','small','medium','large','x-large','xx-large'];
const COLORS = ['green','red','yellow','orange','blue','navy','purple','pink','white','black'];

export default function FiltersSidebar({ current = {}, onApply }: any) {
  const [category, setCategory] = useState(current.category || '');
  const [styles, setStyles] = useState<string[]>(current.styles || []);
  const [colors, setColors] = useState<string[]>(current.colors || []);
  const [sizes, setSizes] = useState<string[]>(current.sizes || []);
  const [priceMin, setPriceMin] = useState<number | undefined>(current.priceMin);
  const [priceMax, setPriceMax] = useState<number | undefined>(current.priceMax);

  const toggleArray = (arr: string[], value: string) => {
    if (arr.includes(value)) return arr.filter((v) => v !== value);
    return [...arr, value];
  };

  const handleApply = () => {
    if (priceMin !== undefined && priceMax !== undefined && priceMax < priceMin) {
      alert('Max price must be greater than or equal to Min price');
      return;
    }
    onApply({
      category: category || undefined,
      styles,
      colors,
      sizes,
      priceMin,
      priceMax,
      page: 1
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(category === c.value ? '' : c.value)}
              className={`w-full text-left px-3 py-2 rounded ${category === c.value ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Dress Style</h3>
        <div className="flex flex-col gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyles(toggleArray(styles, s.value))}
              className={`text-left px-3 py-2 rounded ${styles.includes(s.value) ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColors(toggleArray(colors, c))}
              className={`w-8 h-8 rounded-full border ${colors.includes(c) ? 'ring-2 ring-offset-1' : ''}`}
              title={c}
              style={{ backgroundColor: c === 'white' ? '#fff' : c }}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSizes(toggleArray(sizes, s))}
              className={`px-3 py-1 rounded-full border text-sm ${sizes.includes(s) ? 'bg-black text-white' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Price</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceMin || ''}
            onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : undefined)}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax || ''}
            onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
            className="w-1/2 p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-black text-white py-2 rounded"
        >
          Apply Filter
        </button>
        <button
          onClick={() => {
            setCategory('');
            setStyles([]);
            setColors([]);
            setSizes([]);
            setPriceMin(undefined);
            setPriceMax(undefined);
            onApply({ category: undefined, styles: [], colors: [], sizes: [], priceMin: undefined, priceMax: undefined, page: 1 });
          }}
          className="flex-1 border py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
