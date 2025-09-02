// // MenuManagement.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = "/api/menu"; // Netlify proxy will forward this

// const MenuManagement = () => {
//   const [menu, setMenu] = useState([]);
//   const [editingItem, setEditingItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image_url: "",
//     image: null,
//   });

//   // Fetch menu items
//   const fetchMenu = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await axios.get(API_URL);

//       // ✅ Ensure menu is always an array
//       if (Array.isArray(res.data)) {
//         setMenu(res.data);
//       } else if (res.data?.data && Array.isArray(res.data.data)) {
//         setMenu(res.data.data);
//       } else {
//         console.error("Unexpected API response:", res.data);
//         setMenu([]);
//       }
//     } catch (err) {
//       console.error("Error fetching menu:", err);
//       setError("Failed to fetch menu items");
//       setMenu([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item.id);
//     setFormData({
//       name: item.name || "",
//       description: item.description || "",
//       price: item.price || "",
//       image_url: item.image_url || "",
//       image: null,
//     });
//   };

//   const handleCancel = () => {
//     setEditingItem(null);
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       image_url: "",
//       image: null,
//     });
//   };

//   const handleAdd = async () => {
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("description", formData.description);
//       data.append("price", formData.price);
//       if (formData.image) data.append("image", formData.image);
//       if (formData.image_url) data.append("image_url", formData.image_url);

//       await axios.post(API_URL, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       fetchMenu();
//       handleCancel();
//     } catch (err) {
//       console.error("Error adding item:", err);
//       setError("Failed to add item");
//     }
//   };

//   const handleUpdate = async (id) => {
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("description", formData.description);
//       data.append("price", formData.price);
//       if (formData.image) data.append("image", formData.image);
//       if (formData.image_url) data.append("image_url", formData.image_url);

//       await axios.patch(`${API_URL}/${id}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       fetchMenu();
//       handleCancel();
//     } catch (err) {
//       console.error("Error updating item:", err);
//       setError("Failed to update item");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this menu item?")) return;
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchMenu();
//     } catch (err) {
//       console.error("Error deleting item:", err);
//       setError("Failed to delete item");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg text-gray-600">Loading menu items...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-full mx-auto min-h-screen">
//       <h1 className="text-2xl font-bold mb-4 text-center">Menu Management</h1>

//       {error && (
//         <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
//           {error}
//         </div>
//       )}

