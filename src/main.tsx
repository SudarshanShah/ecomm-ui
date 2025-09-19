import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import { Amplify } from "aws-amplify";
import { parseAmplifyConfig } from "aws-amplify/utils";
import App from "./App.tsx";
import AddProduct from "./pages/AddProduct.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import RegisterForm from "./pages/Register.tsx";
import LoginForm from "./pages/Login.tsx";
import awsConfig from "./aws-exports";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import PublicRoute from "./components/auth/PublicRoute.tsx";

Amplify.configure(parseAmplifyConfig(awsConfig));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="add-product" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddProduct />
              </ProtectedRoute>
              } />
            <Route path="register" element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
              } />
            <Route path="login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
              } />
          </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
