import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rappers from "./pages/Rappers";
import Battles from "./pages/Battles";
import BattleDetails from "./pages/BattleDetails";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import MyBets from "./pages/MyBets";
import MyPurchases from "./pages/MyPurchases";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminRappers from "./pages/admin/AdminRappers";
import AdminBattles from "./pages/admin/AdminBattles";
import AdminPurchases from "./pages/admin/AdminPurchases";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Router>
          <Navbar />
          <main className="app-main container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/rappers" element={<Rappers />} />
              <Route path="/battles" element={<Battles />} />
              <Route path="/battles/:id" element={<BattleDetails />} />
              <Route path="/products" element={<Products />} />

              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-bets"
                element={
                  <PrivateRoute>
                    <MyBets />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-purchases"
                element={
                  <PrivateRoute>
                    <MyPurchases />
                  </PrivateRoute>
                }
              />

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/rappers"
                element={
                  <AdminRoute>
                    <AdminRappers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/battles"
                element={
                  <AdminRoute>
                    <AdminBattles />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/purchases"
                element={
                  <AdminRoute>
                    <AdminPurchases />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>

          <footer className="footer-urban text-center">
            BarzArena © {new Date().getFullYear()} – Freestyle, apuestas y merch
          </footer>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;

