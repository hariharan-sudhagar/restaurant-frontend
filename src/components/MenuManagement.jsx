// MenuManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Use relative path so Netlify _redirects works
const API_URL = "/api/menu";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    image: null,
  });

  // Fetch menu items
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_URL);
      setMenu(res.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      image_url: item.image_url || "",
      image: null,
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      image: null,
    });
  };

  const handleAdd = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);
      if (formData.image_url) data.append("image_url", formData.image_url);

      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchMenu();
      handleCancel();
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);
      if (formData.image_url) data.append("image_url", formData.image_url);

      await axios.patch(`${API_URL}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchMenu();
      handleCancel();
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMenu();
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Menu Management</h1>

      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Add new item form */}
      {!editingItem && (
        <div className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="font-semibold mb-2 text-sm">Add New Menu Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded text-sm w-full"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded text-sm w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded text-sm w-full"
            />
            <input
              type="url"
              name="image_url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={handleChange}
              className="border p-2 rounded text-sm w-full"
            />
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="border p-2 rounded text-sm w-full"
            />
            <button
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 w-full text-sm"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Menu table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-1 text-left w-12">Img</th>
              <th className="border p-1 text-left w-32">Name</th>
              <th className="border p-1 text-left w-40">Description</th>
              <th className="border p-1 text-left w-16">Price</th>
              <th className="border p-1 text-left w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {menu.length === 0 ? (
              <tr>
                <td colSpan="5" className="border p-2 text-center text-gray-500">
                  No menu items found
                </td>
              </tr>
            ) : (
              menu.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-b">
                  <td className="border p-1">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name || "Menu item"}
                        className="w-10 h-10 object-cover rounded border mx-auto"
                        style={{ maxWidth: "40px", maxHeight: "40px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs"
                      style={{ display: item.image_url ? "none" : "flex" }}
                    >
                      ?
                    </div>
                  </td>
                  <td className="border p-1">
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border p-1 rounded text-xs w-full"
                      />
                    ) : (
                      <div className="font-medium text-xs truncate" title={item.name}>
                        {item.name}
                      </div>
                    )}
                  </td>
                  <td className="border p-1">
                    {editingItem === item.id ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border p-1 rounded text-xs w-full resize-none"
                        rows="1"
                      />
                    ) : (
                      <div className="text-xs text-gray-600 truncate" title={item.description}>
                        {item.description && item.description.length > 30
                          ? item.description.substring(0, 30) + "..."
                          : item.description}
                      </div>
                    )}
                  </td>
                  <td className="border p-1">
                    {editingItem === item.id ? (
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border p-1 rounded text-xs w-14"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      <span className="font-semibold text-green-600 text-xs">
                        ₹{parseFloat(item.price || 0).toFixed(0)}
                      </span>
                    )}
                  </td>
                  <td className="border p-1">
                    {editingItem === item.id ? (
                      <div className="space-y-1">
                        <input
                          type="file"
                          name="image"
                          onChange={handleChange}
                          accept="image/*"
                          className="text-xs w-full"
                        />
                        <div className="flex gap-1">
                          <button
                            className="bg-green-500 text-white px-1 py-1 text-xs rounded hover:bg-green-600 flex-1"
                            onClick={() => handleUpdate(item.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="bg-gray-500 text-white px-1 py-1 text-xs rounded hover:bg-gray-600 flex-1"
                            onClick={handleCancel}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          className="bg-blue-500 text-white px-1 py-1 text-xs rounded hover:bg-blue-600 flex-1"
                          onClick={() => handleEdit(item)}
                        >
                          ✏️
                        </button>
                        <button
                          className="bg-red-500 text-white px-1 py-1 text-xs rounded hover:bg-red-600 flex-1"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagement;
