"use client";

import { useState, useEffect } from "react";
import api from "@/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
};

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, "_id">>({
    name: "",
    price: 0,
    images: [],
    description: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get<Product[]>("/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? parseFloat(value)
          : name === "images"
          ? value.split(",").map((img) => img.trim())
          : value,
    }));
  };

  const handleAdd = async () => {
    if (!form.name || !form.category || form.images.length === 0) {
      alert("Please fill in all required fields and add at least one image.");
      return;
    }
    try {
      const { data: newProduct } = await api.post<Product>("/products", form);
      setProducts((prev) => [...prev, newProduct]);
      resetForm();
    } catch (err) {
      console.error("Failed to create product", err);
      alert("Error creating product");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await api.put(`/products/${editingId}`, form);
      setProducts((prev) =>
        prev.map((p) => (p._id === editingId ? { ...p, ...form } : p))
      );
      resetForm();
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update product", err);
      alert("Error updating product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Error deleting product");
    }
  };

  const startEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price,
      images: product.images,
      description: product.description,
      category: product.category,
    });
    setEditingId(product._id);
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: 0,
      images: [],
      description: "",
      category: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 pt-30 space-y-6">
      <h1 className="text-2xl font-bold">Your Products</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Price ($)</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1 font-medium">Image URLs (comma separated)</label>
          <input
            name="images"
            value={form.images.join(", ")}
            onChange={handleChange}
            placeholder="Enter image URLs separated by commas"
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1 font-medium">Product Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="border p-2 rounded h-32 resize-y"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="home-Appliances">Home Appliances</option>
          </select>
        </div>

        <button
          onClick={editingId ? handleUpdate : handleAdd}
          className={`col-span-2 py-2 rounded text-white ${
            editingId ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex gap-4 items-center border p-3 rounded"
          >
            <img
              src={product.images?.[0] || "/images/placeholder.png"}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{product.name}</h2>
              <p>
                ${product.price.toFixed(2)} • {product.description}
              </p>
              <p className="text-sm text-gray-500">{product.category}</p>
              {product.images?.length > 1 && (
                <p className="text-xs text-gray-400">
                  +{product.images.length - 1} more image
                  {product.images.length - 1 > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEdit(product)}
                className="text-blue-600 border border-blue-500 px-2 py-1 rounded hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-600 border border-red-500 px-2 py-1 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
