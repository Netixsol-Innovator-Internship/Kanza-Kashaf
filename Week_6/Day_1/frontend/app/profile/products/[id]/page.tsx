'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetProfileQuery } from '../../../../store/api';
import ProductEditor from '../../../components/ProductEditor';

export default function AdminProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { data: user, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (!isLoading && user) {
      const role = (user.role || '').toString().toLowerCase();
      if (!(role === 'admin' || role === 'super_admin')) {
        router.push(`/products/${id}`);
      }
    }
  }, [user, isLoading, id, router]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!id) return <div className="p-8">Invalid product id.</div>;

  return <ProductEditor productId={id} />;
}
