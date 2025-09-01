import React, { useEffect, useState } from "react";
import api from "../api";
import MenuItemCard from "../components/MenuItemCard";
import { useNavigate } from "react-router-dom";

export default function MenuPage({ cart, setCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/menu").then((res) => {
      setMenuItems(res.data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error loading menu:", error);
      setLoading(false);
    });
  }, []);

  const addToCart = (item) => {
    const exist = cart.find((c) => c.id === item.id);
    if (exist) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#cbd5e1'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #3b82f6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(71, 85, 105, 0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              margin: '0 0 4px 0',
              background: 'linear-gradient(to right, #f8fafc, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🍽️ Menu
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              Pick items and head to POS
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/cart")}
            style={{
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🛒 Go to Cart
            {totalItems > 0 && (
              <span style={{
                background: '#10b981',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menu Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {menuItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <p>No menu items available</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import api from "../api";
// import MenuItemCard from "../components/MenuItemCard";
// import { useNavigate } from "react-router-dom";

// export default function MenuPage({ cart, setCart }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     image_url: ''
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get("/menu").then((res) => {
//       setMenuItems(res.data);
//       setLoading(false);
//     }).catch((error) => {
//       console.error("Error loading menu:", error);
//       setLoading(false);
//     });
//   }, []);

//   const addToCart = (item) => {
//     const exist = cart.find((c) => c.id === item.id);
//     if (exist) {
//       setCart(
//         cart.map((c) =>
//           c.id === item.id ? { ...c, qty: c.qty + 1 } : c
//         )
//       );
//     } else {
//       setCart([...cart, { ...item, qty: 1 }]);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       // Convert price to number
//       const productData = {
//         ...formData,
//         price: parseFloat(formData.price)
//       };

//       const response = await api.post("/menu", productData);
      
//       // Add the new item to the menu items list
//       setMenuItems(prev => [...prev, response.data]);
      
//       // Reset form and close modal
//       setFormData({
//         name: '',
//         description: '',
//         price: '',
//         image_url: ''
//       });
//       setShowAddForm(false);
      
//       alert("Product added successfully!");
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("Error adding product. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

//   if (loading) {
//     return (
//       <div style={{ 
//         minHeight: '100vh', 
//         background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         color: '#cbd5e1'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{
//             width: '40px',
//             height: '40px',
//             border: '3px solid #3b82f6',
//             borderTop: '3px solid transparent',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 16px'
//           }}></div>
//           <p>Loading menu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       minHeight: '100vh', 
//       background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
//       color: '#f8fafc'
//     }}>
//       {/* Header */}
//       <div style={{
//         background: 'rgba(30, 41, 59, 0.95)',
//         backdropFilter: 'blur(10px)',
//         borderBottom: '1px solid rgba(71, 85, 105, 0.5)',
//         position: 'sticky',
//         top: 0,
//         zIndex: 50,
//         padding: '20px'
//       }}>
//         <div style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           flexWrap: 'wrap',
//           gap: '16px'
//         }}>
//           <div>
//             <h1 style={{
//               fontSize: '28px',
//               fontWeight: '800',
//               margin: '0 0 4px 0',
//               background: 'linear-gradient(to right, #f8fafc, #cbd5e1)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent'
//             }}>
//               🍽️ Menu
//             </h1>
//             <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
//               Pick items and head to POS
//             </p>
//           </div>
          
//           <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//             <button 
//               onClick={() => setShowAddForm(true)}
//               style={{
//                 background: 'linear-gradient(to right, #10b981, #059669)',
//                 color: 'white',
//                 border: 'none',
//                 padding: '12px 20px',
//                 borderRadius: '12px',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 transition: 'all 0.2s ease'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.transform = 'translateY(-1px)';
//                 e.target.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.3)';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = 'none';
//               }}
//             >
//               ➕ Add Product
//             </button>

//             <button 
//               onClick={() => navigate("/cart")}
//               style={{
//                 background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
//                 color: 'white',
//                 border: 'none',
//                 padding: '12px 20px',
//                 borderRadius: '12px',
//                 fontWeight: '600',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 transition: 'all 0.2s ease',
//                 position: 'relative'
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.transform = 'translateY(-1px)';
//                 e.target.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)';
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = 'none';
//               }}
//             >
//               🛒 Go to Cart
//               {totalItems > 0 && (
//                 <span style={{
//                   background: '#10b981',
//                   color: 'white',
//                   fontSize: '12px',
//                   fontWeight: 'bold',
//                   borderRadius: '50%',
//                   width: '20px',
//                   height: '20px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginLeft: '4px'
//                 }}>
//                   {totalItems}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Product Modal */}
//       {showAddForm && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0, 0, 0, 0.7)',
//           backdropFilter: 'blur(5px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 100,
//           padding: '20px'
//         }}>
//           <div style={{
//             background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
//             borderRadius: '16px',
//             padding: '32px',
//             width: '100%',
//             maxWidth: '500px',
//             border: '1px solid rgba(71, 85, 105, 0.5)',
//             boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
//           }}>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '24px'
//             }}>
//               <h2 style={{
//                 fontSize: '24px',
//                 fontWeight: '700',
//                 margin: 0,
//                 color: '#f8fafc'
//               }}>
//                 ➕ Add New Product
//               </h2>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '24px',
//                   cursor: 'pointer',
//                   color: '#94a3b8',
//                   padding: '4px'
//                 }}
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: '8px',
//                   fontWeight: '600',
//                   color: '#e2e8f0'
//                 }}>
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     borderRadius: '8px',
//                     border: '1px solid #475569',
//                     background: 'rgba(30, 41, 59, 0.8)',
//                     color: '#f8fafc',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s ease'
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#475569'}
//                   placeholder="e.g., Margherita Pizza"
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: '8px',
//                   fontWeight: '600',
//                   color: '#e2e8f0'
//                 }}>
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                   rows={3}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     borderRadius: '8px',
//                     border: '1px solid #475569',
//                     background: 'rgba(30, 41, 59, 0.8)',
//                     color: '#f8fafc',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s ease',
//                     resize: 'vertical',
//                     minHeight: '80px'
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#475569'}
//                   placeholder="e.g., Classic cheese and tomato pizza"
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: '8px',
//                   fontWeight: '600',
//                   color: '#e2e8f0'
//                 }}>
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   required
//                   min="0"
//                   step="0.01"
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     borderRadius: '8px',
//                     border: '1px solid #475569',
//                     background: 'rgba(30, 41, 59, 0.8)',
//                     color: '#f8fafc',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s ease'
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#475569'}
//                   placeholder="e.g., 299.00"
//                 />
//               </div>

//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: '8px',
//                   fontWeight: '600',
//                   color: '#e2e8f0'
//                 }}>
//                   Image URL *
//                 </label>
//                 <input
//                   type="url"
//                   name="image_url"
//                   value={formData.image_url}
//                   onChange={handleInputChange}
//                   required
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     borderRadius: '8px',
//                     border: '1px solid #475569',
//                     background: 'rgba(30, 41, 59, 0.8)',
//                     color: '#f8fafc',
//                     fontSize: '14px',
//                     outline: 'none',
//                     transition: 'border-color 0.2s ease'
//                   }}
//                   onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
//                   onBlur={(e) => e.target.style.borderColor = '#475569'}
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>

//               <div style={{
//                 display: 'flex',
//                 gap: '12px',
//                 justifyContent: 'flex-end'
//               }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddForm(false)}
//                   style={{
//                     background: 'rgba(71, 85, 105, 0.8)',
//                     color: '#e2e8f0',
//                     border: '1px solid #475569',
//                     padding: '12px 24px',
//                     borderRadius: '8px',
//                     fontWeight: '600',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     transition: 'all 0.2s ease'
//                   }}
//                   onMouseOver={(e) => {
//                     e.target.style.background = 'rgba(71, 85, 105, 1)';
//                   }}
//                   onMouseOut={(e) => {
//                     e.target.style.background = 'rgba(71, 85, 105, 0.8)';
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   style={{
//                     background: submitting 
//                       ? 'rgba(16, 185, 129, 0.6)' 
//                       : 'linear-gradient(to right, #10b981, #059669)',
//                     color: 'white',
//                     border: 'none',
//                     padding: '12px 24px',
//                     borderRadius: '8px',
//                     fontWeight: '600',
//                     cursor: submitting ? 'not-allowed' : 'pointer',
//                     fontSize: '14px',
//                     transition: 'all 0.2s ease',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px'
//                   }}
//                   onMouseOver={(e) => {
//                     if (!submitting) {
//                       e.target.style.transform = 'translateY(-1px)';
//                       e.target.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.3)';
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     if (!submitting) {
//                       e.target.style.transform = 'translateY(0)';
//                       e.target.style.boxShadow = 'none';
//                     }
//                   }}
//                 >
//                   {submitting ? (
//                     <>
//                       <div style={{
//                         width: '16px',
//                         height: '16px',
//                         border: '2px solid white',
//                         borderTop: '2px solid transparent',
//                         borderRadius: '50%',
//                         animation: 'spin 1s linear infinite'
//                       }}></div>
//                       Adding...
//                     </>
//                   ) : (
//                     '✅ Add Product'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Menu Content */}
//       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
//         {menuItems.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
//             <p>No menu items available</p>
//           </div>
//         ) : (
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
//             gap: '20px'
//           }}>
//             {menuItems.map((item) => (
//               <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* CSS Animation */}
//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }