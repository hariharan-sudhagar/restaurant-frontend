import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function CartPage({ cart, setCart }) {
  const [customerName, setCustomerName] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = item.qty + change;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

const placeOrder = async () => {
  setIsPlacingOrder(true);

  const orderData = {
    customer_name: customerName || `Customer ${Math.floor(Math.random() * 1000)}`,
    items: cart.map((c) => ({
      menu_item_id: c.id,
      quantity: c.qty,
    })),
  };

  console.log("🛒 Sending orderData:", orderData); // 🔍 DEBUG

  try {
    await api.post("/orders", orderData);
    alert("Order placed successfully! Check the POS for kitchen updates.");
    setCart([]);
    setCustomerName("");
    
  } catch (error) {
    console.error("❌ Error placing order:", error.response?.data || error.message);
    alert("Error placing order. Please try again.");
  } finally {
    setIsPlacingOrder(false);
  }
};


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
          maxWidth: '1000px',
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
              🛒 Shopping Cart
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              Review your order and checkout
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => navigate("/")}
              style={{
                background: 'rgba(51, 65, 85, 0.8)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(71, 85, 105, 0.8)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(51, 65, 85, 0.8)';
              }}
            >
              ← Back to Menu
            </button>
            

          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: 'rgba(51, 65, 85, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>🛒</div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                Your cart is empty
              </h3>
              <p style={{ color: '#94a3b8', margin: '0 0 20px 0' }}>
                Add some items from our menu
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div>
              {/* Cart Items */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: 'white', 
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🛒 Order Summary ({cart.length} items)
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      background: 'rgba(51, 65, 85, 0.6)',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        alignItems: 'center',
                        gap: '16px'
                      }}>
                        {/* Item Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#4b5563'
                          }}>
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:12px;">🍽️</div>';
                              }}
                            />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{
                              fontWeight: '600',
                              color: 'white',
                              margin: 0,
                              fontSize: '14px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.name}
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                              ₹{item.price} each
                            </p>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(30, 41, 59, 0.6)',
                          border: '1px solid rgba(71, 85, 105, 0.5)',
                          borderRadius: '8px',
                          padding: '4px'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              background: 'rgba(71, 85, 105, 0.5)',
                              border: '1px solid rgba(100, 116, 139, 0.5)',
                              borderRadius: '4px',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                              e.target.style.color = '#fca5a5';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'rgba(71, 85, 105, 0.5)';
                              e.target.style.color = 'white';
                            }}
                          >
                            −
                          </button>
                          <span style={{
                            color: 'white',
                            fontWeight: '600',
                            width: '24px',
                            textAlign: 'center',
                            fontSize: '14px'
                          }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              background: 'rgba(71, 85, 105, 0.5)',
                              border: '1px solid rgba(100, 116, 139, 0.5)',
                              borderRadius: '4px',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                              e.target.style.color = '#6ee7b7';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'rgba(71, 85, 105, 0.5)';
                              e.target.style.color = 'white';
                            }}
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Price and Remove */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '4px'
                          }}>
                            ₹{item.price * item.qty}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              color: '#f87171',
                              background: 'none',
                              border: 'none',
                              fontSize: '11px',
                              cursor: 'pointer',
                              transition: 'color 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.color = '#ef4444';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.color = '#f87171';
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{
                background: 'linear-gradient(to right, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.7))',
                border: '1px solid rgba(100, 116, 139, 0.5)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                    Total Amount
                  </span>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: '#3b82f6' // Fallback
                  }}>
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: 'white',
                  fontWeight: '500',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter customer name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0 0' }}>
                  Leave empty for auto-generated name
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={isPlacingOrder || cart.length === 0}
                style={{
                  width: '100%',
                  background: isPlacingOrder 
                    ? 'linear-gradient(to right, #6b7280, #4b5563)' 
                    : 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (!isPlacingOrder && cart.length > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {isPlacingOrder ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    💳 <span>Place Order - ₹{totalPrice}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  
}