//       {/* Add new item form */}
//       {!editingItem && (
//         <div className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50">
//           <h2 className="font-semibold mb-2 text-sm">Add New Menu Item</h2>
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="border p-2 rounded text-sm w-full"
//             />
//             <input
//               type="text"
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="border p-2 rounded text-sm w-full"
//             />
//             <input
//               type="number"
//               name="price"
//               placeholder="Price"
//               value={formData.price}
//               onChange={handleChange}
//               className="border p-2 rounded text-sm w-full"
//             />
//             <input
//               type="url"
//               name="image_url"
//               placeholder="Image URL"
//               value={formData.image_url}
//               onChange={handleChange}
//               className="border p-2 rounded text-sm w-full"
//             />
//             <input
//               type="file"
//               name="image"
//               onChange={handleChange}
//               accept="image/*"
//               className="border p-2 rounded text-sm w-full"
//             />
//             <button
//               className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 w-full text-sm"
//               onClick={handleAdd}
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Menu table */}
//       <div className="overflow-x-auto shadow-lg rounded-lg">
//         <table className="w-full text-xs border-collapse">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-1 text-left w-12">Img</th>
//               <th className="border p-1 text-left w-32">Name</th>
//               <th className="border p-1 text-left w-40">Description</th>
//               <th className="border p-1 text-left w-16">Price</th>
//               <th className="border p-1 text-left w-24">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {menu.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="border p-2 text-center text-gray-500">
//                   No menu items found
//                 </td>
//               </tr>
//             ) : (
//               menu.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50 border-b">
//                   <td className="border p-1">
//                     {item.image_url ? (
//                       <img
//                         src={item.image_url}
//                         alt={item.name || "Menu item"}
//                         className="w-10 h-10 object-cover rounded border mx-auto"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
//                         ?
//                       </div>
//                     )}
//                   </td>
//                   <td className="border p-1">
//                     {editingItem === item.id ? (
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="border p-1 rounded text-xs w-full"
//                       />
//                     ) : (
//                       <div className="font-medium text-xs truncate" title={item.name}>
//                         {item.name}
//                       </div>
//                     )}
//                   </td>
//                   <td className="border p-1">
//                     {editingItem === item.id ? (
//                       <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         className="border p-1 rounded text-xs w-full resize-none"
//                         rows="1"
//                       />
//                     ) : (
//                       <div className="text-xs text-gray-600 truncate" title={item.description}>
//                         {item.description}
//                       </div>
//                     )}
//                   </td>
//                   <td className="border p-1">
//                     {editingItem === item.id ? (
//                       <input
//                         type="number"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         className="border p-1 rounded text-xs w-14"
//                         step="0.01"
//                         min="0"
//                       />
//                     ) : (
//                       <span className="font-semibold text-green-600 text-xs">
//                         ₹{parseFloat(item.price || 0).toFixed(0)}
//                       </span>
//                     )}
//                   </td>
//                   <td className="border p-1">
//                     {editingItem === item.id ? (
//                       <div className="space-y-1">
//                         <input
//                           type="file"
//                           name="image"
//                           onChange={handleChange}
//                           accept="image/*"
//                           className="text-xs w-full"
//                         />
//                         <div className="flex gap-1">
//                           <button
//                             className="bg-green-500 text-white px-1 py-1 text-xs rounded hover:bg-green-600 flex-1"
//                             onClick={() => handleUpdate(item.id)}
//                           >
//                             ✓
//                           </button>
//                           <button
//                             className="bg-gray-500 text-white px-1 py-1 text-xs rounded hover:bg-gray-600 flex-1"
//                             onClick={handleCancel}
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex gap-1">
//                         <button
//                           className="bg-blue-500 text-white px-1 py-1 text-xs rounded hover:bg-blue-600 flex-1"
//                           onClick={() => handleEdit(item)}
//                         >
//                           ✏️
//                         </button>
//                         <button
//                           className="bg-red-500 text-white px-1 py-1 text-xs rounded hover:bg-red-600 flex-1"
//                           onClick={() => handleDelete(item.id)}
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MenuManagement;

// MenuManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const API_URL = "/api/menu"; // Netlify proxy will forward this

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

      // ✅ Ensure menu is always an array
      if (Array.isArray(res.data)) {
        setMenu(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setMenu(res.data.data);
      } else {
        console.error("Unexpected API response:", res.data);
        setMenu([]);
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to fetch menu items");
      setMenu([]);
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
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Menu Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Add new item form */}
      {!editingItem && (
        <div className="mb-6 p-6 border-2 border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Menu Item</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter dish name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 opacity-0">Action</label>
              <button
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu items display */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Menu Items ({menu.length})</h2>
        </div>
        
        {menu.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-lg">No menu items found</div>
            <p className="text-gray-500 mt-2">Add your first menu item using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menu.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name || "Menu item"}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-medium text-gray-900" title={item.name}>
                          {item.name}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="1"
                        />
                      ) : (
                        <div className="text-gray-600 max-w-xs truncate" title={item.description}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-20 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                        />
                      ) : (
                        <span className="font-semibold text-green-600">
                          ₹{parseFloat(item.price || 0).toFixed(0)}
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingItem === item.id ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/*"
                            className="text-xs w-full"
                          />
                          <div className="flex gap-2">
                            <button
                              className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors"
                              onClick={() => handleUpdate(item.id)}
                            >
                              ✓
                            </button>
                            <button
                              className="bg-gray-500 text-white px-3 py-1 text-sm rounded hover:bg-gray-600 transition-colors"
                              onClick={handleCancel}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
                            onClick={() => handleEdit(item)}
                          >
                            ✏️
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors"
                            onClick={() => handleDelete(item.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;