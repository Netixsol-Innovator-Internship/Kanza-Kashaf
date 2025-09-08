'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '../../lib/socket';
import Link from 'next/link';
import {
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
} from '../../store/api';

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

const COLORS = ['green','red','yellow','orange','blue','navy','purple','pink','white','black'];
const SIZES = ['xx-small','x-small','small','medium','large','x-large','xx-large','3x-large','4x-large'];

const PAYMENT_TYPES = [
  { value: 'money', label: 'Money' },
  { value: 'points', label: 'Points' },
  { value: 'hybrid', label: 'Hybrid' },
];

function computePointsPrice(price: number) {
  return Math.round(price / 10);
}
function computeSalePrice(price: number, percent: number) {
  if (!percent || percent <= 0) return price;
  return Math.round(price * (1 - percent / 100));
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductEditor({ productId }: { productId: string }) {
  const router = useRouter();
  const { data: productFromServer, isLoading, refetch } = useGetProductQuery(productId);
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadProductImagesMutation();

  const [form, setForm] = useState<any>(null);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (productFromServer) {
      setForm(JSON.parse(JSON.stringify(productFromServer)));
      setDirty(false);
      setErrors({});
    }
  }, [productFromServer]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (payload: any) => {
      if (!productId) return;
      if (payload?.productId === productId || payload?._id === productId) {
        refetch();
      }
    };

    socket.on('product-updated', handler);

    return () => {
      socket.off('product-updated', handler);
    };
  }, [productId, refetch]);

  useEffect(() => {
    if (!form) return;
    if (form.paymentType === 'points' || form.paymentType === 'hybrid') {
      const salePrice = computeSalePrice(Number(form.regularPrice || 0), Number(form.discountPercent || 0));
      const points = computePointsPrice(salePrice);
      if (form.pointsPrice !== points) {
        setForm((f: any) => ({ ...f, pointsPrice: points }));
        setDirty(true);
      }
    } else {
      if (form.pointsPrice !== 0) {
        setForm((f: any) => ({ ...f, pointsPrice: 0 }));
        setDirty(true);
      }
    }
  }, [form?.paymentType, form?.regularPrice, form?.discountPercent]);

  if (isLoading || !form) return <div className="p-8">Loading product...</div>;

  const setField = (k: string, v: any) => {
    setForm((f: any) => ({ ...f, [k]: v }));
    setDirty(true);

    if (k === 'name') {
      setErrors((e: typeof errors) => ({ ...e, name: v.trim() ? undefined : 'Product name is required' }));
    }
    if (k === 'description') {
      setErrors((e: typeof errors) => ({ ...e, description: v.trim() ? undefined : 'Description is required' }));
    }
    if (k === 'category') {
      setErrors((e: typeof errors) => ({ ...e, category: v ? undefined : 'Category is required' }));
    }
    if (k === 'style') {
      setErrors((e: typeof errors) => ({ ...e, style: v ? undefined : 'Style is required' }));
    }
    if (k === 'regularPrice') {
      setErrors((e: typeof errors) => ({
        ...e,
        regularPrice: !v || Number(v) <= 0 ? 'Regular price must be greater than zero' : undefined,
      }));
    }
  };

  const updateVariantField = (idx: number, key: string, value: any) => {
    const v = [...(form.variants || [])];
    v[idx] = { ...v[idx], [key]: value };
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const addVariant = () => {
    const v = [...(form.variants || [])];
    v.unshift({ color: 'black', images: [], sizes: [] });
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const removeVariant = (idx: number) => {
    if (!confirm('Remove this variant?')) return;
    const v = [...(form.variants || [])];
    v.splice(idx, 1);
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const addSizeToVariant = (vidx: number) => {
    const v = [...(form.variants || [])];
    const sizes = [...(v[vidx].sizes || [])];
    sizes.push({ size: 'medium', stock: 0, sku: '' });
    v[vidx] = { ...v[vidx], sizes };
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const updateSizeForVariant = (vidx: number, sidx: number, key: string, value: any) => {
    const v = [...(form.variants || [])];
    const sizes = [...(v[vidx].sizes || [])];
    sizes[sidx] = { ...sizes[sidx], [key]: value };
    v[vidx] = { ...v[vidx], sizes };
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const removeSizeFromVariant = (vidx: number, sidx: number) => {
    const v = [...(form.variants || [])];
    const sizes = [...(v[vidx].sizes || [])];
    sizes.splice(sidx, 1);
    v[vidx] = { ...v[vidx], sizes };
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const onUploadFilesForVariant = async (vidx: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const current = form.variants[vidx].images || [];
    const allowed = 3 - current.length;
    const toTake = Array.from(files).slice(0, allowed);
    if (toTake.length === 0) {
      alert('Variant already has 3 images max');
      return;
    }
    try {
      const base64s = await Promise.all(toTake.map((f) => fileToDataUrl(f)));
      const resp = await uploadImages(base64s).unwrap();
      let urls: string[] = [];
      if (Array.isArray(resp)) urls = resp;
      else if (resp && resp.urls) urls = resp.urls;
      else if (resp && resp.result && Array.isArray(resp.result)) urls = resp.result;
      else urls = resp as string[];

      const v = [...(form.variants || [])];
      v[vidx] = { ...v[vidx], images: [...(v[vidx].images || []), ...urls] };
      setForm({ ...form, variants: v });
      setDirty(true);
    } catch (err: any) {
      console.error(err);
      alert('Upload failed: ' + (err?.message || JSON.stringify(err)));
    }
  };

  const removeImageFromVariant = (vidx: number, imgIdx: number) => {
    const v = [...(form.variants || [])];
    const imgs = [...(v[vidx].images || [])];
    imgs.splice(imgIdx, 1);
    v[vidx] = { ...v[vidx], images: imgs };
    setForm({ ...form, variants: v });
    setDirty(true);
  };

  const handleUpdate = async () => {
    const newErrors: any = {};
    if (!form.name?.trim()) newErrors.name = 'Product name is required';
    if (!form.description?.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.style) newErrors.style = 'Style is required';
    if (!form.regularPrice || Number(form.regularPrice) <= 0) {
      newErrors.regularPrice = 'Regular price must be greater than zero';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: any = {
        name: form.name,
        description: form.description,
        category: form.category,
        style: form.style || undefined,
        brand: form.brand || undefined,
        regularPrice: Number(form.regularPrice || 0),
        paymentType: form.paymentType,
        discountPercent: Number(form.discountPercent || 0),
        salePercent: Number(form.salePercent || 0),
        saleStartAt: form.saleStartAt || null,
        saleEndAt: form.saleEndAt || null,
        pointsPrice: Number(form.pointsPrice || 0),
        active: form.active,
        variants: form.variants || [],
      };

      await updateProduct({ id: productId, body: payload }).unwrap();
      alert('Product updated');
      setDirty(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      alert('Update failed: ' + (err?.data?.message || err.message || JSON.stringify(err)));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(productId).unwrap();
      alert('Product deleted');
      router.push('/profile');
    } catch (err: any) {
      console.error(err);
      alert('Delete failed: ' + (err?.data?.message || err.message || JSON.stringify(err)));
    }
  };

  const handleCancel = () => {
    if (productFromServer) {
      const cloned = JSON.parse(JSON.stringify(productFromServer));
      setForm(cloned);
    }
    setDirty(false);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Product Details</h1>
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/">
            <span className="hover:underline cursor-pointer">
              Home
            </span>{" "}
            &gt; <span className="font-medium text-gray-700">All Products</span>
            &gt; <span className="font-medium text-gray-700">Product Details</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        {/* Main editor left */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Product Name</label>
              <input
                className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                value={form.name || ''}
                onChange={(e) => setField('name', e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Category</label>
              <select
                className={`w-full border rounded px-3 py-2 ${errors.category ? 'border-red-500' : ''}`}
                value={form.category || ''}
                onChange={(e) => setField('category', e.target.value)}
              >
                <option value="">Choose</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Style */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Style</label>
              <select
                className={`w-full border rounded px-3 py-2 ${errors.style ? 'border-red-500' : ''}`}
                value={form.style || ''}
                onChange={(e) => setField('style', e.target.value)}
              >
                <option value="">Choose</option>
                {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {errors.style && <p className="text-red-500 text-xs mt-1">{errors.style}</p>}
            </div>

            {/* Brand */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Brand</label>
              <input
                className="w-full border rounded px-3 py-2 border-gray-300"
                value={form.brand || ''}
                onChange={(e) => setField('brand', e.target.value)}
              />
            </div>

            {/* Payment Type */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Payment Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.paymentType || 'money'}
                onChange={(e) => setField('paymentType', e.target.value)}
              >
                {PAYMENT_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* Regular Price */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Regular Price (PKR)</label>
              <input
                type="number"
                className={`w-full border rounded px-3 py-2 ${errors.regularPrice ? 'border-red-500' : ''}`}
                value={form.regularPrice ?? 0}
                onChange={(e) => setField('regularPrice', e.target.value)}
              />
              {errors.regularPrice && <p className="text-red-500 text-xs mt-1">{errors.regularPrice}</p>}
            </div>

            {/* Discount */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Discount Percent</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 border-gray-300"
                value={form.discountPercent ?? 0}
                onChange={(e) => setField('discountPercent', e.target.value)}
              />
            </div>

            {/* Points Price */}
            <div>
              <label className="text-sm text-gray-700 block mb-1">Points Price</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 border-gray-300"
                value={form.pointsPrice ?? 0}
                readOnly
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700 block mb-1">Description</label>
              <textarea
                className={`w-full border rounded px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
                rows={6}
                value={form.description || ''}
                onChange={(e) => setField('description', e.target.value)}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Variants</h3>
              <button onClick={addVariant} className="px-3 py-1 bg-black text-white rounded">+ Add Variant</button>
            </div>

            <div className="space-y-4">
              {(form.variants || []).map((v: any, vidx: number) => (
                <div key={vidx} className="border rounded p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2">
                        <label className="text-sm text-gray-700 block mb-1">Color</label>
                        <select className="border rounded px-3 py-2" value={v.color || ''} onChange={(e) => updateVariantField(vidx, 'color', e.target.value)}>
                          {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="mb-2">
                        <label className="text-sm text-gray-700 block mb-1">Sizes</label>
                        <div className="space-y-2">
                          {(v.sizes || []).map((sz: any, sidx: number) => (
                            <div key={sidx} className="flex gap-2 items-center">
                              <select className="border rounded px-2 py-1" value={sz.size} onChange={(e) => updateSizeForVariant(vidx, sidx, 'size', e.target.value)}>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <input type="number" className="w-24 border rounded px-2 py-1" value={sz.stock} onChange={(e) => updateSizeForVariant(vidx, sidx, 'stock', Number(e.target.value))} />
                              <input placeholder="SKU" className="border rounded px-2 py-1" value={sz.sku || ''} onChange={(e) => updateSizeForVariant(vidx, sidx, 'sku', e.target.value)} />
                              <button onClick={() => removeSizeFromVariant(vidx, sidx)} className="px-2 py-1 mr-2 text-sm bg-red-500 text-white rounded">Remove</button>
                            </div>
                          ))}
                          <button onClick={() => addSizeToVariant(vidx)} className="px-2 py-1 text-sm bg-gray-100 rounded">+ Add size</button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="mb-2">
                        <label className="text-sm text-gray-700 block mb-1">Images (max 3)</label>
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center justify-end">
                            <input type="file" multiple accept="image/*" onChange={(e) => onUploadFilesForVariant(vidx, e.target.files)} />
                          </div>
                          <div className="flex gap-2">
                            {(v.images || []).map((img: string, iidx: number) => (
                              <div key={iidx} className="relative w-24 h-24 border rounded overflow-hidden">
                                <img src={img} className="w-full h-full object-cover" />
                                <button onClick={() => removeImageFromVariant(vidx, iidx)} className="absolute top-1 right-1 bg-black text-white rounded px-1">x</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <button onClick={() => removeVariant(vidx)} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Delete Variant</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div>
            <h3 className="font-medium">Summary</h3>
            <div className="text-sm text-gray-700 mt-2 space-y-1">
              <p>Sales Count: {form.salesCount ?? 0}</p>
              <p>Active: {form.active ? 'Yes' : 'No'}</p>
              <p>Rating: {form.ratingAvg ?? 0} ({form.ratingCount ?? 0})</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleUpdate}
              disabled={updating || !dirty}
              className="w-full px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Product'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
            <button
              onClick={handleCancel}
              className="w-full px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
