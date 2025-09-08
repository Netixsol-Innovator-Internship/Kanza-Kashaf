// frontend/app/profile/sales/start/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetProfileQuery, useGetProductsQuery, useCreateCampaignMutation } from "../../../../store/api";

const CATEGORIES = [
  { value: "t-shirts", label: "T-shirts" },
  { value: "shorts", label: "Shorts" },
  { value: "shirts", label: "Shirts" },
  { value: "hoodie", label: "Hoodie" },
  { value: "jeans", label: "Jeans" },
];

export default function StartSalePage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetProfileQuery();
  // fetch a larger list of products so admin can pick them
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ page: 1, limit: 200 });
  const products = productsLoading ? [] : productsData?.items || [];

  const [createCampaign, { isLoading: creating }] = useCreateCampaignMutation();

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [percent, setPercent] = useState<number>(10);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [startAt, setStartAt] = useState<string>("");
  const [endAt, setEndAt] = useState<string>("");

  // role guard: only admin / super_admin
  useEffect(() => {
    if (!userLoading && user) {
      const role = (user.role || "").toString().toLowerCase();
      if (!(role === "admin" || role === "super_admin")) {
        router.push("/profile"); // not allowed
      }
    }
  }, [user, userLoading, router]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a campaign name");
      return;
    }
    if (!percent || percent < 1 || percent > 100) {
      alert("Percent must be between 1 and 100");
      return;
    }
    if (!startAt || !endAt) {
      alert("Please choose start and end date/time");
      return;
    }
    const startIso = new Date(startAt).toISOString();
    const endIso = new Date(endAt).toISOString();
    if (new Date(startIso) >= new Date(endIso)) {
      alert("End date must be after start date");
      return;
    }

    const payload: any = {
      name,
      description: description || undefined,
      percent: Number(percent),
      productIds: selectedProductIds.length ? selectedProductIds : undefined,
      categories: selectedCategories.length ? selectedCategories : undefined,
      startAt: startIso,
      endAt: endIso,
    };

    try {
      await createCampaign(payload).unwrap();
      alert("✅ Campaign created");
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      alert("Failed to create campaign: " + (err?.data?.message || err.message || JSON.stringify(err)));
    }
  };

  if (userLoading) return <div className="p-6">Checking permissions...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Start Sale Campaign</h1>
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/">
            <span className="hover:underline cursor-pointer">
              Home
            </span>{" "}
            &gt; <span className="font-medium text-gray-700">Sale Campaigns</span>
            &gt; <span className="font-medium text-gray-700"> Start Sale Campaign</span>
          </Link>
        </div>
        <p className="text-gray-600 text-sm">Create a sale that applies to selected products and/or categories.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Campaign Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Discount Percent</label>
              <input type="number" min={1} max={100} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Applies to</label>
              <div className="text-sm text-gray-600">Select products below and/or categories on the right.</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Start At</label>
            <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">End At</label>
            <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Products (pick one or many)</label>
            {productsLoading ? (
              <div>Loading products...</div>
            ) : (
              <div className="max-h-56 overflow-auto border rounded p-2">
                {products.length === 0 ? (
                  <div className="text-sm text-gray-500">No products found.</div>
                ) : (
                  products.map((p: any) => (
                    <div key={p._id} className="flex items-center gap-2 py-1">
                      <input
                        id={`p_${p._id}`}
                        type="checkbox"
                        checked={selectedProductIds.includes(p._id)}
                        onChange={() => toggleProduct(p._id)}
                      />
                      <label htmlFor={`p_${p._id}`} className="text-sm">{p.name}</label>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        <div className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <h3 className="font-medium">Categories</h3>
            <div className="text-sm text-gray-600">Tick categories to include them in the campaign.</div>

            <div className="mt-3 space-y-2">
              {CATEGORIES.map((c) => (
                <div key={c.value} className="flex items-center gap-2">
                  <input id={`cat_${c.value}`} type="checkbox" checked={selectedCategories.includes(c.value)} onChange={() => toggleCategory(c.value)} />
                  <label htmlFor={`cat_${c.value}`} className="text-sm">{c.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" disabled={creating} className="w-full px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover:bg-gray-700">
              {creating ? "Creating..." : "Create Campaign"}
            </button>
            <button type="button" onClick={() => router.push("/profile/products")} className="w-full mt-2 px-4 py-2 bg-gray-100 rounded">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
