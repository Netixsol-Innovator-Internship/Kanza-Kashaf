"use client";

import React from "react";
import Link from "next/link";
import { useGetActiveCampaignsQuery } from "../../../store/api";

export default function SaleCampaignsPage() {
  const { data, isLoading, error } = useGetActiveCampaignsQuery();

  if (isLoading) return <div>Loading campaigns...</div>;
  if (error) return <div className="text-red-600">Failed to load campaigns</div>;

  const campaigns = data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sale Campaigns</h1>
          <div className="mb-6 text-sm text-gray-500">
            <Link href="/">
              <span className="hover:underline cursor-pointer">
                Home
              </span>{" "}
              &gt; <span className="font-medium text-gray-700">Sale Campaigns</span>
            </Link>
          </div>
        </div>
        <Link
          href="/profile/sales/start"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Start New Sale
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-gray-500">No active campaigns found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c: any) => (
            <div key={c._id} className="border rounded p-4 bg-white shadow-sm">
              <h2 className="font-semibold text-lg">{c.name}</h2>
              <p className="text-sm text-gray-600">{c.description}</p>
              <div className="mt-2 text-sm">
                <span className="font-medium">{c.percent}% OFF</span>
                <br />
                <span>From: {new Date(c.startAt).toLocaleString()}</span>
                <br />
                <span>To: {new Date(c.endAt).toLocaleString()}</span>
              </div>
              {c.products?.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Applies to {c.products.length} product(s)
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
