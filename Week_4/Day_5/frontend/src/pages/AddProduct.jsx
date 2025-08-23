"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAddProductMutation } from "../redux/apiSlice"

const AddProduct = () => {
  const navigate = useNavigate()
  const [addProduct, { isLoading }] = useAddProductMutation()

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "black-tea",
    collection: "Black teas",
    origin: "",
    caffeine: "Medium Caffeine",
    stock: 0,
    isActive: true,
    tags: "",
    flavour: [],
    qualities: [],
    allergens: [],
    organic: false,
    image: null,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox" && ["organic", "isActive"].includes(name)) {
      setForm({ ...form, [name]: checked })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value)
    setForm({ ...form, [field]: options })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
      setForm({ ...form, image: cleanName });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      image: form.image,
      category: form.category,
      origin: form.origin,
      stock: Number(form.stock),
      collection: form.collection || undefined,
      caffeine: form.caffeine || undefined,
      flavour: form.flavour,
      qualities: form.qualities,
      allergens: form.allergens,
      organic: Boolean(form.organic),
      isActive: Boolean(form.isActive),
    };

    try {
      await addProduct(payload).unwrap();
      alert("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error("Add product error:", err);
      alert("Failed to add product: " + (err?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md transition">
      <h2 className="text-2xl font-prosto font-bold mb-4 text-gray-800 dark:text-gray-100">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
          required
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
          required
        >
          {["black-tea", "green-tea", "herbal-tea", "oolong-tea", "white-tea", "chai", "matcha", "rooibos", "teaware"].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Collection */}
        <select
          name="collection"
          value={form.collection}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
        >
          {["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"].map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        {/* Origin */}
        <select
          name="origin"
          value={form.origin}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
          required
        >
          <option value="" disabled>Select Origin</option>
          {["India", "Japan", "Iran", "South Africa"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        {/* Caffeine */}
        <select
          name="caffeine"
          value={form.caffeine}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
        >
          {["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock No."
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
          required
        />

        {/* Flavours */}
        <label className="block text-gray-700 dark:text-gray-300">Flavours:</label>
        <select
          multiple
          value={form.flavour}
          onChange={(e) => handleMultiSelect(e, "flavour")}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
        >
          {["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Qualities */}
        <label className="block text-gray-700 dark:text-gray-300">Qualities:</label>
        <select
          multiple
          value={form.qualities}
          onChange={(e) => handleMultiSelect(e, "qualities")}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
        >
          {["Detox", "Energy", "Relax", "Digestion"].map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>

        {/* Allergens */}
        <label className="block text-gray-700 dark:text-gray-300">Allergens:</label>
        <select
          multiple
          value={form.allergens}
          onChange={(e) => handleMultiSelect(e, "allergens")}
          className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded"
        >
          {["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {/* Checkboxes */}
        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          <span>Active</span>
        </label>

        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <input type="checkbox" name="organic" checked={form.organic} onChange={handleChange} />
          <span>Organic</span>
        </label>

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-700 dark:text-gray-300"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  )
}

export default AddProduct
