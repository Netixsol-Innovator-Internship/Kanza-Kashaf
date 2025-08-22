
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddProductMutation } from "../../features/products/productsApi";

const categories = ["black-tea","green-tea","herbal-tea","oolong-tea","white-tea","chai","matcha","rooibos","teaware"];
const collections = ["Black teas","Green teas","White teas","Chai","Matcha","Herbal teas","Oolong","Rooibos","Teaware"];
const caffeineLevels = ["No Caffeine","Low Caffeine","Medium Caffeine","High Caffeine"];
const flavours = ["Spicy","Sweet","Citrus","Smooth","Fruity","Floral","Grassy","Minty","Bitter","Creamy"];
const qualities = ["Detox","Energy","Relax","Digestion"];
const allergens = ["Lactose-free","Gluten-free","Nuts-free","Soy-free"];
const origins = ["India","Japan","Iran","South Africa"];

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    origin: "",
    stock: 0,
    collection: "",
    caffeine: "Medium Caffeine",
    flavour: [],
    qualities: [],
    allergens: [],
    organic: false,
  });
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useAddProductMutation();

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const toggleInArray = (key, value) =>
    setForm((s) => {
      const arr = new Set(s[key]);
      arr.has(value) ? arr.delete(value) : arr.add(value);
      return { ...s, [key]: Array.from(arr) };
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(form).unwrap();
      navigate("/collection"); // adjust to your collection page route
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Name</span>
            <input className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required value={form.name} onChange={(e)=>update("name", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Price</span>
            <input type="number" min="0" step="0.01" className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required value={form.price} onChange={(e)=>update("price", Number(e.target.value))} />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Description</span>
          <textarea className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required rows={4} value={form.description} onChange={(e)=>update("description", e.target.value)} />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Image URL or /images/..</span>
            <input className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required value={form.image} onChange={(e)=>update("image", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Stock</span>
            <input type="number" min="0" className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required value={form.stock} onChange={(e)=>update("stock", Number(e.target.value))} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Category</span>
            <select className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required value={form.category} onChange={(e)=>update("category", e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Origin</span>
            <select className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" required value={form.origin} onChange={(e)=>update("origin", e.target.value)}>
              <option value="">Select origin</option>
              {origins.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm">Collection</span>
            <select className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" value={form.collection} onChange={(e)=>update("collection", e.target.value)}>
              <option value="">None</option>
              {collections.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">Caffeine</span>
            <select className="border rounded-xl px-3 py-2 dark:bg-gray-950 dark:border-gray-700" value={form.caffeine} onChange={(e)=>update("caffeine", e.target.value)}>
              {caffeineLevels.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <fieldset className="border rounded-xl p-3">
            <legend className="text-sm px-1">Flavour</legend>
            <div className="flex flex-wrap gap-2">
              {flavours.map((f)=> (
                <label key={f} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.flavour.includes(f)} onChange={()=>toggleInArray("flavour", f)} />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="border rounded-xl p-3">
            <legend className="text-sm px-1">Qualities</legend>
            <div className="flex flex-wrap gap-2">
              {qualities.map((f)=> (
                <label key={f} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.qualities.includes(f)} onChange={()=>toggleInArray("qualities", f)} />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="border rounded-xl p-3">
            <legend className="text-sm px-1">Allergens</legend>
            <div className="flex flex-wrap gap-2">
              {allergens.map((f)=> (
                <label key={f} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.allergens.includes(f)} onChange={()=>toggleInArray("allergens", f)} />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.organic} onChange={(e)=>update("organic", e.target.checked)} />
          <span>Organic</span>
        </label>

        <div className="flex gap-3">
          <button disabled={isLoading} type="submit" className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black">
            {isLoading ? "Saving..." : "Create"}
          </button>
          <button type="button" onClick={()=>history.back()} className="px-4 py-2 rounded-xl border">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
