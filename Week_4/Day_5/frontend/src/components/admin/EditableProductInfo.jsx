
import React, { useState, useEffect } from "react";
import { useUpdateProductMutation } from "../../features/products/productsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const EditableProductInfo = ({ product, onUpdated }) => {
  const me = useSelector(selectCurrentUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
  });
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    setForm({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
    });
  }, [product]);

  if (!me || (me.role !== "admin" && me.role !== "superAdmin")) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { id: product._id, ...form };
      await updateProduct(payload).unwrap();
      setEditing(false);
      onUpdated && onUpdated();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Update failed");
    }
  };

  if (!editing) {
    return (
      <div className="space-y-2">
        <button onClick={() => setEditing(true)} className="px-3 py-1 rounded-lg border">
          Edit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border rounded-2xl p-4 mt-2">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">Name</span>
          <input className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Price</span>
          <input type="number" min="0" step="0.01" className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" value={form.price} onChange={(e)=>setForm({...form, price: Number(e.target.value)})} />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm">Description</span>
        <textarea rows={4} className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm">Stock</span>
        <input type="number" min="0" className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" value={form.stock} onChange={(e)=>setForm({...form, stock: Number(e.target.value)})} />
      </label>
      <div className="flex gap-2">
        <button disabled={isLoading} type="submit" className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black">
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={()=>setEditing(false)} className="px-4 py-2 rounded-xl border">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditableProductInfo;
