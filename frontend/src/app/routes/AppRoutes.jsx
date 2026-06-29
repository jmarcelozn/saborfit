import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "@/app/layouts/DefaultLayout";

import Home from "@/features/home/pages/Home";
import Profile from "@/features/profile/pages/Profile";

import Admin from "@/features/admin/pages/Admin";
import AdminProducts from "@/features/admin/pages/AdminProducts";
import ProductForm from "@/features/admin/pages/ProductForm";
import AdminUsers from "@/features/admin-users/pages/AdminUsers";

import ProductMediaManager from "@/features/product-media/pages/ProductMediaManager";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";

import ErrorPage from "@/features/error/pages/ErrorPage";
import Cart from "@/features/cart/pages/Cart";

import StoreSettings from "@/features/settings/pages/StoreSettings";

import { RequireAuth } from "@/app/guards/RequireAuth";
import { RequireAdmin } from "@/app/guards/RequireAdmin";
import { RedirectIfAuthenticated } from "@/app/guards/RedirectIfAuthenticated";

import { ROUTES } from "@/app/config/routes";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path={ROUTES.HOME}
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />

        {/* Carrinho */}
        <Route
          path={ROUTES.CART}
          element={
            <RequireAuth>
              <DefaultLayout>
                <Cart />
              </DefaultLayout>
            </RequireAuth>
          }
        />

        {/* Perfil */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <RequireAuth>
              <DefaultLayout>
                <Profile />
              </DefaultLayout>
            </RequireAuth>
          }
        />

        {/* Dashboard Principal */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        {/* Produtos */}
        <Route
          path="/dashboard/products"
          element={
            <RequireAdmin>
              <AdminProducts />
            </RequireAdmin>
          }
        />

        <Route
          path="/dashboard/products/new"
          element={
            <RequireAdmin>
              <ProductForm />
            </RequireAdmin>
          }
        />

        <Route
          path="/dashboard/products/:id"
          element={
            <RequireAdmin>
              <ProductForm />
            </RequireAdmin>
          }
        />

        <Route
          path="/dashboard/products/:productId/media"
          element={
            <RequireAdmin>
              <ProductMediaManager />
            </RequireAdmin>
          }
        />

        {/* Usuários */}
        <Route
          path="/dashboard/users"
          element={
            <RequireAdmin>
              <AdminUsers />
            </RequireAdmin>
          }
        />

        {/* Configurações */}
        <Route
          path="/dashboard/settings"
          element={
            <RequireAdmin>
              <StoreSettings />
            </RequireAdmin>
          }
        />

        {/* Auth */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <RedirectIfAuthenticated>
              <ForgotPassword />
            </RedirectIfAuthenticated>
          }
        />

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <RedirectIfAuthenticated>
              <ResetPassword />
            </RedirectIfAuthenticated>
          }
        />

        {/* Erros */}
        <Route
          path={ROUTES.ERROR}
          element={
            <DefaultLayout>
              <ErrorPage />
            </DefaultLayout>
          }
        />

        <Route
          path="*"
          element={
            <DefaultLayout>
              <ErrorPage />
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
}