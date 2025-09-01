import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import POSPage from "./components/POSPage";
import CartPage from "./components/CartPage";
import MenuManagement from "./components/MenuManagement"; // <-- import the new page
import "./App.css";

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div className="min-h-screen font-inter">
        <Routes>
          <Route path="/" element={<MenuPage cart={cart} setCart={setCart} />} />
          <Route path="/menu" element={<MenuPage cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/menu-management" element={<MenuManagement />} /> {/* <-- new route */}
        </Routes>
      </div>
    </Router>
  );
}
