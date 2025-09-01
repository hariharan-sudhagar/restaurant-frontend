import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function POSPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const navigate = useNavigate();

  // Order status configurations
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      nextStatus: 'in_progress',
      nextAction: 'Start Cooking'
    },
    in_progress: {
      label: 'In Progress',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      nextStatus: 'ready',
      nextAction: 'Mark Ready'
    },
    ready: {
      label: 'Ready',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      nextStatus: 'completed',
      nextAction: 'Complete Order'
    },
    completed: {
      label: 'Completed',
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      borderColor: 'rgba(107, 114, 128, 0.3)',
      nextStatus: null,
      nextAction: null
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      
      // Handle Laravel response structure - orders might be nested
      const ordersData = response.data.orders || response.data || [];
      
      // Ensure it's an array
      if (!Array.isArray(ordersData)) {
        console.error("Orders data is not an array:", ordersData);
        setOrders([]);
        return;
      }
      
      // Sort orders by creation time (newest first) and then by status priority
      const statusPriority = { pending: 1, in_progress: 2, ready: 3, completed: 4 };
      const sortedOrders = ordersData.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      
      // Check if it's a 404 error (endpoint doesn't exist)
      if (error.response?.status === 404) {
        console.log("Orders endpoint not found - backend may need orders API implementation");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      await fetchOrders(); // Refresh orders after update
      
      // Show success feedback
      const statusLabel = statusConfig[newStatus]?.label || newStatus;
      setTimeout(() => {
        console.log(`Order ${orderId} updated to ${statusLabel}`);
      }, 100);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return 'Today';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

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
          <p>Loading orders...</p>
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
              🍳 Kitchen POS
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              Manage order status and kitchen workflow
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={fetchOrders}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.2)';
              }}
            >
              🔄 Refresh
            </button>
            
            <button 
              onClick={() => navigate("/cart")}
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
              🛒 Go to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
              No orders yet
            </h3>
            <p style={{ color: '#94a3b8', margin: '0 0 12px 0' }}>
              Orders will appear here when customers place them
            </p>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#fbbf24'
            }}>
              💡 <strong>Backend Setup Required:</strong> Make sure your backend has the orders endpoints implemented
            </div>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isUpdating = updatingStatus[order.id];
              
              return (
                <div key={order.id} style={{
                  background: 'rgba(51, 65, 85, 0.6)',
                  border: `1px solid ${status.borderColor}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}>
                  {/* Order Header */}
                  <div style={{
                    background: status.bgColor,
                    borderBottom: `1px solid ${status.borderColor}`,
                    padding: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: 'white',
                          margin: '0 0 4px 0'
                        }}>
                          Order #{order.id}
                        </h3>
                        <p style={{
                          color: '#94a3b8',
                          fontSize: '13px',
                          margin: 0
                        }}>
                          {order.customer_name}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          background: status.bgColor,
                          border: `1px solid ${status.borderColor}`,
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: status.color,
                          marginBottom: '4px'
                        }}>
                          {status.label}
                        </div>
                        <p style={{
                          color: '#94a3b8',
                          fontSize: '11px',
                          margin: 0
                        }}>
                          {formatDate(order.created_at)} at {formatTime(order.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0 0 12px 0'
                      }}>
                        Items ({order.items?.length || 0})
                      </h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.items?.map((orderItem, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(30, 41, 59, 0.4)',
                            border: '1px solid rgba(71, 85, 105, 0.3)',
                            borderRadius: '8px',
                            padding: '12px'
                          }}>
                            <div>
                              <span style={{
                                fontWeight: '500',
                                color: 'white',
                                fontSize: '13px'
                              }}>
                                {orderItem.menu_item?.name || 'Unknown Item'}
                              </span>
                              <div style={{
                                color: '#94a3b8',
                                fontSize: '11px',
                                marginTop: '2px'
                              }}>
                                ₹{orderItem.price} × {orderItem.quantity}
                              </div>
                            </div>
                            <div style={{
                              fontWeight: '600',
                              color: 'white',
                              fontSize: '14px'
                            }}>
                              ₹{orderItem.price * orderItem.quantity}
                            </div>
                          </div>
                        )) || (
                          <div style={{
                            color: '#94a3b8',
                            fontSize: '13px',
                            fontStyle: 'italic',
                            textAlign: 'center',
                            padding: '12px'
                          }}>
                            No items found
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div style={{
                      background: 'linear-gradient(to right, rgba(51, 65, 85, 0.8), rgba(71, 85, 105, 0.8))',
                      border: '1px solid rgba(100, 116, 139, 0.5)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#cbd5e1'
                        }}>
                          Total Amount
                        </span>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: '#10b981'
                        }}>
                          ₹{order.total_price}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {status.nextStatus && (
                      <button
                        onClick={() => updateOrderStatus(order.id, status.nextStatus)}
                        disabled={isUpdating}
                        style={{
                          width: '100%',
                          background: isUpdating 
                            ? 'linear-gradient(to right, #6b7280, #4b5563)' 
                            : `linear-gradient(to right, ${status.color}, ${status.color}dd)`,
                          color: 'white',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseOver={(e) => {
                          if (!isUpdating) {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = `0 8px 16px ${status.color}40`;
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        {isUpdating ? (
                          <>
                            <div style={{
                              width: '14px',
                              height: '14px',
                              border: '2px solid rgba(255, 255, 255, 0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            {order.status === 'pending' && '🔥'}
                            {order.status === 'in_progress' && '👨‍🍳'}
                            {order.status === 'ready' && '✅'}
                            <span>{status.nextAction}</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {order.status === 'completed' && (
                      <div style={{
                        width: '100%',
                        background: 'rgba(107, 114, 128, 0.3)',
                        border: '1px solid rgba(107, 114, 128, 0.5)',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        ✅ Order Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Order Status Summary */}
        {orders.length > 0 && (
          <div style={{
            background: 'rgba(51, 65, 85, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '24px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 16px 0'
            }}>
              📊 Order Status Summary
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}>
              {Object.entries(statusConfig).map(([statusKey, config]) => {
                const count = orders.filter(order => order.status === statusKey).length;
                return (
                  <div key={statusKey} style={{
                    background: config.bgColor,
                    border: `1px solid ${config.borderColor}`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: config.color,
                      marginBottom: '4px'
                    }}>
                      {count}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#94a3b8'
                    }}>
                      {config.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}